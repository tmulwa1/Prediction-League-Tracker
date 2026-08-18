# Create a new API routes file
from flask import Blueprint, jsonify, request, session
from app.models import User, Event, Prediction, Result
from app import db
from app.services.f1_api import get_current_drivers
from app.services.football_api import get_team_crests
from datetime import datetime
from sqlalchemy import func

api = Blueprint('api', __name__, url_prefix='/api')

def get_current_user():
    user_id = session.get('user_id')
    if not user_id:
        return None
    return User.query.filter_by(id=user_id).first()

@api.route('/events')
def get_events():
    # Get upcoming events
    
    f1_events = Event.query.filter(
        Event.sport == 'F1'
    ).order_by(Event.event_date).all()
    
    football_events = Event.query.filter(
        Event.sport == 'Football'
    ).order_by(Event.event_date).all()

    # Get team crests
    team_names = set()
    for e in football_events:
        if ' vs ' in e.name:
            parts = e.name.split(' vs ')
            team_names.add(parts[0].strip())
            team_names.add(parts[1].strip())

    crests = {}
    if team_names:
        crests = get_team_crests('PL') 
    
    # Convert to JSON
    f1_data = [{
        'id': e.id,
        'name': e.name,
        'sport': e.sport,
        'event_date': e.event_date.isoformat(),
        'lock_time': e.lock_time.isoformat(),
        'is_finished': e.is_finished
    } for e in f1_events]
    
    football_data = []
    for e in football_events:
        home_team = None
        away_team = None
        home_logo = None
        away_logo = None
        
        if ' vs ' in e.name:
            parts = e.name.split(' vs ')
            home_team = parts[0].strip()
            away_team = parts[1].strip()
            # Get the crests from the dictionary
            home_logo = crests.get(home_team)
            away_logo = crests.get(away_team)

        football_data.append({
            'id': e.id,
            'name': e.name,
            'sport': e.sport,
            'event_date': e.event_date.isoformat(),
            'lock_time': e.lock_time.isoformat(),
            'is_finished': e.is_finished,
            'home_team': home_team,
            'away_team': away_team,
            'home_logo': home_logo,
            'away_logo': away_logo
        })
    
    return jsonify({
        'f1_events': f1_data,
        'football_events': football_data
    })

@api.route('/user')
def get_user():
    # Get current user info
    user = get_current_user()
    if not user:
        return jsonify({'user': None}), 401
    return jsonify({
        'user': {
            'id': user.id,
            'username': user.username
        }
    })

@api.route('/predictions/<int:event_id>', methods=['GET'])
def get_prediction(event_id):
    # Get user's prediction for an event
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Not logged in'}), 401
    
    prediction = Prediction.query.filter_by(
        user_id=user.id, 
        event_id=event_id
    ).first()
    
    if not prediction:
        return jsonify({'prediction': None})
    
    return jsonify({
        'prediction': {
            'id': prediction.id,
            'predicted_winner': prediction.predicted_winner,
            'predicted_podium': prediction.predicted_podium.split(',') if prediction.predicted_podium else [],
            'predicted_home_score': prediction.predicted_home_score,
            'predicted_away_score': prediction.predicted_away_score,
            'points_awarded': prediction.points_awarded
        }
    })

@api.route('/predictions/<int:event_id>', methods=['POST'])
def save_prediction(event_id):
    # Save or update a prediction
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Not logged in'}), 401
    
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    
    if event.lock_time <= datetime.utcnow():
        return jsonify({'error': 'Predictions are closed'}), 403
    
    data = request.json
    prediction = Prediction.query.filter_by(
        user_id=user.id, 
        event_id=event_id
    ).first()
    
    if event.sport == 'F1':
        predicted_winner = data.get('predicted_winner')
        podium = data.get('predicted_podium', [])
        predicted_podium = ','.join(podium)
        
        if prediction:
            prediction.predicted_winner = predicted_winner
            prediction.predicted_podium = predicted_podium
        else:
            prediction = Prediction(
                user_id=user.id,
                event_id=event_id,
                predicted_winner=predicted_winner,
                predicted_podium=predicted_podium
            )
    else:  # Football
        predicted_home_score = data.get('predicted_home_score')
        predicted_away_score = data.get('predicted_away_score')
        
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
    
    return jsonify({'success': True, 'message': 'Prediction saved'})

@api.route('/leaderboard')
def get_leaderboard():
    # Get leaderboard data
    users = User.query.all()
    leaderboard_data = []
    
    for user in users:
        total_points = sum(p.points_awarded for p in user.predictions)
        leaderboard_data.append({
            'username': user.username,
            'points': total_points
        })
    
    leaderboard_data.sort(key=lambda x: x['points'], reverse=True)
    
    # Add rankings
    for i, entry in enumerate(leaderboard_data, 1):
        entry['rank'] = i
    
    return jsonify({'leaderboard': leaderboard_data})

@api.route('/history')
def get_history():
    # Get user's prediction history
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Not logged in'}), 401
    
    predictions = sorted(user.predictions, key=lambda p: p.event.event_date)
    
    history_data = [{
        'event_name': p.event.name,
        'sport': p.event.sport,
        'event_date': p.event.event_date.isoformat(),
        'predicted_winner': p.predicted_winner,
        'predicted_podium': p.predicted_podium.split(',') if p.predicted_podium else [],
        'predicted_home_score': p.predicted_home_score,
        'predicted_away_score': p.predicted_away_score,
        'points_awarded': p.points_awarded,
        'is_finished': p.event.is_finished
    } for p in predictions]
    
    return jsonify({'history': history_data})

@api.route('/event/<int:event_id>')
def get_event(event_id):
    # Get event details for prediction page
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    
    drivers = None
    home_team = None
    away_team = None
    
    if event.sport == 'F1':
        drivers = get_current_drivers(2026)
    else:  # Football
        parts = event.name.split(' vs ')
        if len(parts) == 2:
            home_team = parts[0]
            away_team = parts[1]
    
    return jsonify({
        'event': {
            'id': event.id,
            'name': event.name,
            'sport': event.sport,
            'event_date': event.event_date.isoformat(),
            'lock_time': event.lock_time.isoformat(),
            'is_finished': event.is_finished
        },
        'drivers': drivers,
        'home_team': home_team,
        'away_team': away_team
    })