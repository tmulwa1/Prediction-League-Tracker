import requests
from config import Config
def get_race_results(season, round_number):
    url = f"{Config.F1_BASE_URL}/{season}/{round_number}/results.json"
    response = requests.get(url)
    data = response.json()

    # Extracting Races list from data if availble
    races = data["MRData"]["RaceTable"]["Races"]
    if not races:
        return None

    race = races[0]
    # Building the podium list 
    podium = [
        result["Driver"]["familyName"]
        for result in race["Results"]
        if int(result["position"]) <= 3
    ]

    winner = podium[0] if podium else None

    # A dictionary of results to return
    results = {
        'race_name': race["raceName"],
        'date': race["date"],
        'winner': winner,
        'podium': podium
    }

    return results