from easyrash import app
import flask_login
from easyrash.utility.user_utility import getData, modifyData, searchId, sendMail, genRandom
from flask import abort, request, render_template, redirect
from passlib.hash import md5_crypt
import socket

@app.route("/api/reqSignup", methods=['POST'])
def reqSignup():
    found = False
    hostname = socket.gethostname()
    email = request.form['email']
    nome = request.form['nome'][0].upper() + request.form['nome'][1:]
    cognome = request.form['cognome'][0].upper() + request.form['cognome'][1:]
    enc_passwd = request.form['passwd']
    sex = request.form['sex']
    passwd = md5_crypt.encrypt(enc_passwd)
    obj = "[Easy Rash]confirm registration"
    body = "<p>to confirm your registration please click the link below<p>"
    data = getData("easyrash/users/users.json")
    req_file = getData("easyrash/requestSignup.json")
    random_code = genRandom()
    for key in data:
        if(email == data[key]['email']):
            abort(409)
    for i in range(len(req_file)):
        if(req_file[i]['email'] == email):
            req_file[i]['id'] = random_code
            found = True
            break
    if(found == False):
        short_id = cognome[0].upper()+nome[0].upper()+sex[0].upper()+str(random_code) #prima lettera cognome, prima lettera, nome sesso
        req = {
            'email': email,
            'given_name': nome,
            'family_name': cognome,
            'sex': sex,
            'pass': passwd,
            'id': random_code,
            'comment_id': short_id
        }
        req_file.append(req)
    modifyData(req_file, 'easyrash/requestSignup.json')
    link = "<a href='http://" + hostname + ".cs.unibo.it:10000/api/confReg/" + str(random_code)+"' target='_blank'>" + hostname + ".cs.unibo.it:10000/api/confReg/" + str(random_code)+"</a>"
    sendMail(obj, link, email, body)
    return "Sent"

@app.route('/api/confReg/<id_req>', methods=['GET'])
def confirmRegistration(id_req):
    ret = searchId(id_req, "easyrash/requestSignup.json")
    id_found = ret[0]
    new_user = ret[1]
    if(id_found == "OK"):
        req_file = getData("easyrash/requestSignup.json")
        for i in range(len(req_file)):
            if(req_file[i]['id'] == new_user['id']):
                req_file.pop(i)
        new_user.pop('id',0)
        obj = {new_user["given_name"]+" "+new_user["family_name"] + " " + "<" + new_user["email"] + ">" : new_user}
        data = getData('easyrash/users/users.json')
        data.update(obj)
        modifyData(data, "easyrash/users/users.json")
        modifyData(req_file, "easyrash/requestSignup.json")
        return redirect('/login')
    else: abort(409)
