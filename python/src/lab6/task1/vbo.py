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


class CubeVBO(BaseVBO):
    def __init__(self, ctx: Context):
        super().__init__(ctx)
        self.format = '2f 3f 3f'
        self.attribs = ['in_texcoord_0', 'in_normal', 'in_position']

    @staticmethod
    def get_data(vertices, indices):
        data = [vertices[ind] for triangle in indices for ind in triangle]
        return np.array(data, dtype='f4')

    def get_vertex_data(self) -> np.ndarray:
        vertices = [(-1, -1, 1), (1, -1, 1), (1, 1, 1), (-1, 1, 1),
                    (-1, 1, -1), (-1, -1, -1), (1, -1, -1), (1, 1, -1)]

        indices = [(0, 2, 3), (0, 1, 2),
                   (1, 7, 2), (1, 6, 7),
                   (6, 5, 4), (4, 7, 6),
                   (3, 4, 5), (3, 5, 0),
                   (3, 7, 4), (3, 2, 7),
                   (0, 6, 1), (0, 5, 6)]
        vertex_data = self.get_data(vertices, indices)

        tex_coord_vertices = [(0, 0), (1, 0), (1, 1), (0, 1)]
        tex_coord_indices = [(0, 2, 3), (0, 1, 2),
                             (0, 2, 3), (0, 1, 2),
                             (0, 1, 2), (2, 3, 0),
                             (2, 3, 0), (2, 0, 1),
                             (0, 2, 3), (0, 1, 2),
                             (3, 1, 2), (3, 0, 1), ]
        tex_coord_data = self.get_data(tex_coord_vertices, tex_coord_indices)

        normals = [(0, 0, 1) * 6,
                   (1, 0, 0) * 6,
                   (0, 0, -1) * 6,
                   (-1, 0, 0) * 6,
                   (0, 1, 0) * 6,
                   (0, -1, 0) * 6, ]
        normals = np.array(normals, dtype='f4').reshape(36, 3)

        vertex_data = np.hstack([normals, vertex_data])
        vertex_data = np.hstack([tex_coord_data, vertex_data])
        return vertex_data


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


class FarmHouseVBO(BaseVBO):
    format: str = '2f 3f 3f'
    attribs: list[str] = ['in_texcoord_0', 'in_normal', 'in_position']

    def __init__(self, ctx: Context) -> None:
        super().__init__(ctx)

    def get_vertex_data(self) -> np.ndarray:
        objs = pywavefront.Wavefront('objects/farmhouse_obj.obj', cache=True, parse=True)
        obj = objs.materials.popitem()[1]
        vertex_data = obj.vertices
        vertex_data = np.array(vertex_data, dtype='f4')
        return vertex_data


class CatVBO(BaseVBO):
    format: str = '2f 3f 3f'
    attribs: list[str] = ['in_texcoord_0', 'in_normal', 'in_position']

    def __init__(self, ctx: Context) -> None:
        super().__init__(ctx)

    def get_vertex_data(self) -> np.ndarray:
        objs = pywavefront.Wavefront('objects/12221_Cat_v1_l3.obj', cache=True, parse=True)
        obj = objs.materials.popitem()[1]
        vertex_data = obj.vertices
        vertex_data = np.array(vertex_data, dtype='f4')
        return vertex_data


class CactusVBO(BaseVBO):
    format: str = '2f 3f 3f'
    attribs: list[str] = ['in_texcoord_0', 'in_normal', 'in_position']

    def __init__(self, ctx: Context) -> None:
        super().__init__(ctx)

    def get_vertex_data(self) -> np.ndarray:
        objs = pywavefront.Wavefront('objects/10436_Cactus_v1_max2010_it2.obj', cache=True, parse=True)
        obj = objs.materials.popitem()[1]
        vertex_data = obj.vertices
        vertex_data = np.array(vertex_data, dtype='f4')
        return vertex_data


class CarVBO(BaseVBO):
    format: str = '2f 3f 3f'
    attribs: list[str] = ['in_texcoord_0', 'in_normal', 'in_position']

    def __init__(self, ctx: Context) -> None:
        super().__init__(ctx)

    def get_vertex_data(self) -> np.ndarray:
        objs = pywavefront.Wavefront('objects/Rusted Car.obj', cache=True, parse=True)
        obj = objs.materials.popitem()[1]
        vertex_data = obj.vertices
        vertex_data = np.array(vertex_data, dtype='f4')
        return vertex_data


class PlantVBO(BaseVBO):
    format: str = '2f 3f 3f'
    attribs: list[str] = ['in_texcoord_0', 'in_normal', 'in_position']

    def __init__(self, ctx: Context) -> None:
        super().__init__(ctx)

    def get_vertex_data(self) -> np.ndarray:
        objs = pywavefront.Wavefront('objects/10446_Palm_Tree_v1_max2010_iteration-2.obj', cache=True, parse=True)
        obj = objs.materials.popitem()[1]
        vertex_data = obj.vertices
        vertex_data = np.array(vertex_data, dtype='f4')
        return vertex_data


class HedgeVBO(BaseVBO):
    format: str = '2f 3f 3f'
    attribs: list[str] = ['in_texcoord_0', 'in_normal', 'in_position']

    def __init__(self, ctx: Context) -> None:
        super().__init__(ctx)

    def get_vertex_data(self) -> np.ndarray:
        objs = pywavefront.Wavefront('objects/10449_Rectangular_Box_Hedge_v1_iterations-2.obj', cache=True, parse=True)
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
        self.vbos['cube'] = CubeVBO(ctx)
        self.vbos['farmhouse'] = FarmHouseVBO(ctx)
        self.vbos['ferret'] = FerretVBO(ctx)
        self.vbos['hawk'] = HawkVBO(ctx)
        self.vbos['cat'] = CatVBO(ctx)
        self.vbos['cactus'] = CactusVBO(ctx)
        self.vbos['plant'] = PlantVBO(ctx)
        self.vbos['hedge'] = HedgeVBO(ctx)
        self.vbos['car'] = CarVBO(ctx)
        self.vbos['skybox'] = AdvancedSkyBoxVBO(ctx)

    def destroy(self) -> None:
        [vbo.destroy() for vbo in self.vbos.values()]
