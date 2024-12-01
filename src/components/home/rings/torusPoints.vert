// Torus Points Vertex shader
#pragma glslify: rotateTorus = require('./rotation.glsl')
#pragma glslify: noiseTorus = require('./noise.glsl')

#pragma glslify: noise = require('glsl-noise/simplex/3d')

attribute vec3 inactivePosition;
attribute vec3 scatteredPosition;

uniform float uTime;
uniform float uTransitionStartTime;
uniform float uRotateSpeed;
uniform bool uIsActive;
uniform float uScrollProgress;

varying vec3 vViewPosition;

const float POSITION_TRANSITION_DURATION = 0.5;
const float ACTIVE_TRANSITION_DELAY = 0.0;
const float INACTIVE_TRANSITION_DELAY = 1.0;
const float MIN_PT_SIZE = 3.0;
const float MAX_PT_SIZE = 18.0;

void main() {
    float delay = uIsActive ? ACTIVE_TRANSITION_DELAY : INACTIVE_TRANSITION_DELAY;
    float adjustedTime = uTime - uTransitionStartTime - delay;

    float transitionProgress = smoothstep(0.0, POSITION_TRANSITION_DURATION, adjustedTime);

    float progress = uIsActive ? 1.0 - transitionProgress : transitionProgress;
    
    // vec3 particlePosition = mix(position, inactivePosition, progress);
    vec3 particlePosition = mix(scatteredPosition, inactivePosition, uScrollProgress);
    particlePosition = mix(position, particlePosition, progress);

    particlePosition = rotateTorus(particlePosition, uTime, uRotateSpeed);
    particlePosition = noiseTorus(particlePosition, uTime);

    vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    vViewPosition = viewPosition.xyz;

    // Attenuation factor - further away the particle is from the camera, the smaller it will be
    float attenuationFactor = 1.0 / projectedPosition.z;
    float pointSize = clamp(MIN_PT_SIZE, MAX_PT_SIZE, MAX_PT_SIZE * attenuationFactor);

    gl_Position = projectedPosition;
    gl_PointSize = pointSize;
    
}
