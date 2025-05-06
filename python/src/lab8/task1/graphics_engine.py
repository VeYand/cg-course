from abc import ABCMeta
from moderngl import Context


class IGraphicsEngine:
    time: int
    delta_time: int
    WIN_SIZE: tuple[int, int]
    ctx: Context
    __metaclass__ = ABCMeta
