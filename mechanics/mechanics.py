from random import randint

from model.Unit import Unit

golden = (1 + 5 ** 0.5) / 2


def generate_unit(round: int) -> Unit:
    return Unit(price=randint(int(1.5 ** round), int(3 * 1.5 ** round)) * 100)
