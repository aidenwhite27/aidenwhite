from datetime import datetime
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from app import login

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @login.user_loader
    def load_user(id):
        return User.query.get(int(id))

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    meta = db.Column(db.String(200))
    thumbnail = db.Column(db.String(100))
    body = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    last_edited = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    is_draft = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, title, meta, thumbnail, body, user_id, is_draft):
        self.title = title
        self.meta = meta
        self.thumbnail = thumbnail
        self.body = body
        self.user_id = user_id
        self.is_draft = is_draft

    def __repr__(self):
        return '<Post {} Draft {}>'.format(self.title, self.is_draft)

    def get_author(self):
        return User.query.get(int(self.user_id)).username

    def load_post(id):
        return Post.query.get(int(id))

    def get_url_name(self):
        return self.title.replace(' ', '-')
