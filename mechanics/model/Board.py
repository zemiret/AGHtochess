from dataclasses import dataclass, field
from random import choice
from typing import List

from model.Token import Token
from model.Unit import Unit


@dataclass(eq=True)
class Board:
    tokens: List[Token] = field(default_factory=list)

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

    @property
    def alive_tokens(self) -> List[Token]:
        return [token for token in self.tokens if token.unit.alive]
