// Ring Fragment shader

#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform vec3 uColour;
uniform vec3 uActiveColour;
uniform bool uIsActive;

varying vec2 vUv;

void main() {
    
    // Output the final color
    vec3 colour = mix(uColour, uActiveColour, float(uIsActive));
    vec4 finalColor = vec4(colour, 1.0);

    // Reduce opacity with distance
    float dist = length(vViewPosition);
    finalColor.a = 1.0 - smoothstep(6.0, 10.0, dist);

    csm_DiffuseColor = finalColor;
}




