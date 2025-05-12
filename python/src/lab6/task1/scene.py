from model import *


class Scene:
    app: IGraphicsEngine
    objects: list[ExtendedBaseModel] = []
    skybox: AdvancedSkyBox
    moving_cat: Cat

    def __init__(self, app: IGraphicsEngine) -> None:
        self.app = app
        self.load()
        self.skybox = AdvancedSkyBox(app)

    def load(self) -> None:
        self.__load_floor()
        self.__load_palms()
        self.__load_cactus()
        self.__load_hedge()

        self.add_object(
            Ferret(self.app, pos=(10, -1, -25), rot=(-90, 90, 0), scale=(0.025, 0.025, 0.025)),
        )
        self.add_object(
            Hawk(self.app, pos=(15.5, 9.6, -30.3), rot=(-90, -90, 0), scale=(0.05, 0.05, 0.05)),
        )
        self.add_object(
            Farmhouse(self.app, pos=(20, -1, -30), rot=(0, 90, 0), scale=(0.5, 0.5, 0.5)),
        )

        self.moving_cat = Cat(self.app, pos=(10, -1, -15), rot=(-90, 90, 0), scale=(0.03, 0.03, 0.03))
        self.add_object(
            self.moving_cat,
        )
        self.moving_car = Car(self.app, pos=(6, -1, 40), rot=(0, 90, 0), scale=(0.7, 0.7, 0.7))
        self.add_object(
            self.moving_car,
        )

    def add_object(self, obj: ExtendedBaseModel) -> None:
        self.objects.append(obj)

    def update(self) -> None:
        ...

    def __load_hedge(self) -> None:
        for x in range(6, 40, 2):
            self.add_object(
                Hedge(self.app, pos=(x, -1, -5), rot=(-90, 0, 0), scale=(0.01, 0.01, 0.01)),
            )
            self.add_object(
                Hedge(self.app, pos=(x, -1, -41), rot=(-90, 0, 0), scale=(0.01, 0.01, 0.01)),
            )
        for z in range(6, 42, 2):
            if z not in (28, 30, 32):
                self.add_object(
                    Hedge(self.app, pos=(5, -1, -z), rot=(-90, 90, 0), scale=(0.01, 0.01, 0.01)),
                )
            self.add_object(
                Hedge(self.app, pos=(39, -1, -z), rot=(-90, 90, 0), scale=(0.01, 0.01, 0.01)),
            )

    def __load_cactus(self) -> None:
        self.add_object(
            Cactus(self.app, pos=(20, -1, 15), rot=(-90, 90, 0), scale=(0.03, 0.03, 0.03)),
        )
        self.add_object(
            Cactus(self.app, pos=(13, -1, 19), rot=(-90, 90, 0), scale=(0.03, 0.03, 0.03)),
        )
        self.add_object(
            Cactus(self.app, pos=(28, -1, 24), rot=(-90, 90, 0), scale=(0.03, 0.03, 0.03)),
        )
        self.add_object(
            Cactus(self.app, pos=(22, -1, 27), rot=(-90, 90, 0), scale=(0.03, 0.03, 0.03)),
        )

    def __load_palms(self) -> None:
        self.add_object(
            Plant(self.app, pos=(28, -1, -8), rot=(-90, 90, 0), scale=(0.01, 0.01, 0.01)),
        )
        self.add_object(
            Plant(self.app, pos=(25, -1, -8), rot=(-90, 90, 0), scale=(0.01, 0.01, 0.01)),
        )
        self.add_object(
            Plant(self.app, pos=(22, -1, -8), rot=(-90, 90, 0), scale=(0.01, 0.01, 0.01)),
        )
        self.add_object(
            Plant(self.app, pos=(19, -1, -8), rot=(-90, 90, 0), scale=(0.01, 0.01, 0.01)),
        )
        self.add_object(
            Plant(self.app, pos=(16, -1, -8), rot=(-90, 90, 0), scale=(0.01, 0.01, 0.01)),
        )
        self.add_object(
            Plant(self.app, pos=(13, -1, -8), rot=(-90, 90, 0), scale=(0.01, 0.01, 0.01)),
        )
        self.add_object(
            Plant(self.app, pos=(10, -1, -8), rot=(-90, 90, 0), scale=(0.01, 0.01, 0.01)),
        )

    def __load_floor(self) -> None:
        n = 20
        thickness = 1
        road_width = 6
        cube_size = 2
        for y in range(-thickness, 0):
            for x in range(0, n):
                for z in range(-n, n):
                    if abs(x) < road_width // 2 or abs(z) < road_width // 2:
                        tex = 'stone'
                    else:
                        tex = 'dirt'
                    world_x = x * cube_size
                    world_y = y * cube_size
                    world_z = z * cube_size
                    self.add_object(Cube(self.app, tex_id=tex, pos=(world_x, world_y, world_z)))
