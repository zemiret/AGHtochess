from dataclasses import dataclass, field
from uuid import uuid1


@dataclass
class Unit:
    id: int = field(default_factory=lambda: uuid1().int)
    attack: int = 0
    defense: int = 0
    magic_resist: int = 0
    critical_chance: int = 0
    hp: int = 50
    range: int = 0
    attack_speed: int = 0
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
