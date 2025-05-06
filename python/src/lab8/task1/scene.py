from model import *


class Scene:
    app: IGraphicsEngine
    objects: list[ExtendedBaseModel] = []
    skybox: AdvancedSkyBox

    def __init__(self, app: IGraphicsEngine) -> None:
        self.app = app
        self.load()
        self.skybox = AdvancedSkyBox(app)

    def load(self) -> None:
        self.add_object(
            Ferret(self.app, pos=(0, -10, -70), rot=(-90, 90, 0))
        )

    def add_object(self, obj: ExtendedBaseModel) -> None:
        self.objects.append(obj)

    def update(self) -> None:
        ...
