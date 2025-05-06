import sys
import numpy as np
from typing import Optional
from PyQt5.QtWidgets import QApplication, QMainWindow, QOpenGLWidget
from PyQt5.QtCore import QTimer
from PyQt5.QtGui import QSurfaceFormat
from OpenGL.GL import *
from shader import Shader
from circle import Circle

class App(QOpenGLWidget):
    def __init__(self, parent: Optional[QMainWindow] = None) -> None:
        super().__init__(parent)
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update)
        self.shader_program: Optional[int] = None

        self.circles = [
            Circle(0.3, (-0.7, -0.2)),
            Circle(0.5, (-0.5, 0.7)),
            Circle(0.1, (0.2, 0.3)),
        ]

    def initializeGL(self) -> None:
        self.shader_program = Shader().get_program('circle')
        for circle in self.circles:
            circle.init_gl(self.shader_program)

    def paintGL(self) -> None:
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
        for circle in self.circles:
            circle.draw()

    def resizeGL(self, w: int, h: int) -> None:
        glViewport(0, 0, w, h)

class MainWindow(QMainWindow):
    def __init__(self) -> None:
        super().__init__()
        self.setWindowTitle("Lab 7. Task 5")
        widget = App(self)
        self.setCentralWidget(widget)
        self.resize(1000, 1000)


if __name__ == "__main__":
    fmt = QSurfaceFormat()
    fmt.setVersion(3, 3)
    fmt.setProfile(QSurfaceFormat.CoreProfile)
    QSurfaceFormat.setDefaultFormat(fmt)

    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())
