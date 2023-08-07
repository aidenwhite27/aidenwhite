from app import app
from flask import render_template, url_for

@app.route('/')

@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/blog')
def blog():
    return render_template('blog.html')

@app.route('/about')
def about():
    return render_template('about.html')
