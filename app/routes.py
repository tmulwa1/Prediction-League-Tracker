from flask import Blueprint, render_template, request, redirect, url_for, session
from app.models import User, Event, Prediction
from app import db
from datetime import datetime

# Blueprint for the main routes of the application
main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

def get_current_user():
    # Helper function to get the current user
    user_id = session.get('user_id')
    if not user_id:
        return None

    user = User.query.filter_by(id=user_id).first()
    return user

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

    if request.method == 'POST':
        # F1 branch
        if event.sport == 'F1':
            predicted_winner = request.form.get('predicted_winner')
            predicted_podium = request.form.get('predicted_podium')

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

            prediction = Prediction(
                user_id=user.id,
                event_id=event_id,
                predicted_home_score=predicted_home_score,
                predicted_away_score=predicted_away_score
            )
        db.session.add(prediction)
        db.session.commit()
        return redirect(url_for('main.index'))
    
    return render_template('predict.html')