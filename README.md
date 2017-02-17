
# Authors

alessio.innocenzi@studio.unibo.it  
simone.preite@studio.unibo.it

# Description

EasyRASH is a peer review application developed to simplify the annotations of scientific articles written in RASH language.
This web application provides all tools for a complete peer review process: from the submission of the article, to the reviews and to the final decision.

## Technical details

Academic project developer for the course of Web Techologies.
Developed using python and Flask framework for the backend, and angularjs for the frontend
UI is built following Material Design guidelines and using Angular Material, an angular module 
that implements the Google Material Design

### Usage

## Pip installation

Download get-pip.py (if you don't have pip already installed) from here: https://bootstrap.pypa.io/get-pip.py  
`cd /path/to/get-pip.py`  
`python get-pip.py` 

## Installation

`sudo pip install virtualenv`  
`git clone https://github.com/aleinnocenzi/EasyRASH.git`  
`cd ./EasyRASH`  
`virtualenv --python python3 venv`  
`. venv/bin/activate` 
`pip install flask flask_mail flask_login passlib grip gunicorn`  
`gunicorn --bind 0.0.0.0:10000 wsgi:app`   