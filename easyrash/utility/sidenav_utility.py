import json
from easyrash.utility.user_utility import searchUserInfo, getData

def searchUserArticles(mail):
    array_articles = []
    user_key = searchUserInfo(mail)['key']
    events = getData('easyrash/events/events.json')
    for conference in events:
        articles = conference['submissions']
        for info in articles:
            authors = info['authors']
            for name in authors:
                if (name == user_key):
                    array_articles.append(info)
    obj_articles = {
        'user_articles': array_articles
    }
    return obj_articles

def getConferences(user):
    conf_obj = getData('easyrash/events/events.json')
    data = []
    found = False
    for key in conf_obj:
        for reviewer in key['pc_members']:
            if user+">" == reviewer.split("<")[1]:
                found = True
        for chair in key['chairs']:
            if user+">" == chair.split("<")[1]:
                found = True
        if found:
            data.append(key)
            found = False
    conferences = {
        'conferences': data
    }
    return conferences

def getSubmissionsInConf(conf):
    events = getData('easyrash/events/events.json')
    submissions = []
    for conference in events:
        if conference['acronym'] == conf:
            for submission in conference['submissions']:
                submissions.append(submission['url'])

    obj = {
        'acronym': conf,
        'submissions': submissions
    }
    return obj


