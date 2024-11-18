// gradient.frag

#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uScrollProgress;
// Config
uniform float uSpeed; // 0.2
uniform float uUvDistortionIterations; // 4
uniform float uUvDistortionIntensity; // 0.2
uniform vec3 uColourPalette[4]; // vec3(0.5), vec3(0.166), vec3(1.0), vec3(0.0, 0.333, 0.667)
// Colour palette values taken from: http://dev.thi.ng/gradients/

varying vec2 vUv;

// Color palette function
vec3 cosineGradientColor(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return clamp(a + b * cos(6.28318 * (c * t + d)), 0.0, 1.0);
}

void main() {
  vec2 uv = vUv;
  // Translate the uv coordinates based on the scroll progress
  uv.y -= uScrollProgress;

  // Adjust the time value based on the speed
  float time = uTime * uSpeed;

  // Distort the uv coordinates with noise
  for (float i = 0.0; i < uUvDistortionIterations; i++) {
    uv += noise(vec3(uv - i * 0.2, time + i * 24.)) * uUvDistortionIntensity;
  }

  float colourInput = noise(vec3(uv, sin(time))) * 0.5 + 0.5;

  vec3 colour = cosineGradientColor(colourInput, uColourPalette[0], uColourPalette[1], uColourPalette[2], uColourPalette[3]);

  gl_FragColor = vec4(colour, 1.0);
}