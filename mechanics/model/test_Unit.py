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


def test_from_dict():
    d = {
        "id": "1",
        "attack": 2,
        "defense": 3,
        "magicResist": 4,
        "criticalChance": 5,
        "hp": 6,
        "range": 7,
        "attackSpeed": 8,
        "type": "MAGICAL",
        "price": 100
    }
    unit = Unit.from_dict(d)

    assert unit.id == "1"
    assert unit.attack == 2
    assert unit.defense == 3
    assert unit.magicResist == 4
    assert unit.criticalChance == 5
    assert unit.hp == 6
    assert unit.range == 7
    assert unit.attackSpeed == 8
    assert unit.type == "MAGICAL"
    assert unit.price == 100


@pytest.mark.parametrize('unit1, unit2, expected', [
    (Unit(id="42"), Unit(id="42"), True),
    (Unit(id="42", hp=10), Unit(id="42", hp=20), True),
    (Unit(id="7"), Unit(id="13"), False),
])
def test_eq(unit1, unit2, expected):
    assert (unit1 == unit2) is expected
