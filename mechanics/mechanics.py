from random import randint
from typing import Sequence

from model.Unit import Unit

sqrt2 = 2 ** 0.5
golden = (1 + 5 ** 0.5) / 2


def generate_units(round: int, *, count: int = 5) -> Sequence[Unit]:
    for _ in range(count):
        yield Unit(price=randint(int(sqrt2 ** round), int(3 * sqrt2 ** round)) * 100)
