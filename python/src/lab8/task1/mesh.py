from graphics_engine import IGraphicsEngine
from vao import VAO
from texture import Texture


class Mesh:
    app: IGraphicsEngine
    vao: VAO
    texture: Texture

    def __init__(self, app: IGraphicsEngine):
        self.app = app
        self.vao = VAO(app.ctx)
        self.texture = Texture(app)

    def destroy(self):
        self.vao.destroy()
        self.texture.destroy()
