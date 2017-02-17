from flask import render_template, request
from easyrash import app, login_manager

@login_manager.unauthorized_handler
def unauthorized():
	return render_template('unauthorized.html'), 401

@app.errorhandler(404)
def page_not_found(e):
	current_url = request.path
	return render_template('notfound.html', current_url=current_url), 404