from random import shuffle
from random import choice, uniform, randint, sample
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
        critical_chance = min((gen(1 + 0.6, 1 + 0.9, 1.1) - 1), 1) * 100
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


def shuffle_players(players: Tuple[Board, Board]) -> Tuple[Board, Board]:
    players_list = [*players]
    shuffle(players_list)
    return players_list[0], players_list[1]


def calculate_damage_divider(distance: float, attack_range: float, *, base: float = 2.0) -> float:
    return base ** max(0.0, (distance - attack_range) / attack_range)


def resolve_battle(board1: Board, board2: Board) -> Tuple[int, int, List[dict]]:
    log = []

    attacking_player, defending_player = shuffle_players((board1, board2))

    while attacking_player.anyone_alive and defending_player.anyone_alive:
        attacking_token = attacking_player.get_random_alive_token()
        defending_token = defending_player.get_random_alive_token()

        attack = randint(0, attacking_token.unit.attack)
        if attacking_token.unit.physical:
            defense = randint(0, defending_token.unit.defense)
        else:
            defense = randint(0, defending_token.unit.magicResist)

        distance = defending_token.distance(attacking_token)
        attack_range = attacking_token.unit.range
        if distance <= 0:
            raise ValueError("Distance between tokens is 0")

        damage_reduction_divider = calculate_damage_divider(distance, attack_range)

        damage = max(0, attack - defense)
        damage /= damage_reduction_divider

        defending_token.unit.hp = max(0, defending_token.unit.hp - damage)

        log.append({
            "action": "kill" if defending_token.unit.dead else "damage",
            "damage": damage,
            "who": attacking_token.unit.id,
            "whom": defending_token.unit.id
        })

        attacking_player, defending_player = defending_player, attacking_player

    winner = 1 if board2.anyone_alive else 0
    player_hp_change = randint(-10, -1)

    return winner, player_hp_change, log
