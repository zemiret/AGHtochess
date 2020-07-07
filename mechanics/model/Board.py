from dataclasses import dataclass
from typing import List

from model.Token import Token


@dataclass(eq=True)
class Board:
    tokens: List[Token]
