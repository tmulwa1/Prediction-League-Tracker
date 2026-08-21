from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

# Creating the four core tables

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # SQLAlchemy loads related objects on-access
    predictions = db.relationship('Prediction', backref='user', lazy=True)

    # Mathematically hash the password
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sport = db.Column(db.String(20), nullable=False)
    external_id = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(200), nullable=False)

    event_date = db.Column(db.DateTime, nullable=False)
    lock_time = db.Column(db.DateTime, nullable=False)
    is_finished = db.Column(db.Boolean, default=False)

    predictions = db.relationship('Prediction', backref='event', lazy=True)
    # One-to-one relationship with Result table, one Event has only one Result
    result = db.relationship('Result', backref='event', uselist=False, lazy=True)

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)

    # F1 predictions
    predicted_winner = db.Column(db.String(100), nullable=True)
    predicted_podium = db.Column(db.String(300), nullable=True)

    # Football predictions
    predicted_home_score = db.Column(db.Integer, nullable=True)
    predicted_away_score = db.Column(db.Integer, nullable=True)

    # General
    points_awarded = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Result(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)

    # F1 results
    actual_winner = db.Column(db.String(100), nullable=True)
    actual_podium = db.Column(db.String(300), nullable=True)

    # Football results
    actual_home_score = db.Column(db.Integer, nullable=True)
    actual_away_score = db.Column(db.Integer, nullable=True)

    fetched_at = db.Column(db.DateTime, default=datetime.utcnow)