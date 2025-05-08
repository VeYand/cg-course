import pygame as pg
import sys
from pygame.time import Clock
from camera import Camera
from light import Light
from mesh import Mesh
from scene import Scene
from scene_renderer import SceneRenderer
import moderngl as mgl
from graphics_engine import IGraphicsEngine

WIN_SIZE: tuple[int, int] = (1000, 800)

class GraphicsEngine(IGraphicsEngine):
    clock: Clock
    light: Light
    camera: Camera
    mesh: Mesh
    scene: Scene
    scene_renderer: SceneRenderer

    def __init__(self) -> None:
        pg.init()

        self.WIN_SIZE = WIN_SIZE

        pg.display.gl_set_attribute(pg.GL_CONTEXT_MAJOR_VERSION, 3)
        pg.display.gl_set_attribute(pg.GL_CONTEXT_MINOR_VERSION, 3)
        pg.display.gl_set_attribute(pg.GL_CONTEXT_PROFILE_MASK, pg.GL_CONTEXT_PROFILE_CORE)

        pg.display.set_mode(self.WIN_SIZE, flags=pg.OPENGL | pg.DOUBLEBUF)

        pg.event.set_grab(True)
        pg.mouse.set_visible(False)

        self.ctx = mgl.create_context()

        self.ctx.enable(flags=mgl.DEPTH_TEST | mgl.CULL_FACE)

        self.clock = pg.time.Clock()
        self.time = 0
        self.delta_time = 0

        self.light = Light()
        self.camera = Camera(self)
        self.mesh = Mesh(self)
        self.scene = Scene(self)
        self.scene_renderer = SceneRenderer(self)

    def check_events(self) -> None:
        for event in pg.event.get():
            if event.type == pg.QUIT or (event.type == pg.KEYDOWN and event.key == pg.K_ESCAPE):
                self.mesh.destroy()
                self.scene_renderer.destroy()
                pg.quit()
                sys.exit()

    def render(self) -> None:
        self.ctx.clear(red=0.0, green=0.0, blue=0.0)
        self.scene_renderer.render()
        pg.display.flip()

    def update_time(self) -> None:
        self.time = int(pg.time.get_ticks() * 0.001)

    def run(self) -> None:
        while True:
            self.update_time()
            self.check_events()
            self.camera.update()
            self.render()
            self.delta_time = self.clock.tick(60)


if __name__ == '__main__':
    app = GraphicsEngine()
    app.run()
