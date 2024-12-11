// Points Fragment shader

#pragma glslify: getRingAlpha = require('../ring.glsl')

varying vec3 vColour;
uniform float uTime;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float ringAlpha = getRingAlpha(coord);  
  vec4 finalColour = vec4(vColour, ringAlpha);
  gl_FragColor = finalColour;
}