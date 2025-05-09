from moderngl import VertexArray, Program, TextureCube, Texture
from pyglm import glm
from pyglm.glm import vec3, mat4x4
from graphics_engine import IGraphicsEngine
from camera import Camera


class BaseModel:
    app: IGraphicsEngine
    pos: tuple[float, float, float]
    vao_name: str
    rot: vec3
    scale: tuple[float, float, float]
    m_model: mat4x4
    tex_id: str
    vao: VertexArray
    program: Program
    camera: Camera

    def __init__(self, app: IGraphicsEngine, vao_name: str, tex_id: str, pos=(0, 0, 0), rot=(0, 0, 0), scale=(1, 1, 1)):
        self.app = app
        self.pos = pos
        self.vao_name = vao_name
        self.rot = glm.vec3([glm.radians(a) for a in rot])
        self.scale = scale
        self.m_model = self.get_model_matrix()
        self.tex_id = tex_id
        self.vao = app.mesh.vao.vaos[vao_name]
        self.program = self.vao.program
        self.camera = self.app.camera

    def update(self) -> None: ...

    def get_model_matrix(self) -> mat4x4:
        m_model = glm.mat4()
        # translate
        m_model = glm.translate(m_model, self.pos)
        # rotate
        m_model = glm.rotate(m_model, self.rot.z, glm.vec3(0, 0, 1))
        m_model = glm.rotate(m_model, self.rot.y, glm.vec3(0, 1, 0))
        m_model = glm.rotate(m_model, self.rot.x, glm.vec3(1, 0, 0))
        # scale
        m_model = glm.scale(m_model, self.scale)
        return m_model

    def render(self):
        self.update()
        self.vao.render()


class ExtendedBaseModel(BaseModel):
    def __init__(self, app: IGraphicsEngine, vao_name: str, tex_id: str, pos: tuple[int, int, int],
                 rot: tuple[int, int, int], scale: tuple[int, int, int]) -> None:
        super().__init__(app, vao_name, tex_id, pos, rot, scale)
        self.on_init()

    def update(self) -> None:
        self.texture.use(location=0)
        self.program['camPos'].write(self.camera.position)
        self.program['m_view'].write(self.camera.m_view)
        self.program['m_model'].write(self.m_model)

    def update_shadow(self) -> None:
        self.shadow_program['m_model'].write(self.m_model)

    def render_shadow(self) -> None:
        self.update_shadow()
        self.shadow_vao.render()

    def on_init(self) -> None:
        self.program['m_view_light'].write(self.app.light.m_view_light)
        # resolution
        self.program['u_resolution'].write(glm.vec2(self.app.WIN_SIZE))
        # depth texture
        self.depth_texture = self.app.mesh.texture.textures['depth_texture']
        self.program['shadowMap'] = 1
        self.depth_texture.use(location=1)
        # shadow
        self.shadow_vao = self.app.mesh.vao.vaos['shadow_' + self.vao_name]
        self.shadow_program = self.shadow_vao.program
        self.shadow_program['m_proj'].write(self.camera.m_proj)
        self.shadow_program['m_view_light'].write(self.app.light.m_view_light)
        self.shadow_program['m_model'].write(self.m_model)
        # texture
        self.texture = self.app.mesh.texture.textures[self.tex_id]
        self.program['u_texture_0'] = 0
        self.texture.use(location=0)
        # mvp
        self.program['m_proj'].write(self.camera.m_proj)
        self.program['m_view'].write(self.camera.m_view)
        self.program['m_model'].write(self.m_model)
        # light
        self.program['light.position'].write(self.app.light.position)
        self.program['light.Ia'].write(self.app.light.Ia)
        self.program['light.Id'].write(self.app.light.Id)
        self.program['light.Is'].write(self.app.light.Is)


class Ferret(ExtendedBaseModel):
    def __init__(self, app: IGraphicsEngine, vao_name='ferret', tex_id='ferret',
                 pos=(0, 0, 0), rot=(-90, 0, 0), scale=(1, 1, 1)) -> None:
        super().__init__(app, vao_name, tex_id, pos, rot, scale)

class Hawk(ExtendedBaseModel):
    def __init__(self, app: IGraphicsEngine, vao_name='hawk', tex_id='hawk',
                 pos=(0, 0, 0), rot=(-90, 0, 0), scale=(1, 1, 1)) -> None:
        super().__init__(app, vao_name, tex_id, pos, rot, scale)

class AdvancedSkyBox(BaseModel):
    texture: Texture | TextureCube

    def __init__(self, app: IGraphicsEngine, vao_name='skybox', tex_id='skybox',
                 pos=(0, 0, 0), rot=(0, 0, 0), scale=(1, 1, 1)) -> None:
        super().__init__(app, vao_name, tex_id, pos, rot, scale)
        self.on_init()

    def update(self) -> None:
        m_view = glm.mat4(glm.mat3(self.camera.m_view))
        self.program['m_invProjView'].write(glm.inverse(self.camera.m_proj * m_view))

    def on_init(self) -> None:
        self.texture = self.app.mesh.texture.textures[self.tex_id]
        self.program['u_texture_skybox'] = 0
        self.texture.use(location=0)
