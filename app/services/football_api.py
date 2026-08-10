import requests
from config import Config

def get_match_results(match_id):
    url = f"https://api.football-data.org/v4/matches/{match_id}&status=FINISHED"
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

def get_upcoming_matches(competition_code, season):
    # Retrieving upcoming matches 
    url = f"https://api.football-data.org/v4/competitions/{competition_code}/matches?season={season}&status=SCHEDULED"
    headers = {
        "X-Auth-Token": Config.FOOTBALL_API_KEY
    }
    response = requests.get(url, headers=headers)
    data = response.json()

    matches = data["matches"]
    if not matches:
        return None

    # A list of dictionaries of results to return
    results = [
        {
            'home_team': match["homeTeam"]["name"],
            'away_team': match["awayTeam"]["name"],
            'utc_date': match["utcDate"],
            'match_id': match["id"]
        }
        for match in matches
    ]

    return results

def get_current_teams(competition_code):
    url = f"https://api.football-data.org/v4/competitions/{competition_code}/teams"
    headers = {
        "X-Auth-Token": Config.FOOTBALL_API_KEY
    }
    response = requests.get(url, headers=headers)
    data = response.json()

    teams = data["teams"]
    if not teams:
        return None

    # Returns a list of current team names
    results = [
        team["shortName"]
        for team in teams
    ]

    return results