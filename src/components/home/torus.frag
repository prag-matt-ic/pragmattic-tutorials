// Ring Fragment shader

#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform vec3 uColour;
uniform vec3 uActiveColour;
uniform bool uIsActive;
uniform float uColourChangeStartTime;

uniform float uRadius;
uniform float uTube;

varying vec2 vUv;

const float COLOUR_CHANGE_DURATION = 1.2;


void main() {
    // Calculate the transition progress
    float transitionProgress = smoothstep(
        0.0, 
        COLOUR_CHANGE_DURATION, 
        uTime - uColourChangeStartTime
    );

    float width = uRadius + uTube;

    float progress = uIsActive ? transitionProgress: 1.0 - transitionProgress;

    float startValue = mix(-width * 1.2, width * 1.2, progress);
    float endValue = mix(-width * 1.2, width * 1.2, clamp(progress * 1.8, 0.0, 1.0));
        
    float xNoise = noise(vec3(vViewPosition.xy * 64.0, uTime)) * 0.5 + 0.5 * 0.08;

    // view position.x = 0 is the center of the torus
    float mixFactor = smoothstep(startValue, endValue, vViewPosition.y - (xNoise * (1.0 - transitionProgress)));
        
    // Blend between the two colors
    vec3 blendedColour = mix(uActiveColour, uColour, mixFactor);
    vec3 solidColour = mix(uColour, uActiveColour, float(uIsActive));
    
    vec3 colour = mix(blendedColour, solidColour, step(1.0, transitionProgress));

    vec4 finalColor = vec4(colour, 1.0);

    // Reduce opacity with distance
    float dist = length(vViewPosition);
    finalColor.a = 1.0 - smoothstep(6.0, 10.0, dist);

    csm_DiffuseColor = finalColor;
}




