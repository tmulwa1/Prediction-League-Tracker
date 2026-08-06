from datetime import datetime
from app import create_app, db
from app.models import Event
from app.services.f1_api import get_upcoming_races
from app.services.football_api import get_upcoming_matches

def parse_race_datetime(date_str, time_str):
    # If time it null, sets midnight as the default
    if not time_str:
        time_str = "00:00:00"

    # Removes the trailing Z
    time_str = time_str.removesuffix("Z")
    # Combine two strings into one
    combined = f"{date_str} {time_str}"

    result = datetime.strptime(combined, "%Y-%m-%d %H:%M:%S")
    return result

def parse_match_datetime(datetime_str):
    # Helper function to help parse the ISO string
    parsed = datetime_str.replace("T", " ").removesuffix("Z")
    result = datetime.strptime(parsed, "%Y-%m-%d %H:%M:%S")
    return result

app = create_app()
with app.app_context():
    races = get_upcoming_races(2026)

    for race in races:
        # Checks whether an event already exists
        if not Event.query.filter_by(sport='F1', external_id=race["round"]).first():
            event = Event(
                sport="F1",
                external_id=race["round"],
                name=race["race_name"],
                event_date=parse_race_datetime(race["date"], race["time"]),
                lock_time=parse_race_datetime(race["date"], race["time"]),
                is_finished = False
            )
            # Adding Event instance to database session
            db.session.add(event)
            
    matches = get_upcoming_matches("PL", 2026)

    for match in matches:
        if not Event.query.filter_by(sport="Football", external_id=match["match_id"]).first():
            home = match["home_team"]
            away = match["away_team"]
            combined = f"{home} vs {away}"
            match_dt = parse_match_datetime(match["utc_date"])
            event = Event(
                sport="Football",
                external_id=match["match_id"],
                name=combined,
                event_date=match_dt,
                lock_time=match_dt,
                is_finished=False
            )
            db.session.add(event)

    db.session.commit()