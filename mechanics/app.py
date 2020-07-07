from random import randint

from flask import Flask, request

from mechanics import generate_unit
from model.Board import Board

app = Flask(__name__)


@app.route('/generate_units', methods=['POST'])
def generate_units_handler():
    data = request.get_json()
    round: int = data['round']
    count: int = data.get('count', 5)

    return {
        "units": [generate_unit(round) for _ in range(count)]
    }


@app.route('/resolve_battle', methods=['POST'])
def resolve_battle_handler():
    data = request.get_json()

    board1 = Board.from_dict(data['player_1'])
    board2 = Board.from_dict(data['player_2'])

    return {
        "winner": 1 if len(board1.tokens) > len(board2.tokens) else 2,
        "player_hp_change": randint(-10, 0),
        "log": [
            {
                "action": "kill",
                "who": 12,
                "whom": 34,
            },
        ]
    }
