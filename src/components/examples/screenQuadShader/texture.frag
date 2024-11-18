// screen.frag
// Fragment shader

uniform sampler2D uTexture;
uniform float uTime;
uniform float uAspect;

varying vec2 vUv;

void main() {

  // Sample the texture colour
  vec2 textureUv = vUv * 2.0; // Scale the uv (optional)
  textureUv.x *= uAspect; // Correct aspect ratio
  textureUv.x -= uTime * 0.1; // Move the texture
  textureUv = fract(textureUv); // Repeat the texture
  vec4 textureColour = texture2D(uTexture, textureUv);

  // Add a vignette effect
  vec3 vignetteColour = vec3(0.0078, 0.0039, 0.0);
  float vignette = 1.0 - distance(vUv, vec2(0.5));
  vec3 finalColour = mix(vignetteColour, textureColour.rgb, vignette);

  gl_FragColor = vec4(finalColour, 1.0);
}