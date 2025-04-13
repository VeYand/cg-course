const vertexShaderSource = `
	attribute vec4 aVertexPosition;
	attribute vec3 aVertexNormal;
	attribute vec2 aTextureCoord;
	
	uniform mat4 uModelMatrix;
	uniform mat4 uModelViewMatrix;
	uniform mat4 uProjectionMatrix;
	uniform mat4 uNormalMatrix;
	uniform float uUseLight;
	
	uniform vec3 u_lightWorldPosition;
	uniform vec3 u_viewWorldPosition;
	
	varying highp vec2 vTextureCoord;
	varying vec3 v_normal;
	varying vec3 v_surfaceToLight;
	varying vec3 v_surfaceToView;
	varying float v_useLight;	
	
	void main(void) {
	    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
	    vTextureCoord = aTextureCoord;
	    
	    vec4 worldPosition = uModelMatrix * aVertexPosition;
	    
	    v_normal = mat3(uNormalMatrix) * aVertexNormal;
	    v_surfaceToLight = u_lightWorldPosition - worldPosition.xyz;
	    v_surfaceToView = u_viewWorldPosition - worldPosition.xyz;
	    v_useLight = uUseLight;
	}
`

const fragmentShaderSource = `
	precision mediump float;
	varying highp vec2 vTextureCoord;
	varying vec3 v_normal;
	varying vec3 v_surfaceToLight;
	varying vec3 v_surfaceToView;
	varying float v_useLight;	

	uniform sampler2D uSampler;
	uniform vec3 u_lightColor;
	uniform vec3 u_specularColor;
	uniform float u_shininess;
	
	void main(void) {
	    vec3 normal = normalize(v_normal);
	    vec3 lightDir = normalize(v_surfaceToLight);
	    vec3 viewDir = normalize(v_surfaceToView);
	    vec3 halfVector = normalize(lightDir + viewDir);
	    
	    float diffuse = max(dot(normal, lightDir), 0.0);
	    float specular = 0.0;
	    if(diffuse > 0.0) {
	        specular = pow(max(dot(normal, halfVector), 0.0), u_shininess);
	    }
	    
	    vec4 texColor = texture2D(uSampler, vTextureCoord);
	    vec4 finalColor = texColor;
	    
	    if(v_useLight > 0.5) {
	        finalColor.rgb = texColor.rgb * diffuse * u_lightColor + specular * u_specularColor;
	    }
	    
	    gl_FragColor = finalColor;
	}
`

export {
	vertexShaderSource,
	fragmentShaderSource,
}