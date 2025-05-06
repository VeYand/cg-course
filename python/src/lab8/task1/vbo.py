from typing import Optional
from moderngl import Context, Buffer
import numpy as np
import pywavefront


class BaseVBO:
    ctx: Context
    format: Optional[str] = None
    attribs: Optional[list] = None

    def __init__(self, ctx: Context) -> None:
        self.ctx = ctx
        self.vbo = self.get_vbo()

    def get_vertex_data(self) -> np.ndarray:
        raise NotImplementedError

    def get_vbo(self) -> Buffer:
        vertex_data = self.get_vertex_data()
        return self.ctx.buffer(vertex_data)

    def destroy(self) -> None:
        self.vbo.release()


class FerretVBO(BaseVBO):
    format: str = '2f 3f 3f'
    attribs: list[str] = ['in_texcoord_0', 'in_normal', 'in_position']

    def __init__(self, ctx: Context) -> None:
        super().__init__(ctx)

    def get_vertex_data(self) -> np.ndarray:
        objs = pywavefront.Wavefront('objects/10019_ferret_v1_iterations-2.obj', cache=True, parse=True)
        obj = objs.materials.popitem()[1]
        vertex_data = obj.vertices
        vertex_data = np.array(vertex_data, dtype='f4')
        return vertex_data

class HawkVBO(BaseVBO):
    format: str = '2f 3f 3f'
    attribs: list[str] = ['in_texcoord_0', 'in_normal', 'in_position']

    def __init__(self, ctx: Context) -> None:
        super().__init__(ctx)

    def get_vertex_data(self) -> np.ndarray:
        objs = pywavefront.Wavefront('objects/10025_Hawk_v1_iterations-2.obj', cache=True, parse=True)
        obj = objs.materials.popitem()[1]
        vertex_data = obj.vertices
        vertex_data = np.array(vertex_data, dtype='f4')
        return vertex_data


class AdvancedSkyBoxVBO(BaseVBO):
    format: str = '3f'
    attribs: list[str] = ['in_position']

    def __init__(self, ctx: Context) -> None:
        super().__init__(ctx)

    def get_vertex_data(self) -> np.ndarray:
        z = 0.9999
        vertices = [(-1, -1, z), (3, -1, z), (-1, 3, z)]
        return np.array(vertices, dtype='f4')


class VBO:
    vbos: dict[str, BaseVBO] = dict()

    def __init__(self, ctx: Context) -> None:
        self.vbos['ferret'] = FerretVBO(ctx)
        self.vbos['hawk'] = HawkVBO(ctx)
        self.vbos['skybox'] = AdvancedSkyBoxVBO(ctx)

    def destroy(self) -> None:
        [vbo.destroy() for vbo in self.vbos.values()]
