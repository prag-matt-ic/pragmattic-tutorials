// Torus Points Vertex shader
#pragma glslify: easeElastic = require('glsl-easings/elastic-out') 

attribute vec3 colour;

varying vec3 vColour;

const float MIN_PT_SIZE = 6.0;
const float MAX_PT_SIZE = 48.0;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    float attenuationFactor = 1.0 / projectedPosition.z;
    float pointSize = clamp(MIN_PT_SIZE, MAX_PT_SIZE, MAX_PT_SIZE * attenuationFactor);

    vColour = colour;

    gl_Position = projectedPosition;
    gl_PointSize = pointSize;
    
}
