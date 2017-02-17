import flask_login
from flask import redirect, request
from easyrash import app

@app.route('/api/saveRash/<file_name>', methods=['POST'])
@flask_login.login_required
def saveRash(file_name):
    file_content = request.form['file_content']
    out_file = open("easyrash/static/dataset/" + file_name, "w")
    out_file.seek(0)
    out_file.truncate()
    out_file.write(file_content)
    out_file.close()
    return 'saved', 200
