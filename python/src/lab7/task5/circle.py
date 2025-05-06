from typing import Optional, Tuple
from OpenGL.GL import *
import numpy as np

class Circle:
    def __init__(self, radius: float, position: Tuple[float, float]) -> None:
        self.radius: float = radius
        self.position: Tuple[float, float] = position
        self.shader_program: Optional[int] = None
        self.vao: Optional[int] = None
        self.vbo: Optional[int] = None

    def init_gl(self, shader_program: int) -> None:
        self.shader_program = shader_program

        self.vao = glGenVertexArrays(1)
        glBindVertexArray(self.vao)

        self.vbo = glGenBuffers(1)
        glBindBuffer(GL_ARRAY_BUFFER, self.vbo)

        point_data = np.array(self.position, dtype=np.float32)
        glBufferData(GL_ARRAY_BUFFER, point_data.nbytes, point_data, GL_STATIC_DRAW)

        glEnableVertexAttribArray(0)
        glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 0, None)

        glBindBuffer(GL_ARRAY_BUFFER, 0)
        glBindVertexArray(0)

    def draw(self) -> None:
        assert self.shader_program is not None and self.vao is not None, \
            "Circle.init_gl must be called before draw()"

        glUseProgram(self.shader_program)
        glBindVertexArray(self.vao)

        loc_radius = glGetUniformLocation(self.shader_program, "radius")
        glUniform1f(loc_radius, self.radius)

        glDrawArrays(GL_POINTS, 0, 1)
        glBindVertexArray(0)
