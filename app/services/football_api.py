import requests
from config import Config

def get_match_results(match_id):
    url = f"https://api.football-data.org/v4/matches/{match_id}"
    headers = {
        "X-Auth-Token": Config.FOOTBALL_API_KEY
    }
    response = requests.get(url, headers=headers)
    data = response.json()

    if data["status"] != "FINISHED":
        return None

    # Extracting match details from data
    home_team = data["homeTeam"]["name"]
    away_team = data["awayTeam"]["name"]
    home_score = data["score"]["fullTime"]["home"]
    away_score = data["score"]["fullTime"]["away"]

    # A dictionary of results to return
    results = {
        'home_team': home_team,
        'away_team': away_team,
        'home_score': home_score,
        'away_score': away_score,
        'status': data["status"],
        'utc_date': data["utcDate"]
    }

    return results