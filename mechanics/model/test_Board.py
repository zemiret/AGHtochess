from typing import List

import pytest

from model.Board import Board
from model.Token import Token
from model.Unit import Unit


def test_init():
    d = {
        "units": [
            {
                "id": "43",
                "attack": 1,
                "defense": 10,
                "magicResist": 10,
                "criticalChance": 40,
                "hp": 100,
                "range": 40,
                "attackSpeed": 10,
                "type": "MAGICAL/PHYSICAL",
                "price": 100
            },
            {
                "id": "44",
                "attack": 1,
                "defense": 10,
                "magicResist": 10,
                "criticalChance": 40,
                "hp": 100,
                "range": 40,
                "attackSpeed": 10,
                "type": "MAGICAL/PHYSICAL",
                "price": 100
            },
        ],
        "unitsPlacement": [
            {"unitId": "43", "x": 2, "y": 3},
            {"unitId": "44", "x": 5, "y": 7},
        ],
    }
    board = Board.from_dict(d)

    assert len(board.tokens) == 2

    token43, token44 = board.tokens

    assert token43.unit.id == "43"
    assert token43.position == (2, 3)

    assert token44.unit.id == "44"
    assert token44.position == (5, 7)


@pytest.mark.parametrize('board, expected', [
    (
        Board([]),
        False
    ),
    (
        Board([
            Token(Unit(id=2, hp=0), (3, 5))
        ]),
        False
    ),
    (
        Board([
            Token(Unit(id=2, hp=100), (3, 5))
        ]),
        True
    ),
    (
        Board([
            Token(Unit(id=2, hp=100), (3, 5)),
            Token(Unit(id=7, hp=0), (11, 13)),
            Token(Unit(id=17, hp=100), (19, 21))
        ]),
        True
    )
])
def test_anyone_alive(board: Board, expected: bool):
    assert board.anyone_alive is expected
