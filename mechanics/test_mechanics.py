import pytest

from mechanics import HackyHack


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
    unit = HackyHack().generate_unit(round)

    if min_expected is not None:
        assert unit.price >= min_expected

    if max_expected is not None:
        assert unit.price <= max_expected
