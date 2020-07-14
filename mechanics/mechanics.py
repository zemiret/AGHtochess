from random import choice, uniform
from typing import Tuple, List

from model.Battle import Battle
from model.Board import Board
from model.Unit import Unit

golden_ratio = (1 + 5 ** 0.5) / 2


def generate_unit(round: int) -> Unit:
    profession = choice(['magician', 'tank', 'sniper'])  # 'dps'

    def gen(min, max, multiplier: float = 1.0) -> int:
        return int(uniform(min, max) * multiplier ** (round - 1))

    def generate_magician() -> Unit:
        # TODO change stats
        return Unit(attack=gen(5, 50, 1.1),
                    defense=gen(0, 10, 1.1),
                    magicResist=gen(0, 5, 1.1),
                    criticalChance=0,
                    hp=gen(80, 120, 1.1),
                    range=gen(3, 5, 1.1),
                    attackSpeed=gen(1, 3, 1.1),
                    type="MAGICAL",
                    price=gen(1, 4) * 100)

    def generate_tank() -> Unit:
        # TODO change stats
        return Unit(attack=gen(5, 50, 1.1),
                    defense=gen(0, 10, 1.1),
                    magicResist=gen(0, 5, 1.1),
                    criticalChance=min((gen(1 + 0.6, 1 + 0.9, 1.1) - 1), 1) * 100,
                    hp=gen(80, 120, 1.1),
                    range=gen(3, 5, 1.1),
                    attackSpeed=gen(1, 3, 1.1),
                    type="PHYSICAL",
                    price=gen(1, 4) * 100)

    def generate_sniper() -> Unit:
        return Unit(attack=gen(5, 50, 1.1),
                    defense=gen(0, 10, 1.1),
                    magicResist=gen(0, 5, 1.1),
                    criticalChance=min((gen(1 + 0.6, 1 + 0.9, 1.1) - 1), 1) * 100,
                    hp=gen(80, 120, 1.1),
                    range=gen(3, 5, 1.1),
                    attackSpeed=gen(1, 3, 1.1),
                    type="PHYSICAL",
                    price=gen(1, 4) * 100)

    generate_unit_by_type = {
        'magician': generate_magician,
        'tank': generate_tank,
        'sniper': generate_sniper
    }

    return generate_unit_by_type.get(profession)()


def resolve_battle(board1: Board, board2: Board) -> Tuple[int, int, List[dict]]:
    battle = Battle(board1, board2)
    battle.resolve()

    winner_number = 1 if battle.winner is board2 else 0
    player_hp_change = -10 * len(battle.winner.alive_tokens)
    log = battle.log

    return winner_number, player_hp_change, log
