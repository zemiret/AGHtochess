from dataclasses import dataclass
from typing import List

from model.Token import Token
from model.Unit import Unit


@dataclass(eq=True)
class Board:
    tokens: List[Token]

    @classmethod
    def from_dict(cls, d: dict):
        units = map(Unit.from_dict, d['units'])
        units = {unit.id: unit for unit in units}
        tokens = [
            Token(units[placement['unit_id']], (placement['x'], placement['y']))
            for placement in d['units_placement']
        ]
        return cls(tokens)
