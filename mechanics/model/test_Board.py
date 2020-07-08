from model.Board import Board


def test_init():
    d = {
        "units": [
            {
                "id": 43,
                "attack": 1,
                "defense": 10,
                "magic_resist": 10,
                "critical_chance": 40,
                "hp": 100,
                "range": 40,
                "attack_speed": 10,
                "type": "MAGICAL/PHYSICAL",
                "price": 100
            },
            {
                "id": 44,
                "attack": 1,
                "defense": 10,
                "magic_resist": 10,
                "critical_chance": 40,
                "hp": 100,
                "range": 40,
                "attack_speed": 10,
                "type": "MAGICAL/PHYSICAL",
                "price": 100
            },
        ],
        "units_placement": [
            {"unit_id": 43, "x": 2, "y": 3},
            {"unit_id": 44, "x": 5, "y": 7},
        ],
    }
    board = Board.from_dict(d)

    assert len(board.tokens) == 2

    token43, token44 = board.tokens

    assert token43.unit.id == 43
    assert token43.position == (2, 3)

    assert token44.unit.id == 44
    assert token44.position == (5, 7)

