from pyglm import glm
from pyglm.glm import vec3, mat4x4


class Light:
    position: vec3
    color: vec3
    direction: vec3
    Ia: vec3
    Id: vec3
    Is: vec3
    m_view_light: mat4x4

    def __init__(self, position=(80, 80, 0), color=(1, 1, 1)) -> None:
        self.position = glm.vec3(position)
        self.color = glm.vec3(color)
        self.direction = glm.vec3(0, 0, 0)
        # intensities
        self.Ia = 0.06 * self.color  # ambient
        self.Id = 0.8 * self.color  # diffuse
        self.Is = 1.0 * self.color  # specular

        self.m_view_light = self.get_view_matrix()

    def get_view_matrix(self) -> mat4x4:
        return glm.lookAt(self.position, self.direction, glm.vec3(0, 1, 0))
