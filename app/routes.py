from flask import Blueprint, render_template

# Blueprint for the main routes of the application
main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')