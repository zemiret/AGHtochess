from dataclasses import dataclass, field
from uuid import uuid1


@dataclass
class Unit:
    id: str = field(default_factory=lambda: str(uuid1()))
    attack: int = 0
    defense: int = 0
    magicResist: int = 0
    criticalChance: int = 0
    hp: int = 50
    range: int = 0
    attackSpeed: int = 0
    type: str = "MAGICAL"
    price: int = 0

    def __eq__(self, other):
        return isinstance(other, Unit) and self.id == other.id

    @property
    def alive(self):
        return self.hp > 0

    @property
    def dead(self):
        return not self.alive

    @classmethod
    def from_dict(cls, d: dict):
        return cls(**d)
