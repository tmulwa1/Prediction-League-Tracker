def calculate_f1_points(prediction, race_result):
    # Converting from string into a list and stripping whitespace
    split_podium = [name.strip() for name in prediction.predicted_podium.split(",")]

    # Following F1 point system
    if split_podium == race_result['podium']:
        prediction.points_awarded = 25
    elif set(split_podium) == set(race_result['podium']):
        if split_podium[0] == race_result['winner']:
            prediction.points_awarded = 18
        else:
            prediction.points_awarded = 8
    elif split_podium[0] == race_result['winner']:
        prediction.points_awarded = 12
    else:
        prediction.points_awarded = 0

    return prediction.points_awarded

def get_result_type(home_score, away_score):
    # Checks if they're equal and returns type of result
    if home_score != away_score:
        return "WIN"
    else:
        return "DRAW"

def calculate_football_points(prediction, match_result):
    # Getting the two types for the two sets of data
    prediction_type = get_result_type(prediction.predicted_home_score, prediction.predicted_away_score)
    actual_type = get_result_type(match_result['home_score'], match_result['away_score'])

    if prediction_type == actual_type:
        if (prediction_type == "DRAW"):
            prediction.points_awarded = 1
        else:
            prediction.points_awarded = 3
    else:
        prediction.points_awarded = 0

    # Awards a bonus if the user guesses the exact scores
    if (prediction.predicted_home_score == match_result['home_score']) and (prediction.predicted_away_score == match_result['away_score']):
        prediction.points_awarded += 10

    return prediction.points_awarded