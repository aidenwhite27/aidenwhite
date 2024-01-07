from app import app, db
from app.forms import LoginForm, CreatePostForm, DeletePostForm
from flask import request, render_template, url_for, flash, redirect, send_from_directory
from flask_login import current_user, login_user, logout_user, login_required
from app.models import User, Post
from werkzeug.urls import url_parse
from datetime import datetime
from sqlalchemy import desc, and_

@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory(app.static_folder, request.path[1:])

@app.route('/')
@app.route('/index')
@app.route('/blog')
def blog():
    if current_user.is_authenticated:
        posts = Post.query.order_by(desc(Post.timestamp)).limit(10).all()
    else:
        posts = Post.query.filter(Post.is_draft.is_(False)).order_by(desc(Post.timestamp)).limit(10).all()
    return render_template('blog.html', posts=posts, admin=current_user.is_authenticated)

@app.route('/blog/<post_name>')
def single_post_page(post_name):
    post_name = post_name.replace('-', ' ')
    if current_user.is_authenticated:
        post = Post.query.filter(Post.title == post_name).one_or_none()
    else:
        post = Post.query.filter(and_(Post.is_draft.is_(False), Post.title == post_name)).one_or_none()
    if not post:
        return redirect(url_for('not_found'))
    return render_template('post.html', meta=post.meta, post=post, admin=current_user.is_authenticated)

@app.route('/post', methods=['GET', 'POST'])
@login_required
def post():
    form = CreatePostForm()
    
    id = request.args.get("id", type=int)
    if id: post = Post.load_post(id)
    if request.method == 'GET' and id:
        form.title.data = post.title
        form.meta_desc.data = post.meta
        form.body.data = post.body
    if form.validate_on_submit():
        title = request.form['title']
        meta = request.form['meta_desc']
        body = request.form['body']
        thumbnail = ''
        user_id = current_user.id
        
        if id:
            post.title = title
            post.meta = meta
            post.body = body
            post.last_edited = datetime.utcnow()
            post.is_draft = form.draft.data
        else:
            flash(form.draft.data)
            record = Post(title=title, meta=meta, thumbnail=thumbnail, body=body, user_id=user_id, is_draft=form.draft.data)
            db.session.add(record)
        db.session.commit()
        return redirect(url_for('blog'))
    return render_template('create_post.html', form=form)

@app.route('/delete_post', methods=['GET', 'POST'])
@login_required
def delete_post():
    id = request.args.get("id", type=int)
    if id: 
        post = Post.load_post(id)
    else:
        return "No post ID given", 404
    form = DeletePostForm()
    if form.validate_on_submit():
        check = form.check.data
        if check:
            Post.query.filter_by(id=id).delete()
            db.session.commit()
        return redirect(url_for('blog'))
    return render_template('delete_post.html', form=form)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('blog'))
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Invalid username or password')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('blog')
        return redirect(next_page)
    return render_template('login.html', title='Sign In', form=form)

@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('blog'))

@app.route('/projects')
def projects():
    return render_template('projects.html')

@app.route('/projects/sorting')
def sorting():
    return render_template('sorting.html')

@app.errorhandler(404)
def not_found(e):
    return render_template('404.html'), 404
