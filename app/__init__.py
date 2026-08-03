from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

# SQLAlchemy extension object
db = SQLAlchemy()

def create_app():
    # Flask instance
    app = Flask(__name__)
    app.config.from_object(Config)
    # Binds db object to the app instance
    db.init_app(app)

    from app.routes import main
    app.register_blueprint(main)

    with app.app_context():
        # Creates corresponding tables in SQLite for model classes
        db.create_all()

    return app