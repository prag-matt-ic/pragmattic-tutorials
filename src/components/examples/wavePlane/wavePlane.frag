// Fragment shader

#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uScrollOffset;

// Config
uniform vec3 uColourPalette[4];

// Grid
uniform bool uShowGrid;
uniform float uGridSize;

// Received from the vertex shader
varying vec2 vUv; 
varying float vTerrainHeight; 

// Constants
const float LINE_THICKNESS = 0.016;
const vec4 SCENE_COLOR = vec4(0.0, 0.0, 0.0, 1.0);

// Colour palette values taken from: http://dev.thi.ng/gradients/
vec3 cosineGradientColor(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d) {
  return clamp(a + b * cos(6.28318 * (c * t + d)), 0.0, 1.0);
}

float brightenValue(in float colour) {
  return clamp(colour + 0.2, 0.0, 1.0);
}

void main() {
  // Places [0, 0] in the center
  vec2 uv = vUv; 

  // Colour the surface
  vec3 colour = cosineGradientColor(vTerrainHeight, uColourPalette[0], uColourPalette[1], uColourPalette[2], uColourPalette[3]);
  vec4 surfaceColor = vec4(colour, 1.0);
  vec4 finalColor = surfaceColor;

  if (uShowGrid && uGridSize > 0.0) {
    // Draw thin horizontal lines
    // Move the lines by adding the scroll offset
    float yOffset = uScrollOffset * 4.0;
    float linePosY = mod(uv.y * uGridSize + yOffset, 1.);
    float lineAlphaY = 1.0 - step(LINE_THICKNESS, linePosY);
    // Draw thin vertical lines
    float linePosX = mod(uv.x * uGridSize, 1.);
    float lineAlphaX = 1.0 - step(LINE_THICKNESS, linePosX);
    float lineAlpha = max(lineAlphaY, lineAlphaX);
    vec4 lineColor = vec4(brightenValue(colour.r), brightenValue(colour.g), brightenValue(colour.b), lineAlpha);
    finalColor = mix(surfaceColor, lineColor, lineAlpha);
  }

  // Fade out towards the edges
  float distanceToCenter = distance(vUv, vec2(0.5));
  float fogAmount = smoothstep(0.4, 0.5, distanceToCenter);

  finalColor = mix(finalColor, SCENE_COLOR, fogAmount);

  gl_FragColor = finalColor;
}







  //  // // Create a circle around the center fading out towards the edges - needed because it rotates
  // float distanceToCenter = distance(uv, vec2(0.0));
  // // Fade the line alpha out towards the edges
  // lineAlpha *= 1.0 - clamp(smoothstep(0.1, 0.7, distanceToCenter), 0.2, 1.0);

  // vec3 surfaceColor = mix(BG_COLOR, LINE_COLOUR, lineAlpha);





  // Fade out around the edges
  // Create a circle around the center fading out towards the edges - needed because it rotates
  // float fogAmount = smoothstep(0.3, 0.99, distanceToCenter);

  // vec4 finalColor = mix(vec4(SURFACE_COLOR, 1.0), vec4(BG_COLOR, 0.0), fogAmount);