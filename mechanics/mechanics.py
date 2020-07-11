from random import shuffle
from random import choice, uniform, randint, sample, random
from typing import Tuple, List
from datetime import datetime

from model.Board import Board
from model.Unit import Unit
from model.Token import Token

golden_ratio = (1 + 5 ** 0.5) / 2
timestamp_const = 0.025


def generate_unit(round: int) -> Unit:
    profession = choice(['magician', 'tank', 'sniper']) # 'dps'

    def gen(min, max, multiplier: float = 1.0) -> int:
        return int(uniform(min, max) * multiplier ** (round - 1))


    def generate_magician() -> Unit:
        # TODO change stats
        return Unit(attack = gen(5, 50, 1.1),
                    defense = gen(0, 10, 1.1),
                    magicResist = gen(0, 5, 1.1),
                    criticalChance = 0,
                    hp = gen(80, 120, 1.1),
                    range = gen(3, 5, 1.1),
                    attackSpeed = gen(0, 3, 1.1),
                    type = "MAGICAL",
                    price = gen(1, 4) * 100)


    def generate_tank() -> Unit:
        # TODO change stats
        return Unit(attack = gen(5, 50, 1.1),
                    defense = gen(0, 10, 1.1),
                    magicResist = gen(0, 5, 1.1),
                    criticalChance = min((gen(1 + 0.6, 1 + 0.9, 1.1) - 1), 1) * 100,
                    hp = gen(80, 120, 1.1),
                    range = gen(3, 5, 1.1),
                    attackSpeed = gen(0, 3, 1.1),
                    type = "PHYSICAL",
                    price = gen(1, 4) * 100)


    def generate_sniper() -> Unit:
        return Unit(attack = gen(5, 50, 1.1),
                    defense = gen(0, 10, 1.1),
                    magicResist = gen(0, 5, 1.1),
                    criticalChance = min((gen(1 + 0.6, 1 + 0.9, 1.1) - 1), 1) * 100,
                    hp = gen(80, 120, 1.1),
                    range = gen(3, 5, 1.1),
                    attackSpeed = gen(0, 3, 1.1),
                    type = "PHYSICAL",
                    price = gen(1, 4) * 100)

    generate_unit_by_type = {
        'magician': generate_magician,
        'tank': generate_tank,
        'sniper': generate_sniper
    }

    return generate_unit_by_type.get(profession)()


def shuffle_players(players: Tuple[Board, Board]) -> Tuple[Board, Board]:
    players_list = [*players]
    shuffle(players_list)
    return players_list[0], players_list[1]


def calculate_damage_divider(distance: float, attack_range: float, *, base: float = 2.0) -> float:
    return base ** max(0.0, (distance - attack_range) / attack_range)


def get_timestamp_for_unit(start, unit):
    return start + timestamp_const/unit.attackSpeed


def initialize_queue(board: Board) -> List[Tuple[float, Token]]:
    round_start = datetime.timestamp(datetime.now())
    return [(get_timestamp_for_unit(round_start, token.unit), token) for token in board.tokens]


def get_token_from_queue(attacking_queue: List[Tuple[float, Token]]) -> Token:
    attacking_queue.sort(key=lambda elem: elem[0])
    token = attacking_queue.pop(0)[1]
    attacking_queue.append((get_timestamp_for_unit(datetime.timestamp(datetime.now()), token.unit), token))
    return token


def remove_token_from_queue(attacking_queue: List[Tuple[float, Token]], token: Token):
    attacking_queue = list(filter(lambda x: x[1] != token, attacking_queue))


def resolve_duel(attacking_token: Token, defending_token: Token) -> int:
    if attacking_token.unit.physical:
        attack = attacking_token.unit.attack
        if randint(0, 100) < attacking_token.unit.criticalChance:
            attack *= int(uniform(1, 2))
        else:
            attack = randint(0, attack)
        defense = randint(0, defending_token.unit.defense)
    else:
        attack = attacking_token.unit.attack
        defense = randint(0, defending_token.unit.magicResist)

    distance = defending_token.distance(attacking_token)
    attack_range = attacking_token.unit.range
    if distance <= 0:
        raise ValueError("Distance between tokens is 0")

    damage_reduction_divider = calculate_damage_divider(distance, attack_range)

    damage = max(0, attack - defense)
    damage /= damage_reduction_divider

    defending_token.unit.hp = max(0, defending_token.unit.hp - damage)
    return damage


def resolve_battle(board1: Board, board2: Board) -> Tuple[int, int, List[dict]]:
    log = []

    board1_queue = initialize_queue(board1)
    board2_queue = initialize_queue(board2)

    attacking_player, defending_player = shuffle_players((board1, board2))
    attacking_queue = board1_queue if attacking_player == board1 else board2_queue
    defending_queue = board1_queue if defending_player == board1 else board2_queue

    while attacking_player.anyone_alive and defending_player.anyone_alive:
        attacking_token = get_token_from_queue(attacking_queue)
        defending_token = defending_player.get_random_alive_token()

        damage = resolve_duel(attacking_token, defending_token)

        if defending_token.unit.dead:
            remove_token_from_queue(defending_queue, defending_token)

        log.append({
            "action": "kill" if defending_token.unit.dead else "damage",
            "damage": damage,
            "who": attacking_token.unit.id,
            "whom": defending_token.unit.id
        })

        attacking_player, defending_player = defending_player, attacking_player
        attacking_queue, defending_queue = defending_queue, attacking_queue

    winner = 1 if board2.anyone_alive else 0
    player_hp_change = randint(-10, -1)

    return winner, player_hp_change, log
