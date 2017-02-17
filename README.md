
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

## Usage

### Method 1

`sudo pip install virtualenv`  
`git clone https://github.com/aleinnocenzi/EasyRASH.git`  
`cd ./EasyRASH`  
`virtualenv --python python3 venv`  
`. venv/bin/activate`  
`gunicorn --bind 0.0.0.0:10000 wsgi:app`  

### Method 2

`git clone https://github.com/aleinnocenzi/EasyRASH.git`  
`cd ./EasyRASH`  
`gunicorn --bind 0.0.0.0:10000 wsgi:app`  

## Pip installation

Download get-pip.py from here: https://bootstrap.pypa.io/get-pip.py  
`cd /path/to/get-pip.py`  
`python get-pip.py`  

## Project dependencies

This project uses a lot of python module such as flask extensions.
Please install theese modules with the following command:

`sudo pip install <DEPENDENCY>`

DEPENDENCIES:  
`flask`  
`flask_login`  
`flask_mail`  
`passlib`  
`grip`  
`gunicorn`  