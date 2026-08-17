from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

# SQLAlchemy extension object
db = SQLAlchemy()

def create_app():
    # Flask instance
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS
    CORS(app, supports_credentials=True, origins=['http://localhost:5173'])
    # Binds db object to the app instance
    db.init_app(app)

    from app.routes import main
    from app.api_routes import api

    app.register_blueprint(main)
    app.register_blueprint(api)

    with app.app_context():
        # Creates corresponding tables in SQLite for model classes
        db.create_all()

    return app