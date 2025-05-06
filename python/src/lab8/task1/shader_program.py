from moderngl import Context, Program


class ShaderProgram:
    ctx: Context
    programs: dict[str, Program] = dict()

    def __init__(self, ctx: Context) -> None:
        self.ctx = ctx
        self.programs['default'] = self.get_program('default')
        self.programs['skybox'] = self.get_program('skybox')
        self.programs['shadow_map'] = self.get_program('shadow_map')

    def get_program(self, shader_program_name: str) -> Program:
        with open(f'shaders/{shader_program_name}.vert') as file:
            vertex_shader = file.read()

        with open(f'shaders/{shader_program_name}.frag') as file:
            fragment_shader = file.read()

        return self.ctx.program(vertex_shader=vertex_shader, fragment_shader=fragment_shader)

    def destroy(self) -> None:
        [program.release() for program in self.programs.values()]
