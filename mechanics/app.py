from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return {'foo': 123, 'bar': 456}
