// Points Fragment shader

#pragma glslify: getRingAlpha = require('../ring.glsl')

uniform float uTime;
uniform vec3 uColour;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float ringAlpha = getRingAlpha(coord);  
  vec4 finalColour = vec4(uColour, ringAlpha);
  gl_FragColor = finalColour;
}