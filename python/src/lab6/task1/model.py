import time

import math

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
        m_model = glm.rotate(m_model, self.rot[2], glm.vec3(0, 0, 1))
        m_model = glm.rotate(m_model, self.rot[1], glm.vec3(0, 1, 0))
        m_model = glm.rotate(m_model, self.rot[0], glm.vec3(1, 0, 0))
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


class Cube(ExtendedBaseModel):
    def __init__(self, app, vao_name='cube', tex_id=0, pos=(0, 0, 0), rot=(0, 0, 0), scale=(1, 1, 1)):
        super().__init__(app, vao_name, tex_id, pos, rot, scale)


class Ferret(ExtendedBaseModel):
    def __init__(self, app: IGraphicsEngine, vao_name='ferret', tex_id='ferret',
                 pos=(0, 0, 0), rot=(-90, 0, 0), scale=(1, 1, 1)) -> None:
        super().__init__(app, vao_name, tex_id, pos, rot, scale)


class Hawk(ExtendedBaseModel):
    def __init__(self, app: IGraphicsEngine, vao_name='hawk', tex_id='hawk',
                 pos=(0, 0, 0), rot=(-90, 0, 0), scale=(1, 1, 1)) -> None:
        super().__init__(app, vao_name, tex_id, pos, rot, scale)


class Farmhouse(ExtendedBaseModel):
    def __init__(self, app: IGraphicsEngine, vao_name='farmhouse', tex_id='farmhouse',
                 pos=(0, 0, 0), rot=(-90, 0, 0), scale=(1.0, 1.0, 1.0)) -> None:
        super().__init__(app, vao_name, tex_id, pos, rot, scale)


class Cat(ExtendedBaseModel):
    def __init__(self, app: IGraphicsEngine, vao_name='cat', tex_id='cat',
                 pos=(0, 0, 0), rot=(-90, 0, 0), scale=(1.0, 1.0, 1.0)) -> None:
        super().__init__(app, vao_name, tex_id, pos, rot, scale)
        self.base_scale = scale
        self.radius = 5
        self.speed = 0.5
        self.rotation_speed = 0.01
        self.start_time = time.time()

    def update(self):
        s = (math.sin(time.time()) + 1) * 1.5
        scale_factor = 1 + s
        self.scale = (
            self.base_scale[0] * scale_factor,
            self.base_scale[1] * scale_factor,
            self.base_scale[2] * scale_factor
        )
        t = time.time() - self.start_time
        angle = self.speed * t
        x = self.radius * math.cos(angle) + 10
        z = self.radius * math.sin(angle) + 20
        self.pos = (x, self.pos[1], z)

        rot_y = (self.rot[1] + self.rotation_speed * t) % 360
        self.rot = vec3(self.rot[0], rot_y, self.rot[2])

        self.m_model = self.get_model_matrix()
        super().update()


class Cactus(ExtendedBaseModel):
    def __init__(self, app: IGraphicsEngine, vao_name='cactus', tex_id='cactus',
                 pos=(0, 0, 0), rot=(-90, 0, 0), scale=(1.0, 1.0, 1.0)) -> None:
        super().__init__(app, vao_name, tex_id, pos, rot, scale)


class Plant(ExtendedBaseModel):
    def __init__(self, app: IGraphicsEngine, vao_name='plant', tex_id='plant',
                 pos=(0, 0, 0), rot=(-90, 0, 0), scale=(1.0, 1.0, 1.0)) -> None:
        super().__init__(app, vao_name, tex_id, pos, rot, scale)


class Hedge(ExtendedBaseModel):
    def __init__(self, app: IGraphicsEngine, vao_name='hedge', tex_id='hedge',
                 pos=(0, 0, 0), rot=(-90, 0, 0), scale=(1.0, 1.0, 1.0)) -> None:
        super().__init__(app, vao_name, tex_id, pos, rot, scale)


class Car(ExtendedBaseModel):
    def __init__(self, app: IGraphicsEngine, vao_name='car', tex_id='car',
                 pos=(0, 0, 0), rot=(-90, 0, 0), scale=(1.0, 1.0, 1.0)) -> None:
        super().__init__(app, vao_name, tex_id, pos, rot, scale)
        self.speed = 0.5
        self.amplitude = 34
        self.start_time = time.time()
        self.base_pos = pos

    def update(self):
        t = time.time() - self.start_time
        z = self.amplitude * math.cos(self.speed * t)
        self.pos = (self.base_pos[0], self.base_pos[1], z)

        self.m_model = self.get_model_matrix()
        super().update()


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
