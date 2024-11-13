uniform float uTime;

varying vec3 vPosition;
varying vec3 vViewPosition;

void main() {

  vec3 particlePosition = position;
  
  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

    // Attenuation factor - the further away the particle is from the camera, the smaller it will be
  float attenuationFactor = (1.0 / projectedPosition.z);

  vPosition = particlePosition;
  vViewPosition = viewPosition.xyz;

  gl_Position = projectedPosition;
  gl_PointSize = 128.0;
  gl_PointSize *= attenuationFactor;
}