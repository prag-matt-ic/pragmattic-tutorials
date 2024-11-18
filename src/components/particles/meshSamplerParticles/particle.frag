uniform float uTime;

void main() {
   // Color of the particle
  vec3 color = vec3(0.2667, 0.7804, 0.5333);

  // gl_PointCoord is a vec2 containing the coordinates of the fragment within the point being rendered
  vec2 normalizedPoint = gl_PointCoord - vec2(0.5);
  // Calculate the distance from the center of the point
  float dist = length(normalizedPoint);

  float circle = 1.0 - step(0.5, dist);
  float innerCircle = step(0.35, dist);

  float opacity = circle * innerCircle;

  // If inside the circle, render with the specified color and alpha
  gl_FragColor = vec4(color, opacity);
}



