#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform bool uIsActive;
uniform float uTransitionStartTime;
uniform vec3 uColour;

const float TRANSITION_DURATION = 1.0;

  void main() {
    vec2 normalizedPoint = gl_PointCoord - vec2(0.5);
    float dist = length(normalizedPoint);

    float transitionProgress = smoothstep(
        0.0, 
        TRANSITION_DURATION, 
        uTime - uTransitionStartTime
    );

    float progress = uIsActive ? 1.0 - transitionProgress : transitionProgress;
    float alpha = 0.16 * progress;
    
    vec4 finalColour = vec4(uColour, (1.0 - dist) * alpha);

    gl_FragColor = finalColour;
  }