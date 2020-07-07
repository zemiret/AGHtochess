import pytest

from model.Unit import Unit


def test_init_alive():
    unit = Unit()
    assert unit.hp


def test_init_different_id():
    unit1 = Unit()
    unit2 = Unit()
    assert unit1.id != unit2.id


@pytest.mark.parametrize('hp, expected', [
    (-100, False),
    (-1, False),
    (0, False),
    (1, True),
    (100, True),
])
def test_alive(hp, expected):
    unit = Unit(hp=hp)
    assert unit.alive is expected


@pytest.mark.parametrize('hp, expected', [
    (-100, True),
    (-1, True),
    (0, True),
    (1, False),
    (100, False),
])
def test_dead(hp, expected):
    unit = Unit(hp=hp)
    assert unit.dead is expected
