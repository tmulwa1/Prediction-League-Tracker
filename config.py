import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))
# Reads .env file and loads environment variables 
load_dotenv(os.path.join(basedir, '.env')) 

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-later'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'instance','app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FOOTBALL_API_KEY = os.environ.get('FOOTBALL_API_KEY')