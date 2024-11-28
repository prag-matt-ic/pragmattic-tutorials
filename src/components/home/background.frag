// Home Background Fragment shader

#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uAspect;
uniform vec3 uLightColour;
uniform vec3 uMidColour;
uniform vec3 uOffBlackColour;
uniform vec3 uBlackColour;

varying vec2 vUv;

void main() {
  float timeA = uTime * 0.1;
  float timeB = uTime * 0.2;
        
  // Normalized noise values with different uv scales
  float noiseA = noise(vec3(vUv, timeA)) * 0.5 + 0.5;
  float noiseB = noise(vec3(vUv * 0.5, timeB)) * 0.5 + 0.5;

  // Creates 2 layers for above and below the wave
  vec3 darkColour = mix(mix(uLightColour, uMidColour, noiseB), uOffBlackColour, noiseA);

  float vignette = distance(vUv, vec2(0.5));
  // Create a vignette to off_black colour around the edges
  float outerStep = 0.5 + noiseB * 0.2;
  float vig = smoothstep(0.2, outerStep, vignette);

  // high frequency noise for the vignette
  float noiseV = noise(vec3(vUv * 512.0, uTime * 8.0)); 
  vec3 noiseColour = mix(uBlackColour, uMidColour, noiseV);

  vec3 finalColour = mix(darkColour, noiseColour, vig);

  gl_FragColor = vec4(finalColour, 1.0);
}