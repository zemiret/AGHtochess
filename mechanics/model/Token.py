from dataclasses import dataclass
from typing import Tuple

from model.Unit import Unit


@dataclass(eq=True)
class Token:
    unit: Unit
    position: Tuple[int, int]
