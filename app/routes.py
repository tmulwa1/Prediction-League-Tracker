from flask import Blueprint, render_template, request, redirect, url_for, session
from app.models import User, Event, Prediction
from app import db
from app.services.f1_api import get_current_drivers
from app.services.football_api import get_team_crests
from datetime import datetime

# Blueprint for the main routes of the application
main = Blueprint('main', __name__)

def get_current_user():
    # Helper function to get the current user
    user_id = session.get('user_id')
    if not user_id:
        return None

    user = User.query.filter_by(id=user_id).first()
    return user

@main.route('/')
def index():
    user = get_current_user()
    # Query for upcoming events ordered in ascending order, and separated by sport
    f1_events = Event.query.filter(Event.sport == 'F1', Event.lock_time > datetime.utcnow()).order_by(Event.event_date).all()
    football_events = Event.query.filter(Event.sport == 'Football', Event.lock_time > datetime.utcnow()).order_by(Event.event_date).all()

    # Returns empty list if there are no upcoming football events
    team_crests = get_team_crests("PL") if football_events else {}
    football_cards = []
    for event in football_events:
        parts = event.name.split(" vs ")
        home_team = parts[0] if len(parts) == 2 else None
        away_team = parts[1] if len(parts) == 2 else None
        football_cards.append({
            'event': event,
            'home_team': home_team,
            'away_team': away_team,
            'home_crest': team_crests.get(home_team),
            'away_crest': team_crests.get(away_team)
        })
    return render_template('index.html', user=user, f1_events=f1_events, football_events=football_events, football_cards=football_cards)

@main.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        user = User.query.filter_by(username=username).first()
        if not user:
            user = User(username=username)
            db.session.add(user)
            db.session.commit()

        session['user_id'] = user.id
        return redirect(url_for('main.index'))

    return render_template('login.html')

@main.route('/predict/<int:event_id>', methods=['GET', 'POST'])
def predict(event_id):
    user = get_current_user()
    # If user doesn't exist, redirect to login page
    if not user:
        return redirect(url_for('main.login'))

    event = Event.query.get(event_id)
    if not event:
        return "Event not found", 404

    if event.lock_time <= datetime.utcnow():
        return "Predictions are closed for this event", 403

    drivers = None
    if event.sport == 'F1':
        drivers = get_current_drivers(2026)

    home_team = None
    away_team = None
    if event.sport == 'Football':
        # Splitting on the vs to get the two team names
        parts = event.name.split(" vs ")
        if len(parts) == 2:
            home_team = parts[0]
            away_team = parts[1]

    # Checks if user has made a prediction for this event before
    prediction = Prediction.query.filter_by(user_id = user.id, event_id = event.id).first()
    existing_podium = prediction.predicted_podium.split(",") if prediction and prediction.predicted_podium else []

    if request.method == 'POST':
        # F1 branch
        if event.sport == 'F1':
            predicted_winner = request.form.get('predicted_winner')
            # Podium places have separate dropdowns so have to join them
            podium_1 = request.form.get('podium_1')
            podium_2 = request.form.get('podium_2')
            podium_3 = request.form.get('podium_3')
            predicted_podium = ",".join([podium_1, podium_2, podium_3])

            # If a prediction already exists, user can update it
            if prediction:
                prediction.predicted_winner = predicted_winner
                prediction.predicted_podium = predicted_podium

            else:
            # Otherwise a new prediction is created
                prediction = Prediction(
                    user_id=user.id,
                    event_id=event_id,
                    predicted_winner=predicted_winner,
                    predicted_podium=predicted_podium
                )
            # Football branch
        else:
            predicted_home_score = int(request.form.get('predicted_home_score'))
            predicted_away_score = int(request.form.get('predicted_away_score'))

            if prediction:
                prediction.predicted_home_score = predicted_home_score
                prediction.predicted_away_score = predicted_away_score

            else:
                prediction = Prediction(
                    user_id=user.id,
                    event_id=event_id,
                    predicted_home_score=predicted_home_score,
                    predicted_away_score=predicted_away_score
                )

        db.session.add(prediction)
        db.session.commit()
        return redirect(url_for('main.index'))
    
    return render_template('predict.html', event=event, drivers=drivers, prediction=prediction, existing_podium=existing_podium, home_team=home_team, away_team=away_team)

@main.route('/leaderboard')
def leaderboard():
    users = User.query.all()
    leaderboard_data = []

    for user in users:
        # Sums up points awarded
        total_points = sum(p.points_awarded for p in user.predictions)
        leaderboard_data.append({'username': user.username, 'points': total_points})

    # Sorting leaderboard data by highest points
    leaderboard_data.sort(key=lambda entry: entry['points'], reverse=True)

    return render_template('leaderboard.html', leaderboard_data=leaderboard_data)

@main.route('/history')
def history():
    user = get_current_user()
    if not user:
        return redirect(url_for('main.login'))

    # Sorts events
    predictions = sorted(user.predictions, key=lambda p: p.event.event_date)
    
    return render_template('history.html', predictions=predictions)