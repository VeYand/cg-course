from pyglm import glm
import pygame as pg
from pyglm.glm import vec3, mat4x4
from graphics_engine import IGraphicsEngine

FOV = 50
NEAR = 0.1
FAR = 300
SPEED = 0.03
SENSITIVITY = 0.04


class Camera:
    app: IGraphicsEngine
    aspect_ratio: float
    position: vec3
    up: vec3
    right: vec3
    forward: vec3
    yaw: int
    pitch: int
    m_view: mat4x4
    m_proj: mat4x4

    def __init__(self, app: IGraphicsEngine, position=(0, 0, 4), yaw=-90, pitch=0) -> None:
        self.app = app
        self.aspect_ratio = app.WIN_SIZE[0] / app.WIN_SIZE[1]
        self.position = glm.vec3(position)
        self.up = glm.vec3(0, 1, 0)
        self.right = glm.vec3(1, 0, 0)
        self.forward = glm.vec3(0, 0, -1)
        self.yaw = yaw
        self.pitch = pitch
        self.m_view = self.get_view_matrix()
        self.m_proj = self.get_projection_matrix()

    def rotate(self) -> None:
        rel_x, rel_y = pg.mouse.get_rel()
        self.yaw += rel_x * SENSITIVITY
        self.pitch -= rel_y * SENSITIVITY
        self.pitch = max(-89, min(89, self.pitch))

    def update_camera_vectors(self) -> None:
        yaw, pitch = glm.radians(self.yaw), glm.radians(self.pitch)

        self.forward.x = glm.cos(yaw) * glm.cos(pitch)
        self.forward.y = glm.sin(pitch)
        self.forward.z = glm.sin(yaw) * glm.cos(pitch)

        self.forward = glm.normalize(self.forward)
        self.right = glm.normalize(glm.cross(self.forward, glm.vec3(0, 1, 0)))
        self.up = glm.normalize(glm.cross(self.right, self.forward))

    def update(self) -> None:
        self.move()
        self.rotate()
        self.update_camera_vectors()
        self.m_view = self.get_view_matrix()

    def move(self) -> None:
        velocity = SPEED * self.app.delta_time
        keys = pg.key.get_pressed()
        if keys[pg.K_w] or keys[pg.K_UP]:
            self.position += self.forward * velocity
        if keys[pg.K_s] or keys[pg.K_DOWN]:
            self.position -= self.forward * velocity
        if keys[pg.K_a] or keys[pg.K_LEFT]:
            self.position -= self.right * velocity
        if keys[pg.K_d] or keys[pg.K_RIGHT]:
            self.position += self.right * velocity
        if keys[pg.K_q] or keys[pg.K_LSHIFT] or keys[pg.K_RSHIFT]:
            self.position += self.up * velocity
        if keys[pg.K_e] or keys[pg.K_LCTRL] or keys[pg.K_RCTRL]:
            self.position -= self.up * velocity

    def get_view_matrix(self) -> mat4x4:
        return glm.lookAt(self.position, self.position + self.forward, self.up)

    def get_projection_matrix(self) -> mat4x4:
        return glm.perspective(glm.radians(FOV), self.aspect_ratio, NEAR, FAR)
