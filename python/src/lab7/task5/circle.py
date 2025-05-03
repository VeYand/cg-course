from typing import Optional, Tuple
from OpenGL.GL import *


class Circle:
    def __init__(self, radius: float, position: Tuple[float, float]) -> None:
        self.radius: float = radius
        self.position: Tuple[float, float] = position
        self.shader_program: Optional[int] = None
        self.vao: Optional[int] = None

    def init_gl(self, shader_program: int, vao: int) -> None:
        self.shader_program = shader_program
        self.vao = vao

    def draw(self) -> None:
        assert self.shader_program is not None and self.vao is not None, \
            "Circle.init_gl must be called before draw()"

        glUseProgram(self.shader_program)
        glBindVertexArray(self.vao)

        loc_radius = glGetUniformLocation(self.shader_program, "radius")
        glUniform1f(loc_radius, self.radius)
        loc_pos = glGetUniformLocation(self.shader_program, "pointPosition")
        glUniform2f(loc_pos, *self.position)

        glDrawArrays(GL_POINTS, 0, 1)
