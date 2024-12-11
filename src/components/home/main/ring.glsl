float getRingAlpha(in vec2 coord) { 
    float dist = length(coord);
    float innerAlpha = step(0.2, dist) * 0.5;
    float outerAlpha = 1.0 - smoothstep(0.3, 0.5, dist);
    float circleAlpha = innerAlpha * outerAlpha;
    return circleAlpha;
}

#pragma glslify: export(getRingAlpha)