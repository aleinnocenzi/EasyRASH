from flask import redirect
from easyrash import app

@app.route('/<type>/<file>')
def getStaticFile(type, file):
	return redirect('/static/dataset/' + type + '/' + file)

@app.route('/UI-Templates/<template>')
def getUITemplate(template):
	return redirect('/static/UI-Templates/' + template)