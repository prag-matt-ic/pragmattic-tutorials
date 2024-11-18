#pragma glslify: rotation3dZ = require(glsl-rotate/rotation-3d-z)
#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform float uTime;
uniform float uScrollProgress;

varying vec3 vPosition;
varying vec3 vViewPosition;

const float MIN_POINT_SIZE = 0.5;
const float MAX_POINT_SIZE = 64.0;

void main() {
  vec3 particlePosition = position;

  // Move the particles up and down based on the time
  // Generate a noise value based on the particle's position and time
  // float noiseValue = noise(vec3(particlePosition.xy * 10.0 * particlePosition.z, uTime * 4.0)) * 0.01;
  // Adjust the position based on the noise value
  // particlePosition.xy += noiseValue;

  // Move the particle forward based on the scroll progress
  particlePosition.z -= uScrollProgress * 3.0;
  // Rotate the particle based on its z position and the scroll progress to create spiral effect
  particlePosition *= rotation3dZ(-position.z * uScrollProgress * 0.4);
  
  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  // Assign the varying values
  vPosition = particlePosition;
  vViewPosition = viewPosition.xyz;

  // Attenuation factor - further away the particle is from the camera, the smaller it will be
  float attenuationFactor = (1.0 / projectedPosition.z);

  // Point size is required for point rendering
  float pointSize = clamp(MIN_POINT_SIZE, MAX_POINT_SIZE, MAX_POINT_SIZE * attenuationFactor);
  
  gl_PointSize = pointSize;
  gl_Position = projectedPosition;
}