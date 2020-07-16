from dataclasses import dataclass
from random import uniform
from typing import Optional, Tuple


@dataclass
class Param:
    low: int
    high: int
    multiplier: Optional[float] = None
    max: Optional[int] = None

    def sample(self, round: int) -> Tuple[float, int]:
        x = uniform(0, 1)

        value = self.low + x * (self.high - self.low)

        if self.multiplier is not None:
            value *= self.multiplier ** round

        if self.max is not None:
            value = min(value, self.max)

        return x, int(value)
