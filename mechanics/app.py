from flask import Flask, request

from mechanics import generate_unit

app = Flask(__name__)


@app.route('/generate_units', methods=['POST'])
def generate_units_handler():
    data = request.get_json()
    round: int = data['round']
    count: int = data.get('count', 5)

    return {
        "units": [generate_unit(round) for _ in range(count)]
    }
