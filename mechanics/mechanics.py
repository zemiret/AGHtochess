from random import randint

from model.Unit import Unit

sqrt2 = 2 ** 0.5
golden = (1 + 5 ** 0.5) / 2


def generate_unit(round: int) -> Unit:
    return Unit(price=randint(int(sqrt2 ** round), int(3 * sqrt2 ** round)) * 100)
