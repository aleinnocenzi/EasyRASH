from easyrash import app
from easyrash.utility.user_utility import getData, modifyData, createLockFile, searchUserInfo
from flask import abort
from threading import Lock
import flask_login

mutex = Lock()

def lockSupport(mode, article):
	if (mode == "lock"):
		control = False
		locked = True
	elif(mode == "unlock"):
		control = True
		locked = False
	else:
		return 500
	index = 0
	user = flask_login.current_user.id
	user_key = searchUserInfo(user)['key'];
	mutex.acquire()
	if(mutex.locked() == False):
		return 500 # non dovresti essere qui, questo è male
	lock_data = getData('easyrash/lock.json')
	users_data = getData('easyrash/events/events.json')
	for conf in users_data:
		for article_ in conf['submissions']:
			if article_["url"] == article:
				for reviewer in article_["reviewers"]:
					if reviewer == user_key:
						for current in lock_data:
							if article == current['id']:
								if current['locked'] == control:
									lock_data[index]['locked'] = locked
									modifyData(lock_data, 'easyrash/lock.json')
									mutex.release()
									return 200
								else:
									mutex.release()
									return 400
							index = index + 1
				mutex.release()
				return 400
	mutex.release()
	return 404 # se non c'è l'articolo allora not found, controllo di sicurezza

@app.route('/api/lock/<article>')
@flask_login.login_required
def lock(article):
	ret = lockSupport("lock", article)
	if ret == 200:
		return "locked"
	elif ret == 400:
		abort(401)
	elif ret == 404:
		abort(404)
	else:
		abort(500) #internal server error

@app.route('/api/unlock/<article>')
@flask_login.login_required
def unlock(article):
	ret = lockSupport("unlock", article)
	if ret == 200:
		return "unlocked"
	elif ret == 400:
		abort(400)
	elif ret == 404:
		abort(404)
	else:
		abort(500) #internal server error
