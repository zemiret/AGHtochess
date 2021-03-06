from dataclasses import dataclass
from math import sqrt
from typing import Tuple

from model.Unit import Unit


@dataclass(eq=True)
class Token:
    unit: Unit
    position: Tuple[int, int]

    def distance(self, other) -> float:
        x0, y0 = self.position
        x1, y1 = other.position
        return sqrt((x0 - x1) ** 2 + (y0 - y1) ** 2)
