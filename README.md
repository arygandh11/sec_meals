# SEC Meals

A lightweight Flask web application for managing and serving meal-related content, built as part of the SEC Meals project.

## Features

- Flask-based Python backend
- Jinja2 templating system
- Static asset support (CSS, JS, images)
- File upload handling
- Simple and extensible structure

## Project Structure

SEC_MEALS/
├── app.py # Main Flask application
├── static/ # CSS, JS, and image files
├── templates/ # HTML templates
├── uploads/ # Uploaded files (e.g. images, documents)
└── requirements.txt # Optional: pip dependencies

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/sec_meals.git
cd sec_meals
2. Set up a virtual environment (optional but recommended)
python3 -m venv venv
source venv/bin/activate
3. Install dependencies
If using a requirements file:
pip install -r requirements.txt
Or just install Flask:
pip install flask
4. Run the application
python app.py
Or, for development mode with auto-reload:
export FLASK_APP=app.py
export FLASK_ENV=development
flask run
Then go to http://127.0.0.1:5000 in your browser.
