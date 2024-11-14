// gradient.frag

#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform vec3 uLightColour;
uniform vec3 uMidColour;
uniform vec3 uDarkColour;

varying vec2 vUv;


void main() {
  float n = noise(vec3(vUv.x * 1.2, vUv.y, uTime * 0.1));
  vec3 color = mix(uLightColour, uDarkColour, n);
  
  gl_FragColor = vec4(color, 1.0);;
}