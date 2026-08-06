from datetime import datetime
from app import create_app, db
from app.models import Event, Result, Prediction
from app.services.f1_api import get_race_results
from app.services.football_api import get_match_results
from app.services.scoring import calculate_f1_points, calculate_football_points

app = create_app()
with app.app_context():
    # Fetching events that aren't finished yet
    pending_events = Event.query.filter(Event.is_finished == False, Event.event_date <= datetime.utcnow()).all()

    for event in pending_events:
        if event.sport == 'F1':
            race = get_race_results(2026, event.external_id)
            if race:
                # Turning list into string
                podium = ",".join(race["podium"])
                results = Result(
                    event_id=event.id,
                    actual_winner=race["winner"],
                    actual_podium=podium
                )
                predictions = Prediction.query.filter_by(event_id=event.id).all()
                for prediction in predictions:
                    calculate_f1_points(prediction, race)
                db.session.add(results)
                event.is_finished = True

        elif event.sport == 'Football':
            match = get_match_results(event.external_id)
            if match:
                results = Result(
                    event_id=event.id,
                    actual_home_score=match["home_score"],
                    actual_away_score=match["away_score"]
                )
                predictions = Prediction.query.filter_by(event_id=event.id).all()
                for prediction in predictions:
                    calculate_football_points(prediction, match)
                db.session.add(results)
                event.is_finished = True

    db.session.commit()
