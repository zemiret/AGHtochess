from flask import Flask, request

from mechanics import generate_units

app = Flask(__name__)


@app.route('/generate_units', methods=['POST'])
def generate_units_handler():
    data = request.get_json()
    round: int = data['round']
    count: int = data.get('count', 5)

    units = generate_units(round, count=count)

    return {
        "units": list(units)
    }
