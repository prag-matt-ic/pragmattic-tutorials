// Torus Points Vertex shader
#pragma glslify: easeElastic = require('glsl-easings/elastic-out') 

uniform float uTime;

const float MIN_PT_SIZE = 4.0;
const float MAX_PT_SIZE = 64.0;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    float attenuationFactor = 1.0 / projectedPosition.z;
    float pointSize = clamp(MIN_PT_SIZE, MAX_PT_SIZE, MAX_PT_SIZE * attenuationFactor);

    gl_Position = projectedPosition;
    gl_PointSize = pointSize;
    
}
