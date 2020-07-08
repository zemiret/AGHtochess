import pytest
from pytest import approx

from mechanics import generate_unit, calculate_damage_divider


@pytest.mark.parametrize('round, min_expected, max_expected', [
    (1, 0, 1e6),
    (5, 0, 1e6),
    (10, 0, 1e6),

    # TODO: balance
    # (1, 100, 500),
    # (5, 500, 10000),
    # (10, 5000, 20000),
])
def test_generate_unit_price(round, min_expected, max_expected):
    unit = generate_unit(round)

    if min_expected is not None:
        assert unit.price >= min_expected

    if max_expected is not None:
        assert unit.price <= max_expected


@pytest.mark.parametrize('distance, attack_range, expected', [
    (5, 10, 1),
    (10, 10, 1),
    (20, 10, 2),
    (30, 10, 4),
    (40, 10, 8),
])
def test_calculate_damage_divider(distance, attack_range, expected):
    divider = calculate_damage_divider(distance, attack_range)
    assert divider == approx(expected, abs=1e-10)
