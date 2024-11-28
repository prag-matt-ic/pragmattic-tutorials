// Home Background Fragment shader

#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uAspect;

varying vec2 vUv;

// #2E2A37
const vec4 MID = vec4(0.18, 0.16, 0.22, 1.0);
// #2E2245
const vec4 PURPLE = vec4(0.18, 0.13, 0.27, 1.0); 
// #1E1B23
const vec4 OFF_BLACK = vec4(0.12, 0.11, 0.13, 1.0);
// #0A090C
const vec4 BLACK = vec4(0.04, 0.04, 0.05, 1.0);
// #37FFA8
const vec4 GREEN = vec4(0.22, 1.0, 0.66, 1.0);
// #228AA6
const vec4 BLUE = vec4(0.13, 0.54, 0.65, 1.0);


void main() {
  float timeA = uTime * 0.25;
  float timeB = uTime * 0.5;
        
  // Normalized noise values with different uv scales
  float noiseA = noise(vec3(vUv * 0.5, timeA));
  float noiseB = noise(vec3(vUv * 1.4, timeB));
  // float noiseC = noise(vec3(vUv * 3.0, timeA));

  // Creates 2 layers for above and below the wave
  vec4 darkColour = mix(mix(MID, OFF_BLACK, noiseA), BLACK, noiseB);

  // vec2 uv = vUv;
  // uv.y /= uAspect;

  // vec2 center = vec2(0.5, 0.5 / uAspect);
  // float radius = 0.33;
  // float circle = distance(uv, center) / radius;

  // float smoothCircle = smoothstep(0., 0.5, circle);

  // vec4 finalColour = BLACK;

  // finalColour = mix(greenColour, darkColour, smoothCircle);

  gl_FragColor = darkColour;
}