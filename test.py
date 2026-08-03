from app.services.scoring import calculate_f1_points, calculate_football_points

class FakePrediction:
    def __init__(self, predicted_home_score=None, predicted_away_score=None, predicted_winner=None, predicted_podium=None):
        self.predicted_home_score = predicted_home_score
        self.predicted_away_score = predicted_away_score
        self.predicted_winner = predicted_winner
        self.predicted_podium = predicted_podium
        self.points_awarded = 0

# Football

prediction1 = FakePrediction(predicted_home_score=2, predicted_away_score=1)    
result1 = {'home_score': 2, 'away_score': 1}
print("Test 1 (exact win, expect 13):", calculate_football_points(prediction1, result1))

prediction2 = FakePrediction(predicted_home_score=3, predicted_away_score=0)    
result2 = {'home_score': 1, 'away_score': 0}
print("Test 2 (correct win, expect 3):", calculate_football_points(prediction2, result2))

prediction3 = FakePrediction(predicted_home_score=1, predicted_away_score=1)    
result3 = {'home_score': 2, 'away_score': 0}
print("Test 3 (predicted draw, actual win, expect 0):", calculate_football_points(prediction3, result3))

# F1

prediction4 = FakePrediction(predicted_winner="Verstappen", predicted_podium="Verstappen, Norris, Leclerc")    
result4 = {'winner': 'Verstappen', 'podium': ['Verstappen', 'Norris', 'Leclerc']}
print("Test 4 (exact podium, expect 25):", calculate_f1_points(prediction4, result4))

prediction5 = FakePrediction(predicted_winner="Verstappen", predicted_podium="Verstappen, Leclerc, Norris")    
result5 = {'winner': 'Verstappen', 'podium': ['Verstappen', 'Norris', 'Leclerc']}
print("Test 5 (right members, wrong order, right winner, expect 18):", calculate_f1_points(prediction5, result5))
    
prediction6 = FakePrediction(predicted_winner="Hamilton", predicted_podium="Hamilton, Russell, Alonso")    
result6 = {'winner': 'Verstappen', 'podium': ['Verstappen', 'Norris', 'Leclerc']}
print("Test 6 (everything wrong, expect 0):", calculate_f1_points(prediction6, result6))