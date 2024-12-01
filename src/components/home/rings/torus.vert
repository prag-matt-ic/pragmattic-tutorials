// Torus Vertex shader
#pragma glslify: rotateTorus = require('./rotation.glsl')
#pragma glslify: noiseTorus = require('./noise.glsl')

#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uTransitionStartTime;
uniform float uRotateSpeed;
uniform bool uIsActive;

varying vec2 vUv;

void main() {
    vUv = uv;

    vec3 projectedPosition = position;
    projectedPosition = rotateTorus(projectedPosition, uTime, uRotateSpeed);
    projectedPosition = noiseTorus(projectedPosition, uTime);

    // Set the position for the CustomShaderMaterial
    csm_Position = projectedPosition;
}
