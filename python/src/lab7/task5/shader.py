from OpenGL.GL import *
from OpenGL.GL.shaders import compileShader, compileProgram

class Shader:
    def get_program(self, shader_program_name: str):
        with open(f'shaders/{shader_program_name}.vert') as file:
            vertex_shader = file.read()

        with open(f'shaders/{shader_program_name}.geom') as file:
            geom_shader = file.read()

        with open(f'shaders/{shader_program_name}.frag') as file:
            fragment_shader = file.read()

        return compileProgram(
            compileShader(vertex_shader,   GL_VERTEX_SHADER),
            compileShader(geom_shader, GL_GEOMETRY_SHADER),
            compileShader(fragment_shader, GL_FRAGMENT_SHADER),
        )
