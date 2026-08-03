from app import create_app

# Creates app instance
app = create_app()

if __name__ == '__main__':
    app.run(debug=True)