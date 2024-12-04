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
  float timeA = uTime * 0.3;
  float timeB = uTime * 0.2;
        
  // Normalized noise values with different uv scales
  float noiseA = noise(vec3(vUv, timeA)) * 0.5 + 0.5;
  float noiseB = noise(vec3(vUv * 0.5, timeB)) * 0.5 + 0.5;

  // mix of 3 colours based on noise values
  vec3 colour = mix(mix(uMidColour, uOffBlackColour, noiseB), uLightColour, noiseA);

  // vignette with a dynamic falloff
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uAspect;
  float vignette = distance(uv, vec2(0.0));
  float outerStep = 1.3 - (noiseB * 0.3);
  float vig = smoothstep(0.6, outerStep, vignette);

  colour = mix(colour, uBlackColour, vig);

  // high frequency noise for a grainy effect
  float noiseV = noise(vec3(vUv * 512.0, uTime)); 
  vec3 noiseColour = mix(uBlackColour, uLightColour, noiseV);

  colour = mix(colour, noiseColour, 0.16);

  gl_FragColor = vec4(colour, 1.0);
}