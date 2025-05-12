from vbo import VBO, BaseVBO
from shader_program import ShaderProgram
from moderngl import Context, VertexArray, Program


class VAO:
    ctx: Context
    vbo: VBO
    program: ShaderProgram
    vaos: dict[str, VertexArray] = dict()

    def __init__(self, ctx: Context) -> None:
        self.ctx = ctx
        self.vbo = VBO(ctx)
        self.program = ShaderProgram(ctx)

        self.vaos['cube'] = self.get_vao(
            program=self.program.programs['default'],
            vbo=self.vbo.vbos['cube'])
        self.vaos['shadow_cube'] = self.get_vao(
            program=self.program.programs['shadow_map'],
            vbo=self.vbo.vbos['cube'])

        self.vaos['ferret'] = self.get_vao(
            program=self.program.programs['default'],
            vbo=self.vbo.vbos['ferret'])
        self.vaos['shadow_ferret'] = self.get_vao(
            program=self.program.programs['shadow_map'],
            vbo=self.vbo.vbos['ferret'])

        self.vaos['hawk'] = self.get_vao(
            program=self.program.programs['default'],
            vbo=self.vbo.vbos['hawk'])
        self.vaos['shadow_hawk'] = self.get_vao(
            program=self.program.programs['shadow_map'],
            vbo=self.vbo.vbos['hawk'])

        self.vaos['cat'] = self.get_vao(
            program=self.program.programs['default'],
            vbo=self.vbo.vbos['cat'])
        self.vaos['shadow_cat'] = self.get_vao(
            program=self.program.programs['shadow_map'],
            vbo=self.vbo.vbos['cat'])

        self.vaos['cactus'] = self.get_vao(
            program=self.program.programs['default'],
            vbo=self.vbo.vbos['cactus'])
        self.vaos['shadow_cactus'] = self.get_vao(
            program=self.program.programs['shadow_map'],
            vbo=self.vbo.vbos['cactus'])

        self.vaos['plant'] = self.get_vao(
            program=self.program.programs['default'],
            vbo=self.vbo.vbos['plant'])
        self.vaos['shadow_plant'] = self.get_vao(
            program=self.program.programs['shadow_map'],
            vbo=self.vbo.vbos['plant'])

        self.vaos['farmhouse'] = self.get_vao(
            program=self.program.programs['default'],
            vbo=self.vbo.vbos['farmhouse'])
        self.vaos['shadow_farmhouse'] = self.get_vao(
            program=self.program.programs['shadow_map'],
            vbo=self.vbo.vbos['farmhouse'])

        self.vaos['hedge'] = self.get_vao(
            program=self.program.programs['default'],
            vbo=self.vbo.vbos['hedge'])
        self.vaos['shadow_hedge'] = self.get_vao(
            program=self.program.programs['shadow_map'],
            vbo=self.vbo.vbos['hedge'])

        self.vaos['car'] = self.get_vao(
            program=self.program.programs['default'],
            vbo=self.vbo.vbos['car'])
        self.vaos['shadow_car'] = self.get_vao(
            program=self.program.programs['shadow_map'],
            vbo=self.vbo.vbos['car'])

        self.vaos['skybox'] = self.get_vao(
            program=self.program.programs['skybox'],
            vbo=self.vbo.vbos['skybox'])

    def get_vao(self, program: Program, vbo: BaseVBO) -> VertexArray:
        return self.ctx.vertex_array(program, [(vbo.vbo, vbo.format, *vbo.attribs)], skip_errors=True)

    def destroy(self) -> None:
        self.vbo.destroy()
        self.program.destroy()
