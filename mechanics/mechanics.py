from random import choice, uniform, randint
from typing import Tuple, List

from model.Board import Board
from model.Unit import Unit

golden_ratio = (1 + 5 ** 0.5) / 2


def generate_unit(round: int) -> Unit:
    # profession = choice(['magician', 'dps', 'tank', 'sniper'])
    profession = 'sniper'

    def gen(min, max, multiplier: float = 1.0) -> int:
        return int(uniform(min, max) * multiplier ** (round - 1))

    if profession == 'sniper':
        attack = gen(5, 50, 1.1)
        defense = gen(0, 10, 1.1)
        magic_resist = gen(0, 5, 1.1)
        critical_chance = min((gen(1+0.6, 1+0.9, 1.1) - 1), 1) * 100
        hp = gen(80, 120, 1.1)
        range = gen(3, 5, 1.1)
        attack_speed = gen(0, 3, 1.1)
        type = "PHYSICAL"

    price = gen(1, 4, 1.5) * 100

    return Unit(attack=attack,
                defense=defense,
                magic_resist=magic_resist,
                critical_chance=critical_chance,
                hp=hp,
                range=range,
                attack_speed=attack_speed,
                type=type,
                price=price)


def resolve_battle(board1: Board, board2: Board) -> Tuple[int, int, List[dict]]:
    winner = 1 if len(board1.tokens) > len(board2.tokens) else 2
    player_hp_change = randint(-10, 0)
    log = [
        {
            "action": "kill",
            "who": "12",
            "whom": "34",
        },
    ]

    return winner, player_hp_change, log
