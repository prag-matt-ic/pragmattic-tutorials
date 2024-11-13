// gradient.frag
// Fragment shader

#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform sampler2D uTexture;
uniform float uTime;
uniform float uAspect;

varying vec2 vUv;

// Color palette function
vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  float colourInput = noise(vec3(vUv, sin(uTime * 0.2)));

  // Getting these values from this site: http://dev.thi.ng/gradients/
  // [[0.500 0.500 0.500] [0.666 0.666 0.666] [1.000 1.000 1.000] [0.000 0.333 0.667]]
  vec3 color = palette(colourInput, vec3(0.5), vec3(0.166), vec3(1.0), vec3(0.0, 0.333, 0.667));

  // [[0.369 0.919 0.590] [0.344 0.306 0.378] [0.965 1.011 1.259] [0.976 4.801 2.072]]
  vec3 color2 = palette(colourNoise, vec3(0.369, 0.919, 0.590), vec3(0.344, 0.306, 0.378), vec3(0.965, 1.011, 1.259), vec3(0.976, 4.801, 2.072));

  gl_FragColor = vec4(color2, 1.0);;
}