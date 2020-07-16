from dataclasses import dataclass, field
import heapq
from random import randint, uniform
from typing import Optional, List, Tuple, Dict

from model.Board import Board
from model.Token import Token


@dataclass(order=True)
class PrioritizedItem:
    score: int
    token: Token = field(compare=False)
    player: Board = field(compare=False)


@dataclass(init=False)
class Battle:
    player1: Board
    player2: Board
    initiative_queue: List[PrioritizedItem]
    distance_to_opponents: Dict

    log: List[dict]
    winner: Optional[Board] = None

    def __init__(self, player1: Board, player2: Board):
        self.player1 = player1
        self.player2 = player2
        self.log = []
        self.distance_to_opponents = {}
        self._calculate_distance_to_opponents()
        self.initiative_queue = []
        self._initialize_queue()

    def _calculate_distance_for_one_player(self, attacker, defender):
        for token in attacker.tokens:
            self.distance_to_opponents[token.unit.id] = [(token.distance(enemy_token), enemy_token) for enemy_token in defender.tokens]
            self.distance_to_opponents[token.unit.id].sort(key=lambda x: x[0])

    def _calculate_distance_to_opponents(self):
        self._calculate_distance_for_one_player(self.player1, self.player2)
        self._calculate_distance_for_one_player(self.player2, self.player1)

    def _initialize_queue(self):
        for board in self.player1, self.player2:
            for token in board.alive_tokens:
                entry = PrioritizedItem(-token.unit.attackSpeed, token, board)
                heapq.heappush(self.initiative_queue, entry)

    def _get_entry_from_queue(self) -> PrioritizedItem:
        entry = heapq.heappop(self.initiative_queue)
        
        if entry.score == 0:
            self.initiative_queue.clear()
            self._initialize_queue()
            return self._get_entry_from_queue()

        return entry

    def _get_nearest_defending_token(self, attacking_token) -> Token:
        while True:
            distance, token = self.distance_to_opponents[attacking_token.unit.id][0]
            if token.unit.alive:
                return token
            self.distance_to_opponents[attacking_token.unit.id].pop(0)

    def resolve(self) -> None:
        while self.player1.anyone_alive and self.player2.anyone_alive:
            entry = self._get_entry_from_queue()
            score = entry.score
            attacking_token = entry.token
            attacking_player = entry.player

            defending_player = self.player2 if attacking_player is self.player1 else self.player1
            defending_token = self._get_nearest_defending_token(attacking_token)

            damage = self._resolve_duel(attacking_token, defending_token)

            if defending_token.unit.dead:
                self.initiative_queue = [e for e in self.initiative_queue if e.token != defending_token]
                heapq.heapify(self.initiative_queue)

            entry = PrioritizedItem(0, attacking_token, attacking_player)
            heapq.heappush(self.initiative_queue, entry)

            self.initiative_queue = [PrioritizedItem(score=e.score - e.token.unit.attackSpeed,token=e.token,player=e.player) for e in self.initiative_queue]


            self.log.append({
                "action": "kill" if defending_token.unit.dead else "damage",
                "damage": damage,
                "who": attacking_token.unit.id,
                "whom": defending_token.unit.id
            })

        self._set_winner()

    def _resolve_duel(self, attacking_token: Token, defending_token: Token) -> int:
        if attacking_token.unit.physical:
            attack = attacking_token.unit.attack
            if randint(0, 100) < attacking_token.unit.criticalChance:
                attack *= int(uniform(1.5, 2))
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

        damage_reduction_divider = self._calculate_damage_divider(distance, attack_range)

        damage = max(1, attack - defense)
        damage /= damage_reduction_divider

        defending_token.unit.hp = max(0, defending_token.unit.hp - damage)
        return damage

    def _set_winner(self) -> None:
        self.winner = self.player1 if self.player1.anyone_alive else self.player2

    @staticmethod
    def _calculate_damage_divider(distance: float, attack_range: float, *, base: float = 2.0) -> float:
        return base ** max(0.0, (distance - attack_range) / attack_range)
