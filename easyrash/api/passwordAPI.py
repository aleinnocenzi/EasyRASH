from easyrash import app
import flask_login
from easyrash.utility.user_utility import getData, modifyData, searchId, sendMail, genRandom
from flask import abort, request, render_template
from passlib.hash import md5_crypt
import socket

@app.route("/api/reqChangePasswd", methods=['POST'])
def reqChangePasswd():
    found = False
    hostname = socket.gethostname()
    email = request.form['email']
    obj = "[Easy Rash]restore password"
    body = "<p>to restore your password please click the link below<p>"
    data = getData("easyrash/users/users.json")
    req_file = getData("easyrash/requestSetPwd.json")
    for key in data:
        if(email == data[key]['email']):
            random_code = genRandom()
            for i in range(len(req_file)):
                if(req_file[i]['mail'] == email):
                    req_file[i]['id'] = random_code
                    found = True
                    break
            if(found == False):
                req = {
                    'mail': email,
                    'id': random_code
                }
                req_file.append(req)
            modifyData(req_file, 'easyrash/requestSetPwd.json')
            link = "<a href='http://" + hostname + ".cs.unibo.it:10000/api/verifyIDPWD/" + str(random_code)+"' target='_blank'>" + hostname + ".cs.unibo.it:10000/api/verifyIDPWD/" + str(random_code)+"</a>"
            sendMail(obj, link, email, body)
            return "Sent"
    abort(409)

@app.route('/api/verifyIDPWD/<id_req>', methods=['GET'])
def verifyIdPwd(id_req):
    ret = searchId(id_req, "easyrash/requestSetPwd.json")
    id_found = ret[0]
    if(id_found == "OK"):
        email = ret[1]['mail']
        return render_template('change_pwd.html', mail = email)
    else: abort(404)

@app.route('/api/restorePassword', methods=['POST'])
def restorePassword():
    pwd = request.form["passwd"]
    logged = False
    #pwd = md5_crypt.encrypt(dec_pwd)
    data = getData('easyrash/users/users.json')
    if( hasattr(flask_login.current_user, 'id') ):
        mail = flask_login.current_user.id
        old_pwd = request.form["old_passwd"]
        logged = True
    else:
        mail = request.form["mail"]
        req_file = getData("easyrash/requestSetPwd.json")
        for i in range(len(req_file)):
            if(req_file[i]['mail'] == mail):
                req_file.pop(i)
        modifyData(req_file, 'easyrash/requestSetPwd.json')
    for key in data:
        if(data[key]["email"] == mail):
            if(logged and md5_crypt.verify(old_pwd, data[key]['pass']) == False):
                print("control password")
                return(403)
            data[key]["pass"] = md5_crypt.encrypt(pwd)
            modifyData(data, "easyrash/users/users.json")
            return render_template("login.html")
    print("bad")
    abort(400)
