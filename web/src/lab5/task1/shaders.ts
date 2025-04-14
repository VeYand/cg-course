const vertexShaderSource = `
attribute vec4 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uModelMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;
uniform float uUseLight;

varying highp vec2 vTextureCoord;
varying vec3 v_normal;
varying vec3 v_viewDirection;
	varying float v_useLight;

void main(void) {
	gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

	vec4 worldPosition = uModelMatrix * aVertexPosition;
	v_normal = mat3(uNormalMatrix) * aVertexNormal;
	v_viewDirection = -worldPosition.xyz;

	vTextureCoord = aTextureCoord;
	v_useLight = uUseLight;
}
`


const fragmentShaderSource = `
	precision mediump float;
	varying highp vec2 vTextureCoord;
	varying vec3 v_normal;
	varying vec3 v_viewDirection;
	varying float v_useLight;

	uniform sampler2D uSampler;
	uniform vec3 u_lightDirection;
	uniform vec3 u_lightColor;
	uniform vec3 u_specularColor;
	uniform float u_shininess;
	
	void main(void) {
		vec3 normal = normalize(v_normal);
		vec3 lightDir = normalize(-u_lightDirection); // направление света в сторону объектов
		vec3 viewDir = normalize(v_viewDirection);
		vec3 halfVector = normalize(lightDir + viewDir);

		float diffuse = max(dot(normal, lightDir), 0.0);
		float specular = 0.0;
		if (diffuse > 0.0) {
			specular = pow(max(dot(normal, halfVector), 0.0), u_shininess);
		}

		vec4 texColor = texture2D(uSampler, vTextureCoord);
		vec4 finalColor = texColor;
		if(v_useLight > 0.5) {
			finalColor.rgb = texColor.rgb * u_lightColor * diffuse + specular * u_specularColor;
		}

		gl_FragColor = finalColor;
	}
`

export {
	vertexShaderSource,
	fragmentShaderSource,
}