// Torus Points Fragment shader
#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uActiveProgress;
uniform vec3 uColour;

const float INTRO_DURATION = 1.6;

  void main() {
    // Calculate the distance from the center of the point (normalized to [0, 1])
    vec2 coord = gl_PointCoord - vec2(0.5);
    // Create a circle outline
    float dist = length(coord);
    float innerAlpha = step(0.2, dist) * 0.5;
    float outerAlpha = 1.0 - smoothstep(0.3, 0.5, dist);
    float circleAlpha = innerAlpha * outerAlpha;

    float introProgress = smoothstep(
        0.0, 
        INTRO_DURATION, 
        uTime
    );

    // float introAlpha = introProgress;
    float normalAlpha = 0.7; // points fade in when inactive (normal state)
    float activeAlpha = 0.0; // points fade out when active
    
    float alpha = mix(mix(0.0, normalAlpha, introProgress), activeAlpha, uActiveProgress);

    // // Reduce opacity with distance
    // float vdist = distance(vViewPosition, vec3(0.0));
    // float fadeOutAlpha = 1.0 - smoothstep(-2.0, 1.0, dist);
    
    vec4 finalColour = vec4(uColour, circleAlpha * alpha);

    gl_FragColor = finalColour;
  }