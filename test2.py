from app import create_app
from app.models import Event, Result, Prediction

app = create_app()
with app.app_context():
    event = Event.query.get(1)
    print("Event finished:", event.is_finished)

    result = Result.query.filter_by(event_id=1).first()
    if result:
        print("Actual winner:", result.actual_winner)
        print("Actual podium:", result.actual_podium)
    else:
        print("No Result row found!")

    prediction = Prediction.query.filter_by(event_id=1, user_id=1).first()
    print("Points awarded:", prediction.points_awarded)