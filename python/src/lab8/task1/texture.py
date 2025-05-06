import pygame as pg
import moderngl as mgl
from graphics_engine import IGraphicsEngine


class Texture:
    app: IGraphicsEngine
    textures: dict[str, mgl.Texture | mgl.TextureCube] = dict()

    def __init__(self, app: IGraphicsEngine) -> None:
        self.app = app
        self.textures['skybox'] = self.get_texture_cube(dir_path='textures/skybox/', ext='png')
        self.textures['depth_texture'] = self.get_depth_texture()
        self.textures['ferret'] = self.get_texture(path='objects/10019_ferret_v1_Diffuse.jpg')

    def get_depth_texture(self) -> mgl.Texture:
        depth_texture = self.app.ctx.depth_texture(self.app.WIN_SIZE)
        depth_texture.repeat_x = False
        depth_texture.repeat_y = False
        return depth_texture

    def get_texture_cube(self, dir_path: str, ext='png') -> mgl.TextureCube:
        faces = ['right', 'left', 'top', 'bottom'] + ['front', 'back'][::-1]
        textures = []
        for face in faces:
            texture = pg.image.load(dir_path + f'{face}.{ext}').convert()
            if face in ['right', 'left', 'front', 'back']:
                texture = pg.transform.flip(texture, flip_x=True, flip_y=False)
            else:
                texture = pg.transform.flip(texture, flip_x=False, flip_y=True)
            textures.append(texture)

        size = textures[0].get_size()
        texture_cube = self.app.ctx.texture_cube(size=size, components=3, data=None)

        for i in range(6):
            texture_data = pg.image.tostring(textures[i], 'RGB')
            texture_cube.write(face=i, data=texture_data)

        return texture_cube

    def get_texture(self, path: str) -> mgl.Texture:
        texture = pg.image.load(path).convert()
        texture = pg.transform.flip(texture, flip_x=False, flip_y=True)
        texture = self.app.ctx.texture(size=texture.get_size(), components=3,
                                       data=pg.image.tostring(texture, 'RGB'))
        texture.filter = (mgl.LINEAR_MIPMAP_LINEAR, mgl.LINEAR)
        texture.build_mipmaps()

        texture.anisotropy = 32.0

        return texture

    def destroy(self) -> None:
        [tex.release() for tex in self.textures.values()]
