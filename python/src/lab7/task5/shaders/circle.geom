#version 330 core
layout(points) in;
layout(line_strip, max_vertices = 121) out;

uniform float radius;
uniform vec2 pointPosition;

const float PI = 3.14159265;
const float segments = 60;

void main() {

    for (int i = 0; i <= segments; i++) {
        float angle = 2.0 * PI * float(i) / segments;
        vec2 offset = vec2(cos(angle), sin(angle)) * radius;
        gl_Position = vec4(pointPosition + offset, 0.0, 1.0);
        EmitVertex();
    }
    EndPrimitive();
}