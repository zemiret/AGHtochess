from core.models import get_db
import json


class User:
    def __init__(self, name):
        self.name = name

    def save(self):
        get_db().execute(
            'INSERT INTO User(name) VALUES (:name)', {"name": self.name}
        )

    def serialize(self):
        return json.dumps(self.name)

