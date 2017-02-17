from flask import Flask
import flask_login, os
from flask_mail import Mail, Message

app = Flask(__name__)
app.secret_key = 'dvfivdbnbnibdbvdvpo840t'

login_manager = flask_login.LoginManager()
login_manager.init_app(app)
mail=Mail(app)

app.config['MAIL_SERVER']='localhost'
app.config['MAIL_USERNAME'] = 'no-reply@easyrash.ddns.net'
mail = Mail(app)
mail.connect()

import easyrash.utility.cache_handling

import easyrash.api.loginAPI
import easyrash.api.redirectToRashFilesAPI
import easyrash.api.lockAPI
import easyrash.api.passwordAPI
import easyrash.api.signupAPI
import easyrash.api.saveRashAPI
from easyrash.api.lockAPI import createLockFile

if os.path.getsize('easyrash/lock.json') == 0:
	createLockFile()
