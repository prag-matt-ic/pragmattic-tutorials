// Fragment shader

#pragma glslify: noise = require('glsl-noise/simplex/3d')

// TODO: GLSL Shading language - strongly typed, similar to C
// TODO: Explain the vertex and fragment shaders: https://thebookofshaders.com/01/
// TODO: Explain how these run in parallel for each texture pixel (texel) on the mesh

// Uniforms received from the JavaScript
// Uniforms will be the same value for each pixel
uniform float uTime;
uniform float uAspectRatio;
uniform float uScrollOffset;
uniform vec3 uLightColour;
uniform vec3 uDarkColour;
uniform sampler2D uTexture;

// Varyings received from the vertex shader
varying vec2 vUv;

// Convert linear RGB color to sRGB color - to make the image look as it should
vec4 linearToSRGB(in vec4 value) {
    vec3 linearRGB = value.rgb;
    vec3 sRGB = mix(
        pow(linearRGB, vec3(1.0 / 2.4)) * 1.055 - vec3(0.055),
        linearRGB * 12.92,
        vec3(lessThanEqual(linearRGB, vec3(0.0031308)))
    );
    return vec4(sRGB, value.a);
}

void main() {
  // TODO: Show the challenges of working with shaders - type safe, no logging, no debugging
  // TODO: Explain the variable types (bool, float, int, vec2, vec3, vec4)

  // TODO: Explain uv coordinates - vec2(x,y) value between 0 and 1 based on the texture pixel (texel) position
  // TODO: Create a gradient based on the uv coordinate
  // gl_FragColor = vec4(vUv.x, vUv.y, vUv.x, 1.0);

  // TODO: The mix function mixes two values, often colours:
  // vec3 colourA = vec3(0.4078, 0.0627, 0.0627);
  // vec3 colourB = vec3(0.1569, 0.0824, 0.4902);
  // vec3 mixedColour = mix(colourA, colourB, vUv.y);
  // gl_FragColor = vec4(mixedColour, 1.0);

  // TODO: Explain the step function and smoothstep function
  // vec3 colourA = vec3(0.0627, 0.4078, 0.3098);
  // vec3 colourB = vec3(0.1569, 0.0824, 0.4902);
  // // float stepValue = step(0.9, vUv.x);
  // float stepValue = smoothstep(0.2, 0.4, vUv.y);
  // vec3 finalColour = mix(colourA, colourB, stepValue);
  // gl_FragColor = vec4(finalColour, 1.0);


  // TODO: Explain the sin/cos function - it oscillates between -1 and 1
  // TODO: Create a wave effect using sin/cos and then animate it with time
  // float sinValue = sin(vUv.x * 4.0) * 0.4;
  // vec3 colourA = vec3(0.6157, 0.0471, 0.451);
  // vec3 colourB = vec3(0.098, 0.0275, 0.4157);
  // vec3 finalColour = mix(colourA, colourB, vUv.y + sinValue);
  // gl_FragColor = vec4(finalColour, 1.0);

  vec2 uv = vUv;
  uv.y -= uScrollOffset;
  uv.x += uTime * 0.05;

  float noiseValue = noise(vec3(uv.x * 2.0, uv.y * 1.2, uTime * 0.2));

  // TODO: Setup glsify to import a noise function
  // TODO: Play with noise to create a more organic effect
  // Noise value between -1 and 1
  // vec3 colourA = vec3(0.6157, 0.0471, 0.451);
  // vec3 colourB = vec3(0.098, 0.0275, 0.4157);
  vec3 noiseColour = mix(uLightColour, uDarkColour, noiseValue);
  // TODO: Passing an image texture to the shader https://www.poliigon.com/textures/free
  
  vec2 textureUv = uv;
  // Adjust for aspect ratio
  textureUv.x *= uAspectRatio;
  // add noise distortion to the texture
  textureUv.y -= noiseValue * 0.08;

  textureUv = fract(textureUv);
  vec4 textureColour = texture2D(uTexture, textureUv);
  textureColour = linearToSRGB(textureColour);

  vec4 finalColour = mix(vec4(noiseColour, 1.0), textureColour, 0.75);


  gl_FragColor = finalColour;
}