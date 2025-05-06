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
		vec2 start = vec2(
			gl_FragCoord.x * (area_w.y - area_w.x) / rect_width + area_w.x,
			gl_FragCoord.y * (area_h.y - area_h.x) / rect_height + area_h.x
		);

		vec2 z = vec2(0.0);
		float iterationCount = 0.0;

		for (float i = 0.0; i < 10000.0; i++) {
			if (i >= max_iterations) {
				break;
			}

			float xn1 = z.x * z.x - z.y * z.y + start.x;
			float yn1 = 2.0 * z.x * z.y + start.y;

			if (xn1 * xn1 + yn1 * yn1 > 1e15) {
				break;
			}

			z = vec2(xn1, yn1);

			iterationCount = i;
		}

		float normalizedIteration = iterationCount / max_iterations;
		vec3 paletteColor = texture2D(palette_texture, vec2(normalizedIteration, 0.5)).rgb; // взять текстуру со спектром от 
		vec3 finalColor = (iterationCount == max_iterations) ? vec3(0.0) : paletteColor;

		gl_FragColor = vec4(finalColor, 1.0);
	}
`

export {vertexShaderSource, fragmentShaderSource}
// TODO поправить текстуру, поправить зум. В конце текстуры добавить черный пиксель. Сохранять пропорции при изменении соотношения экрана