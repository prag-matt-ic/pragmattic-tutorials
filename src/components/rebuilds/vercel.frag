// Vercel Header Fragment shader
#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: noise = require('glsl-noise/simplex/3d')

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_columns;

varying vec2 v_uv;

const vec3 BG_COLOUR = vec3(0.0, 0.0, 0.0);
const vec3 NOISE_COLOUR = vec3(0.5, 0.5, 0.5);

const vec3 WAVE_A_COLOUR = vec3(0.5, 0.5, 0.5);
const vec3 WAVE_B_COLOUR = vec3(0.7, 0.7, 0.7);

void main() {
    // Create a grain effect (high frequency noise)
    float noiseValue = noise(vec3(v_uv * 160.0, 1.0));
    vec3 noiseColour = mix(BG_COLOUR, NOISE_COLOUR, noiseValue);

    // Initialise the final colour
    vec3 finalColour = BG_COLOUR;

    // Divide into 12 columns and offset them each randomly
    float column = floor(abs(v_uv.x) * u_columns / 2.0);

    // Loop through the columns
    for (float i = 0.0; i < 12.0; i++) {
        // return out if less than u_columns
        if (i > u_columns) break;
    
        vec2 columnUV = v_uv;
        // Create a random UV offset for each column using noise
        float offset = noise(vec3(i * 2.0, i * 0.5, i));
        columnUV.x -= offset;
        float wave = sin(columnUV.x * 12.0 + u_time * 2.0 + i);
        // Create a gradient effect
        vec3 waveColour = mix(WAVE_A_COLOUR, WAVE_B_COLOUR, wave);
        finalColour = mix(finalColour, waveColour, step(i, column));
    }

    // Mix the final colour with the noise (15%)
    finalColour = mix(finalColour, noiseColour, 0.15); 

    gl_FragColor = vec4(finalColour, 1.0);
}