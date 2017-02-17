
# Developers

	alessio.innocenzi@studio.unibo.it
	simone.preite@studio.unibo.it

# Description

	EasyRASH is a peer review application developed to simplify the annotations of scientific articles written in RASH language.
	This web application provides all tools for a complete peer review process: from the submission of the article, to the reviews and to the final decision.

## Technical details

	Developed using python and Flask framework for the server-side application, and angularjs with jquery for the client-side application

	User Interface is built following Material Design guidelines and using Angular Material, an angular module that implements the Google Material Design

## Guide for installation

	With virtualenv:
		1) `sudo pip install virtualenv` or `sudo pip install --user virtualenv`
		2) clone repository into folder
		3) `cd /path/to/folder`
		4) `virtualenv --python python3 venv o /home/<USERNAME>/.local/bin/virtualenv
		5) `. venv/bin/activate`
		6) `python wsgi.py`
		7) using gunicorn `gunicorn --bind 0.0.0.0:10000 wsgi:app`

	Without virtualenv: (needs python3)
		1) clone repository into folder
		2) `cd /path/to/folder`
		3) `python runserver.py`
		4) using gunicorn `gunicorn --bind 0.0.0.0:10000 wsgi:app`

## Pip installation

	1) Download get-pip.py from here: https://bootstrap.pypa.io/get-pip.py
	2) `cd /path/to/get-pip.py`
	3) `python get-pip.py`

## Project dependencies

	`sudo pip install <DEPENDENCIES>`

	DEPENDENCIES:
		flask
		flask_login
		flask_mail
		passlib
		gunicorn
		grip
