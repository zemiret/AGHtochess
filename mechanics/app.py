from flask import Flask, request

from model.Unit import Unit

app = Flask(__name__)


@app.route('/generate_units', methods=['POST'])
def generate_units():
    data = request.get_json()
    round: int = data['round']

    # return {
    #     "units": [
    #         {
    #             "id": 43,
    #             "attack": 1,
    #             "defense": 10,
    #             "magic_resist": 10,
    #             "critical_chance": 40,
    #             "hp": 100,
    #             "range": 40,
    #             "attack_speed": 10,
    #             "type": "MAGICAL/PHYSICAL",
    #             "price": 300
    #         }
    #     ]
    # }
    return {
        "units": [
            Unit(hp=123),
        ]
    }
