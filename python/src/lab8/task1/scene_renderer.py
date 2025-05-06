from moderngl import Texture, TextureCube, Framebuffer
from graphics_engine import IGraphicsEngine
from mesh import Mesh
from scene import Scene


class SceneRenderer:
    app: IGraphicsEngine
    mesh: Mesh
    scene: Scene
    depth_texture: Texture | TextureCube
    depth_fbo: Framebuffer

    def __init__(self, app: IGraphicsEngine):
        self.app = app
        self.ctx = app.ctx
        self.mesh = app.mesh
        self.scene = app.scene

        self.depth_texture = self.mesh.texture.textures['depth_texture']
        self.depth_fbo = self.ctx.framebuffer(depth_attachment=self.depth_texture)

    def render_shadow(self) -> None:
        self.depth_fbo.clear()
        self.depth_fbo.use()
        for obj in self.scene.objects:
            obj.render_shadow()

    def main_render(self) -> None:
        self.app.ctx.screen.use()
        for obj in self.scene.objects:
            obj.render()
        self.scene.skybox.render()

    def render(self) -> None:
        self.scene.update()
        self.render_shadow()
        self.main_render()

    def destroy(self) -> None:
        self.depth_fbo.release()
