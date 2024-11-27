// Home Effects Fragment shader

#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uSceneTexture;
uniform sampler2D uDepthTexture;
uniform float uFar;
uniform float uNear;

varying vec2 vUv;

  // #2E2A37
  const vec4 MID = vec4(0.18, 0.16, 0.22, 1.0);
  // #2E2245
 const vec4 PURPLE = vec4(0.18, 0.13, 0.27, 1.0); 
  // #1E1B23
 const vec4 OFF_BLACK = vec4(0.12, 0.11, 0.13, 1.0);
  // #0A090C
const  vec4 BLACK = vec4(0.04, 0.04, 0.05, 1.0);
  // #0E5D3A
 const vec4 GREEN = vec4(0.05, 0.36, 0.23, 1.0);
  // #228AA6
 const vec4 BLUE = vec4(0.13, 0.54, 0.65, 1.0);


void main() {
  vec4 sceneColour = texture2D(uSceneTexture, vUv);


  
  // --- DEPTH EFFECTS ---

  // Sample the depth value from the depth texture at the current UV coordinate
  // The depth texture stores depth values in a non-linear way due to perspective projection
  // Depth values range from 0.0 (near plane) to 1.0 (far plane)
  float depthValue = texture2D(uDepthTexture, vUv).r;
  // Convert the depth value to Normalized Device Coordinates (NDC)
  // NDC depth ranges from -1.0 (near plane) to 1.0 (far plane)
  float z_ndc = depthValue * 2.0 - 1.0;
  // Reconstruct the linear view-space depth from the NDC depth value
  // This gives the actual distance from the camera to the fragment
  float linearDepth = (2.0 * uNear * uFar) / (uFar + uNear - z_ndc * (uFar - uNear));
  // Normalize the linear depth to a value between 0.0 and 1.0
  // 0.0 corresponds to the near plane, and 1.0 corresponds to the far plane
  float depthRatio = (linearDepth - uNear) / (uFar - uNear);
  // Define the range over which to start fading to black
  // Fade starts at 80% of the distance to the far plane and ends at the far plane
  float fadeStart = 0.5; // Start fading at 80% of the way to the far plane
  float fadeEnd = 0.8;   // Fully faded at the far plane

  // Compute the fade factor using smoothstep for a smooth transition
  float depthFade = smoothstep(fadeStart, fadeEnd, depthRatio);


  // -- BACKGROUND COLOUR --
  float timeA = uTime * 0.2;
  float timeB = uTime * 0.4;
        
  // Normalized noise values with different uv scales
  float noiseA = noise(vec3(vUv * 0.6, timeA));
  float noiseB = noise(vec3(vUv * 1.2, timeB));
  vec4 colourA = mix(mix(MID, OFF_BLACK, noiseA), BLACK, noiseB);
    
    
  // -- FINAL COLOUR --
  // Fade the final color to black based on the depthFade value
  vec4 finalColour = mix(sceneColour, colourA, depthFade);

  // // create a vignette
  vec2 center = vec2(0.5, 0.5);
  float vignette = distance(center, vUv);
  vignette = smoothstep(0.2, 0.8, vignette);
  finalColour = mix(finalColour, BLACK, vignette);


  gl_FragColor = finalColour;
}