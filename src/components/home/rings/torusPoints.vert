// Torus Points Vertex shader
#pragma glslify: rotateTorus = require('./rotation.glsl')
#pragma glslify: noiseTorus = require('./noise.glsl')

#pragma glslify: noise = require('glsl-noise/simplex/3d')

// TODO: Add dispersion when active.
// attribute vec3 dispersedPosition;

uniform float uTime;
uniform float uTransitionStartTime;
uniform float uRotateSpeed;

varying vec2 vUv;

const float TRANSITION_DURATION = 1.0;
const float MIN_POINT_SIZE = 2.0;
const float MAX_POINT_SIZE = 16.0;

void main() {
    // vec3 particlePosition = position;

    float transitionProgress = smoothstep(
        0.0, 
        TRANSITION_DURATION, 
        uTime - uTransitionStartTime
    );

    // TODO: Interpolate between the original and dispersed positions
    vec3 particlePosition = position;// mix(position, dispersedPosition, transitionProgress);

    particlePosition = rotateTorus(particlePosition, uTime, uRotateSpeed);
    particlePosition = noiseTorus(particlePosition, uTime);


    vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // Attenuation factor - further away the particle is from the camera, the smaller it will be
    float attenuationFactor = (1.0 / projectedPosition.z);

    // Point size is required for point rendering
    float pointSize = clamp(MIN_POINT_SIZE, MAX_POINT_SIZE, MAX_POINT_SIZE * attenuationFactor);

    gl_Position = projectedPosition;
    gl_PointSize = pointSize;
    
}
