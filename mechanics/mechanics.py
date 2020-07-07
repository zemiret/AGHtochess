from typing import Sequence

from model.Unit import Unit


def generate_units(round: int) -> Sequence[Unit]:
    yield Unit(hp=1)
    yield Unit(hp=2)
    yield Unit(hp=3)
