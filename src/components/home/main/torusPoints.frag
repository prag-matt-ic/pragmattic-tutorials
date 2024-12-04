// Torus Points Fragment shader
#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uTransitionStartTime;

uniform bool uIsActive;
uniform vec3 uColour;

// varying vec3 vViewPosition;

const float TRANSITION_DURATION = 1.0;

  void main() {
    // Calculate the distance from the center of the point (normalized to [0, 1])
    vec2 coord = gl_PointCoord - vec2(0.5);
    // Create a circle outline
    float dist = length(coord);
    float innerAlpha = step(0.2, dist) * 0.5;
    float outerAlpha = 1.0 - smoothstep(0.3, 0.5, dist);
    float circleAlpha = innerAlpha * outerAlpha;

    float transitionProgress = smoothstep(
        0.0, 
        TRANSITION_DURATION, 
        uTime - uTransitionStartTime
    );

    float progress = uIsActive ? 1.0 - transitionProgress : transitionProgress;
    
    float aAlpha = 0.0; // points fade out when active
    float iAlpha = 0.7; // points fade in when inactive (normal state)
    
    float alpha = mix(aAlpha, iAlpha, progress);

    // // Reduce opacity with distance
    // float vdist = distance(vViewPosition, vec3(0.0));
    // float fadeOutAlpha = 1.0 - smoothstep(-2.0, 1.0, dist);
    
    vec4 finalColour = vec4(uColour, circleAlpha * alpha);

    gl_FragColor = finalColour;
  }