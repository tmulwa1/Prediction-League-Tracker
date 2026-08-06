from flask import Blueprint, render_template, request, redirect, url_for, session
from app.models import User
from app import db

# Blueprint for the main routes of the application
main = Blueprint('main', __name__)

@main.route('/')
def index():
    return render_template('index.html')

def get_current_user():
    # Helper function to get the current user
    user_id = session.get('user_id')
    if not user_id:
        return None

    user = User.query.filter_by(id=user_id).first()
    return user

@main.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        user = User.query.filter_by(username=username).first()
        if not user:
            user = User(username=username)
            db.session.add(user)
            db.session.commit()

        session['user_id'] = user.id
        return redirect(url_for('main.index'))

    return render_template('login.html')