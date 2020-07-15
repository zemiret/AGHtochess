from random import choice, uniform
from typing import Tuple, List

from model.Battle import Battle
from model.Board import Board
from model.Unit import Unit

golden_ratio = (1 + 5 ** 0.5) / 2


def generate_unit(round: int) -> Unit:
    profession = choice(['magician', 'magicial_tank', 'tank', 'sniper'])

    def gen(min, max, multiplier: float = 1.0) -> int:
        return int(uniform(min, max) * multiplier ** (round - 1))

    def generate_magician() -> Unit:
        return Unit(attack=gen(20, 30, 1.1),
                    defense=gen(10, 20, 1.1),
                    magicResist=gen(15, 25, 1.1),
                    criticalChance=0,
                    hp=gen(70, 90, 1.1),
                    range=gen(3, 6, 1),
                    attackSpeed=gen(3, 4, 1.1),
                    type="MAGICAL",
                    price=int(uniform(round, 3 * round)* 100))

    def generate_magicial_tank() -> Unit:
        return Unit(attack=gen(15, 22, 1.1),
                    defense=gen(25, 40, 1.1),
                    magicResist=gen(40, 50, 1.1),
                    criticalChance=0,
                    hp=gen(90, 120, 1.1),
                    range=gen(3, 4, 1),
                    attackSpeed=gen(2, 3, 1.1),
                    type="MAGICAL",
                    price=int(uniform(round, 3 * round) * 100))

    def generate_tank() -> Unit:
        return Unit(attack=gen(10, 20, 1.1),
                    defense=gen(40, 50, 1.1),
                    magicResist=gen(20, 35, 1.1),
                    criticalChance=min(gen(10, 20, 1.02), 100),
                    hp=gen(100, 140, 1.1),
                    range=gen(2, 3, 1),
                    attackSpeed=gen(1, 2, 1.1),
                    type="PHYSICAL",
                    price=int(uniform(round, 3 * round)* 100))

    def generate_sniper() -> Unit:
        return Unit(attack=gen(30, 60, 1.1),
                    defense=gen(0, 10, 1.1),
                    magicResist=gen(0, 5, 1.1),
                    criticalChance=min(gen(40, 50, 1.05), 100),
                    hp=gen(40, 60, 1.1),
                    range=gen(6, 10, 1),
                    attackSpeed=gen(4, 5, 1.1),
                    type="PHYSICAL",
                    price=int(uniform(round, 3 * round)* 100))

    generate_unit_by_type = {
        'magician': generate_magician,
        'magicial_tank': generate_magicial_tank,
        'tank': generate_tank,
        'sniper': generate_sniper
    }

    return generate_unit_by_type.get(profession)()


def resolve_battle(board1: Board, board2: Board) -> Tuple[int, int, List[dict]]:
    battle = Battle(board1, board2)
    battle.resolve()

    winner_number = 1 if battle.winner is board2 else 0
    player_hp_change = -3 * len(battle.winner.alive_tokens + 1)
    log = battle.log

    return winner_number, player_hp_change, log
