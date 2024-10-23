// Vertex shader

varying vec2 vUv;

// Perform transformations on the vertex position

void main() {
    vUv = uv;
    vec4 position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = position;
}



// varying vec3 vViewPosition;  // position in view (camera) space
// varying vec3 vWorldPosition; // position in world space

  // // Transform the vertex position to view space
    // vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    // vViewPosition = viewPosition.xyz;
    // vWorldPosition = position;
    // // Transform the vertex position to clip space
    // vec4 clipPosition = projectionMatrix * viewPosition;
    // gl_Position = clipPosition;


