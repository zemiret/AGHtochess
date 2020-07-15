import pytest
from pytest import approx

from model.Battle import Battle


@pytest.mark.parametrize('distance, attack_range, base, expected', [
    (5, 10, 2.0, 1),
    (10, 10, 2.0, 1),
    (20, 10, 2.0, 2),

    (20, 10, 3.0, 3),
    (30, 10, 3.0, 9),

    (30, 10, 2.0, 4),
    (40, 10, 2.0, 8),
])
def test_calculate_damage_divider(distance, attack_range, base, expected):
    divider = Battle._calculate_damage_divider(distance, attack_range, base=base)
    assert divider == approx(expected, abs=1e-10)
