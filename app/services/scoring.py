def calculate_f1_points(prediction, race_result):
    # Converting from string into a list
    split_podium = prediction.predicted_podium.split(",")

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
