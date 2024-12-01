// Ring Fragment shader

#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform vec3 uColour;
uniform vec3 uActiveColour;
uniform bool uIsActive;
uniform float uTransitionStartTime;

uniform float uRadius;
uniform float uTube;

varying vec2 vUv;

const float TRANSITION_DURATION = 1.2;
const float ACTIVE_TRANSITION_DELAY = 0.3;
const float INACTIVE_TRANSITION_DELAY = 0.0;

void main() {

    float delay = uIsActive ? ACTIVE_TRANSITION_DELAY : INACTIVE_TRANSITION_DELAY;
    float adjustedTime = uTime - uTransitionStartTime - delay;

    // Calculate the transition progress
    float transitionProgress = smoothstep(
        0.0, 
        TRANSITION_DURATION, 
        adjustedTime
    );

    float progress = uIsActive ? transitionProgress: 1.0 - transitionProgress;

    float width = uRadius + uTube;
    float startValue = mix(-width * 1.2, width * 1.2, progress);
    float endValue = mix(-width * 1.2, width * 1.2, clamp(progress * 1.8, 0.0, 1.0));
        
    float xNoise = noise(vec3(vViewPosition.xy * 16.0, uTime)) * 0.5 + 0.5 * 0.08;

    // view position.x = 0 is the center of the torus
    float mixFactor = smoothstep(startValue, endValue, vViewPosition.y - (xNoise * (1.0 - transitionProgress)));
        
    // Blend between the two colors
    vec3 blendedColour = mix(uActiveColour, uColour, mixFactor);
    vec3 solidColour = mix(uColour, uActiveColour, float(uIsActive));
    
    vec3 colour = mix(blendedColour, solidColour, step(1.0, transitionProgress));
    vec4 finalColor = vec4(colour, 1.0);

    // Reduce opacity with distance
    // float dist = length(vViewPosition);
    // finalColor.a = 1.0 - smoothstep(6.0, 10.0, dist);

    finalColor.a *= progress;

    csm_DiffuseColor = finalColor;
}




