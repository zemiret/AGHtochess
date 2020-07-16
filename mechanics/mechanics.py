from random import choice
from typing import Tuple, List

from model.Battle import Battle
from model.Board import Board
from model.Param import Param
from model.Unit import Unit
from model.UnitFactory import UnitFactory


def generate_unit(round: int) -> Unit:
    tank_factory = UnitFactory(attack=Param(low=10, high=20, multiplier=1.1),
                               defense=Param(low=40, high=50, multiplier=1.1),
                               magicResist=Param(low=20, high=35, multiplier=1.1),
                               criticalChance=Param(low=10, high=20, multiplier=1.02, max=100),
                               hp=Param(low=100, high=140, multiplier=1.1),
                               range=Param(low=2, high=3),
                               attackSpeed=Param(low=1, high=2, multiplier=1.1),
                               type="PHYSICAL")

    sniper_factory = UnitFactory(attack=Param(low=30, high=60, multiplier=1.1),
                                 defense=Param(low=0, high=10, multiplier=1.1),
                                 magicResist=Param(low=0, high=5, multiplier=1.1),
                                 criticalChance=Param(low=40, high=50, multiplier=1.05, max=100),
                                 hp=Param(low=40, high=60, multiplier=1.1),
                                 range=Param(low=6, high=10),
                                 attackSpeed=Param(low=4, high=5, multiplier=1.1),
                                 type="PHYSICAL")

    magician_factory = UnitFactory(attack=Param(low=20, high=30, multiplier=1.1),
                                   defense=Param(low=10, high=20, multiplier=1.1),
                                   magicResist=Param(low=15, high=25, multiplier=1.1),
                                   criticalChance=0,
                                   hp=Param(low=70, high=90, multiplier=1.1),
                                   range=Param(low=3, high=6),
                                   attackSpeed=Param(low=3, high=4, multiplier=1.1),
                                   type="MAGICAL")

    magical_tank_factory = UnitFactory(attack=Param(low=15, high=22, multiplier=1.1),
                                       defense=Param(low=25, high=40, multiplier=1.1),
                                       magicResist=Param(low=40, high=50, multiplier=1.1),
                                       criticalChance=0,
                                       hp=Param(low=90, high=120, multiplier=1.1),
                                       range=Param(low=3, high=4),
                                       attackSpeed=Param(low=2, high=3, multiplier=1.1),
                                       type="MAGICAL")

    unit_factory = choice([tank_factory, sniper_factory, magician_factory, magical_tank_factory])
    return unit_factory.create(round=round)


def resolve_battle(board1: Board, board2: Board) -> Tuple[int, int, List[dict]]:
    battle = Battle(board1, board2)
    battle.resolve()

    winner_number = 1 if battle.winner is board2 else 0
    player_hp_change = -3 * len(battle.winner.alive_tokens)
    log = battle.log

    return winner_number, player_hp_change, log
