from dataclasses import dataclass, field
from typing import List, Sequence, Generator, Iterator, Tuple
from random import choice
from datetime import datetime

from model.Token import Token
from model.Unit import Unit

timestamp_const = 0.025


@dataclass(eq=True)
class Board:
    tokens: List[Token] = field(default_factory=list)
    attacking_queue: List[Tuple[float, Token]] = field(default_factory=list)

    @classmethod
    def from_dict(cls, d: dict):
        units = map(Unit.from_dict, d['units'])
        units = {unit.id: unit for unit in units}
        tokens = [
            Token(units[placement['unitId']], (placement['x'], placement['y']))
            for placement in d['unitsPlacement']
        ]
        return cls(tokens)

    @property
    def anyone_alive(self) -> bool:
        return any(token.unit.alive for token in self.tokens)

    def get_random_alive_token(self) -> Token:
        return choice([token for token in self.tokens if token.unit.alive])

    def initialize_queue(self):
        self.attacking_queue.clear()
        now = datetime.timestamp(datetime.now())
        self.attacking_queue = [(get_timestamp_for_unit(now, token.unit), token) for token in self.tokens]

    def get_alive_token_from_queue(self) -> Token:
        self.attacking_queue.sort(key=lambda elem: elem[0])
        token = self.attacking_queue.pop(0)[1]
        self.attacking_queue.append((get_timestamp_for_unit(datetime.now(), token.unit), token))
        return token

    def remove_unit_from_queue(self, token):
        self.attacking_queue = list(filter(lambda x: x[1] != token, self.attacking_queue))


def get_timestamp_for_unit(start, unit):
    return start + timestamp_const/unit.attackSpeed
