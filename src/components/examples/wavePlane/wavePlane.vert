// Vertex shader

// Import the noise function

#pragma glslify: noise = require('glsl-noise/simplex/3d')
#pragma glslify: rotateX = require(glsl-rotate/rotateX)

uniform float uTime;
uniform float uScrollOffset;

varying vec2 vUv;
varying float vTerrainHeight;

void main() {
    vUv = uv;

    // Noise value between -1 and 1
    float time = 0.;// uTime * 0.1;
    float noiseValue = noise(vec3(position.x / 4.0,( position.y / 4.0) + uScrollOffset, time));
    // Noise value between 0 and 1
    float normalisedNoise = noiseValue * 0.5 + 0.5;
    
    vec3 newPosition = position;
    newPosition.z += normalisedNoise;

    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // Pass the terrain height into the fragment shader
    vTerrainHeight = normalisedNoise;

    gl_Position = projectedPosition;
}