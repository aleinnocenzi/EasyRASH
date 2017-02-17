from flask import request, abort, redirect, url_for, render_template, jsonify
from easyrash import app, login_manager
from easyrash.utility.user_utility import getData, searchUser, searchUserInfo
from easyrash.utility.sidenav_utility import searchUserArticles, getConferences, getSubmissionsInConf
import easyrash.utility.error_handling
import flask_login
from passlib.hash import md5_crypt

# USER CLASS

class User(flask_login.UserMixin):
	def is_authenticated(self):
		return True
	pass

@login_manager.user_loader
def user_loader(email):
	if (not searchUser(email)):
		return

	user = User()
	user.id = email
	return user

# /USER CLASS

@app.route('/api/currentuser') # TEST FUNCTION
@flask_login.login_required
def currentUser():
	return flask_login.current_user.id + ' is the current user'


@app.route('/login', methods=['GET', 'POST'])
def login():
	if(flask_login.current_user.is_authenticated):
		return redirect('/')
	else:
		if(request.method == 'GET'):
			return render_template('login.html')

		email = request.form['email']
		enc_passwd = request.form['passwd']
		data = getData("easyrash/users/users.json")
		for key in data:
			if(email == data[key]['email'] and md5_crypt.verify(enc_passwd, data[key]['pass'])):
				user = User()
				user.id = email
				flask_login.login_user(user, remember=True)
				return jsonify(data[key])

		abort(401) # se nel for non trova email e password validi


@app.route('/api/logout')
@flask_login.login_required
def logout():
	flask_login.logout_user()
	return 'Logged out'


@app.route('/')
def home():
	if(flask_login.current_user.is_authenticated):
		user = flask_login.current_user.id
		data = dict()
		user_data = searchUserInfo(user)
		user_articles = searchUserArticles(user)
		conferences = getConferences(user)
		data.update(user_data)
		data.update(user_articles)
		data.update(conferences)
		return render_template('home.html', data=data)
	else:
		return redirect('/login')

@app.route('/<type>/sent')
def sent(type):
	context = {
		'message': ''
	}
	
	if type == "signup":
		context['message'] = 'We have sent an email with a confirmation link inside. Please, click that link to complete registration.'

	elif type == "restore":
		context['message'] = 'We have sent an email with a confirmation link inside. Please, click that link to restore your password.'

	return render_template("sent.html", context=context)


@app.route('/api/userinfoadvanced')
@flask_login.login_required
def userInfoAdvanced():
	user = flask_login.current_user.id
	advanced_info = {
		'chair': [],
		'author': [],
		'reviewer': {},
		'number_reviewers':{}
	}
	user_key = searchUserInfo(user)['key']
	users_data = getData('easyrash/events/events.json')
	for conf in users_data:
		for chair in conf['chairs']:
			if(chair == user_key):
				chair_obj = getSubmissionsInConf(conf['acronym'])
				advanced_info['chair'].append(chair_obj)
				for article in conf['submissions']:
					advanced_info['number_reviewers'].update({article['url']:len(article['reviewers'])})
		for article in conf['submissions']:
			for author in article['authors']:
				if(author == user_key):
					advanced_info['author'].append(article['title'])
			for reviewer in article['reviewers']:
				if(reviewer == user_key):
					advanced_info['reviewer'].update({article['url']:article['title']})
	basic_info = searchUserInfo(user)['user_data']
	info = dict()
	info.update(advanced_info)
	info.update(basic_info)

	return jsonify(info)
