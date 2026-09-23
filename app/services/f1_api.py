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

def get_upcoming_races(season):
    url = f"{Config.F1_BASE_URL}/{season}.json"
    response = requests.get(url)
    data = response.json()

    races = data["MRData"]["RaceTable"]["Races"]
    if not races:
        return None

    # Extracting raceName, date, time and round for each race
    results = [
        {
            'race_name': race["raceName"],
            'date': race["date"],
            'time': race["time"] if "time" in race else None,
            'round': race["round"]
        }
        for race in races
    ]

    return results

def get_current_drivers(season):
    # Fallback list of drivers we know should be in F1
    FALLBACK_DRIVERS = [
        "Verstappen", "Tsunoda", "Norris", "Piastri", "Leclerc", "Hamilton",
        "Russell", "Antonelli", "Alonso", "Stroll", "Gasly", "Doohan",
        "Albon", "Sainz", "Hulkenberg", "Bortoleto", "Ocon", "Bearman",
        "Lawson", "Hadjar"
    ]
    try:
        url = f"{Config.F1_BASE_URL}/{season}/drivers.json"
        response = requests.get(url)
        data = response.json()

        drivers = data["MRData"]["DriverTable"]["Drivers"]
        
        # If API fails or returns too few, merge with fallback
        if not drivers or len(drivers) < 15:
            print(f"F1 API returned only {len(drivers) if drivers else 0} drivers. Using fallback.")
            return sorted(FALLBACK_DRIVERS)
        
        # Extract family names from API
        api_drivers = [driver["familyName"] for driver in drivers]
        
        # Merge API + fallback (set removes duplicates), then sort alphabetically
        all_drivers = sorted(set(api_drivers + FALLBACK_DRIVERS))
        return all_drivers
    except Exception as e:
        print(f"Error fetching F1 drivers: {e}. Using fallback list.")
        return sorted(FALLBACK_DRIVERS)
        