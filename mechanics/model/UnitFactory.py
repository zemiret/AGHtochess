from statistics import mean
from typing import Any, Dict

from model.Param import Param
from model.Unit import Unit


class UnitFactory:
    params: Dict[str, Any]

    def __init__(self, **params: Any):
        self.params = params

    def create(self, *, round: int) -> Unit:
        attrs = {}
        uniforms = []

        for name, v in self.params.items():
            if isinstance(v, Param):
                x, attrs[name] = v.sample(round=round)
                uniforms.append(x)
            else:
                attrs[name] = v

        price = int((1 + mean(uniforms)) * 100 * round)

        return Unit(**attrs, price=price)
