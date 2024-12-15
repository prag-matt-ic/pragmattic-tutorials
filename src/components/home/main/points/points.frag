// Points Fragment shader

#pragma glslify: getRingAlpha = require('../ring.glsl')

varying vec3 vColour;
uniform float uTime;

void main() {
  vec2 coord = gl_PointCoord - vec2(0.5);
  float ringAlpha = getRingAlpha(coord, uTime);  
  vec4 finalColour = vec4(vColour, ringAlpha * 0.7);
  gl_FragColor = finalColour;
}