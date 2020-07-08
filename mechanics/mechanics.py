from random import choice, uniform, randint
from typing import Tuple, List

from model.Board import Board
from model.Unit import Unit
from model.NoOneAliveError import NoOneAliveError

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
                magicResist=magic_resist,
                criticalChance=critical_chance,
                hp=hp,
                range=range,
                attackSpeed=attack_speed,
                type=type,
                price=price)


def resolve_battle(board1: Board, board2: Board) -> Tuple[int, int, List[dict]]:
    logs = []
    attaker = choice([board1, board2])
    while board1.anyone_alive() and board2.anyone_alive():
        attacking_token = board1.get_alive_token()
        defending_token = board2.get_alive_token()
        hp_diff = attacking_token.unit.attack - defending_token.unit.defense
        defending_token.hp = max(0, defending_token.hp - hp_diff)
        log = {
            "action": "kill" if defending_token.hp == 0 else "damage",
            "who": attacking_token.unit.id,
            "whom": defending_token.unit.id
        }
        logs.append(log)
        attaker = board1 if attacker = board2 else board2

    winner = 1 if board1.anyone_alive() else 2
    player_hp_change = randint(-10, 0)
    return winner, player_hp_change, logs
