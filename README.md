# Prediction-League-Tracker
A web app that allows users to track both F1 and football predictions.

## Features
- Predictions - tracks your F1 and football predictions
- Leaderboard - maintains a leaderboard to see which user has the most points

## Technologies
- Flask + Jinja2
- SQLAlchemy + SQLite
- Jolpi API (F1)
- Football Data Org API

## Setup 

1. Clone repository
2. Get free football data org API key: **https://www.football-data.org/client/register** (don't need an API key for F1 API)
3. Create `.env` file in project root (copy `.env.example` and add your key)
4. Install dependencies: **pip install -r requirements.txt**
5. Run app: **python run.py**
6. Open browser at **http://127.0.0.1:5000**
