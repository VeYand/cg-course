const vertexShaderSource = `
	attribute vec3 vertex_position;
	void main(void) {
		gl_Position = vec4(vertex_position, 1.0);
	}
`

const fragmentShaderSource = `
	precision mediump float;

	uniform float rect_width;
	uniform float rect_height;
	uniform vec2 area_w;
	uniform vec2 area_h;
	uniform float max_iterations;
	uniform sampler2D palette_texture;

	void main() {
		vec2 complexCoord = vec2(
			gl_FragCoord.x * (area_w.y - area_w.x) / rect_width + area_w.x,
			gl_FragCoord.y * (area_h.y - area_h.x) / rect_height + area_h.x
		);

		vec2 z = vec2(0.0);
		float iterationCount = 0.0;

		for (float i = 0.0; i < 10000.0; i++) {
			if (i >= max_iterations) {
				break;
			}

			float realPart = z.x * z.x - z.y * z.y + complexCoord.x;
			float imagPart = 2.0 * z.x * z.y + complexCoord.y;

			if (realPart * realPart + imagPart * imagPart > 4.0) {
				break;
			}

			z = vec2(realPart, imagPart);

			iterationCount = i;
		}

		float normalizedIteration = iterationCount / max_iterations;
		vec3 paletteColor = texture2D(palette_texture, vec2(normalizedIteration, 0.5)).rgb;
		vec3 finalColor = (iterationCount == max_iterations) ? vec3(0.0) : paletteColor;

		gl_FragColor = vec4(finalColor, 1.0);
	}
`

export {vertexShaderSource, fragmentShaderSource}
