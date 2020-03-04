import json

from flask import current_app as app

from core.models.models import User
from core.models import get_db


@app.route('/')
def index():
    return 'Tuve un sueño que no pude dormir'


@app.route('/config')
def config():
    # just a check to make sure config works
    print(app.config)
    return json.dumps(app.config['DATABASE'])


@app.route('/user')
def user():
    # just a check to make sure db works
    user = User('user1')
    user.save()

    return user.serialize()
