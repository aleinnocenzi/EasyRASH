import json, codecs, random
from flask_mail import Mail, Message
from easyrash import mail

## user utility section

def searchId(id_req, file_to_search):
	req_file = getData(file_to_search)
	for i in range(len(req_file)):
		if(str(req_file[i]["id"]) == id_req):
			return("OK", req_file[i])
	return("FAIL")

def searchUser(user):
	data = getData('easyrash/users/users.json')
	for key in data:
		if(user == data[key]["email"]):
			return True
	return False

def searchUserInfo(user):
	data = getData('easyrash/users/users.json')
	for key in data:
		if(user == data[key]['email']):
			return {
				'user_data': data[key],
				'key' : key
			}

## file utility section

def getData(file_to_open):
	with codecs.open(file_to_open, 'r+', encoding='utf-8') as jsondata:
		data = json.load(jsondata)
		jsondata.close()
		return (data)
	return -1

def modifyData(data, file_to_write):
	with codecs.open(file_to_write, 'w+', encoding='utf-8') as jsondata:
		jsondata.seek(0)
		jsondata.write(json.dumps(data, indent=4))
		jsondata.truncate()
		jsondata.close()
		return 0
	return -1

## mail utility section

def sendMail(obj, linkAPI, email_rec, body):
	sender = 'no-reply@easyrash.ddns.net'
	thanks = '<p>thanks for use easyrash<p>'
	body = body + linkAPI + thanks
	msg = Message(obj, sender = 'no-reply@easyrash.ddns.net', recipients = [email_rec], html = body)
	mail.send(msg)
	print ("mail sent")

def genRandom():
	random.seed()
	return(random.randint(1, 50000))

## lock utility section

def createLockFile():
	with codecs.open('easyrash/lock.json', 'r+', encoding='utf-8') as lock_file:
		lock_data= []
		events = getData('easyrash/events/events.json')
		for conference in events:
			articles = conference['submissions']
			for article in articles:
				a_id = article['url']
				lock_obj = {
					'locked': False,
					'id': a_id
				}
				lock_data.append(lock_obj)

		lock_file.seek(0)
		return json.dump(lock_data, lock_file, indent=4)
