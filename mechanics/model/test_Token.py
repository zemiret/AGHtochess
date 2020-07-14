from math import sqrt

import pytest
from pytest import approx

from model.Token import Token
from model.Unit import Unit


@pytest.mark.parametrize('token1, token2, expected', [
    (Token(Unit(), (0, 0)), (Token(Unit(), (0, 0))), 0.0),
    (Token(Unit(), (3, 4)), (Token(Unit(), (0, 0))), 5.0),
    (Token(Unit(), (21, 9)), (Token(Unit(), (37, 11))), sqrt(260))
])
def test_eq(token1, token2, expected):
    assert token1.distance(token2) - token2.distance(token1) == approx(0, abs=1e-10)
    assert token1.distance(token2) == approx(expected, abs=1e-10)
