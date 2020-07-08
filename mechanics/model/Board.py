from dataclasses import dataclass
from typing import List
from random import choice

from model.Token import Token
from model.Unit import Unit
from model.NoOneAliveError import NoOneAliveError


@dataclass(eq=True)
class Board:
    tokens: List[Token]

    @classmethod
    def from_dict(cls, d: dict):
        units = map(Unit.from_dict, d['units'])
        units = {unit.id: unit for unit in units}
        tokens = [
            Token(units[placement['unitId']], (placement['x'], placement['y']))
            for placement in d['unitsPlacement']
        ]
        return cls(tokens)
    
    def anyone_alive(self):
        alive_tokens = list(filter(lambda token: token.unit.hp > 0, tokens))
        if len(alive_tokens) > 0:
            return True
        raise False

    def get_random_alive_token(self):
        return choice(list(filter(lambda token: token.unit.hp > 0, tokens)))
