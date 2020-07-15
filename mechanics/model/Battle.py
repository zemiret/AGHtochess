from dataclasses import dataclass, field
from queue import PriorityQueue
from random import randint, uniform
from typing import Optional, List

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
    initiative_queue: PriorityQueue

    log: List[dict]
    winner: Optional[Board] = None

    def __init__(self, player1: Board, player2: Board):
        self.player1 = player1
        self.player2 = player2
        self.log = []
        self.initiative_queue = PriorityQueue()
        self._initialize_queue()

    def _initialize_queue(self):
        for board in self.player1, self.player2:
            for token in board.alive_tokens:
                entry = PrioritizedItem(-token.unit.attackSpeed, token, board)
                self.initiative_queue.put(entry)

    def _get_entry_from_queue(self) -> PrioritizedItem:
        entry = self.initiative_queue.get()
        if entry.score == 0:
            self.initiative_queue.queue.clear()
            self._initialize_queue()
            return self._get_entry_from_queue()

        return entry

    def resolve(self) -> None:
        while self.player1.anyone_alive and self.player2.anyone_alive:
            entry = self._get_entry_from_queue()
            score = entry.score
            attacking_token = entry.token
            attacking_player = entry.player

            defending_player = self.player2 if attacking_player is self.player1 else self.player1
            defending_token = defending_player.get_random_alive_token()

            damage = self._resolve_duel(attacking_token, defending_token)

            if defending_token.unit.alive:
                entry = PrioritizedItem(score + 1, attacking_token, attacking_player)
                self.initiative_queue.put(entry)

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

        damage_reduction_divider = self._calculate_damage_divider(distance, attack_range)

        damage = max(0, attack - defense)
        damage /= damage_reduction_divider

        defending_token.unit.hp = max(0, defending_token.unit.hp - damage)
        return damage

    def _set_winner(self) -> None:
        self.winner = self.player1 if self.player1.anyone_alive else self.player2

    @staticmethod
    def _calculate_damage_divider(distance: float, attack_range: float, *, base: float = 2.0) -> float:
        return base ** max(0.0, (distance - attack_range) / attack_range)
