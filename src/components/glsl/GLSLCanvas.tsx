'use client'
import { ContextMode } from 'glsl-canvas-js/dist/esm/context/context'
import { Canvas, type ICanvasOptions } from 'glsl-canvas-js/dist/esm/glsl'
import { type FC, useLayoutEffect, useRef } from 'react'
import React from 'react'

const glsl = (x: any) => x

const vertexShader = glsl`
  attribute vec4 a_position;

  varying vec2 v_uv;

  void main() {
    v_uv = a_position.xy;
    gl_Position = a_position;
  }
`

const fragmentShader = glsl`
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform vec2 u_resolution;
    uniform float u_time;

    varying vec2 v_uv;

    // Simplex 2D noise from https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
            dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    // --gradientColorZero: #a960ee;
    // --gradientColorOne: #ff333d;
    // --gradientColorTwo: #90e0ff;
    // --gradientColorThree: #ffcb57;
    const vec4 COLOUR_PURPLE = vec4(169.0, 96.0, 238.0, 1.0) / 255.0;
    const vec4 COLOUR_PEACH = vec4(255.0, 51.0, 61.0, 1.0) / 255.0;
    const vec4 COLOUR_BLUE = vec4(144.0, 224.0, 255.0, 1.0) / 255.0;
    const vec4 COLOUR_YELLOW = vec4(255.0, 203.0, 87.0, 1.0) / 255.0;

    void main() {
        float timeA = u_time * 0.1;
        float timeB = u_time * 0.2;
        float timeC = u_time * 0.3;
        
        float noiseA = snoise(v_uv * 0.8 + timeA) * 0.5 + 0.5;
        float noiseB = snoise(v_uv * 0.5 - timeB) * 0.5 + 0.5;
        float noiseC = snoise(v_uv * 1.2 + timeC) * 0.5 + 0.5;

        // Creates 2 layers for above and below the wave
        vec4 colourA = mix(mix(COLOUR_YELLOW, COLOUR_PURPLE, noiseA), COLOUR_BLUE, noiseC);
        vec4 colourB = mix(mix(COLOUR_BLUE, COLOUR_YELLOW, noiseC), COLOUR_PEACH, noiseB);

        // Mix the 2 colours using a wave pattern
        float mixWave = sin((v_uv.x * 4.0) + u_time * 0.25) + (v_uv.y + noiseB * 0.5 + 1.0);
        float maxStep = clamp(noiseA - 0.15 * 1.1, 0.0, 1.0);
        mixWave = smoothstep(0.0, maxStep, mixWave - noiseB * 0.2);

        vec4 finalColor = mix(colourA, colourB, mixWave);

        // vec4 finalColor = mix(vec4(1.0), vec4(0.0), mixWave);

        gl_FragColor = finalColor;
    }
`

// TODO: make generic and reusable
const GLSLCanvas: FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    if (!canvas.current) return
    // https://actarian.github.io/glsl-canvas/api/
    const options: ICanvasOptions = {
      vertexString: vertexShader,
      fragmentString: fragmentShader,
      alpha: false,
      depth: false,
      antialias: true,
      mode: ContextMode.Flat,
    }
    const glsl = new Canvas(canvas.current, options)
  }, [canvas])

  return (
    <canvas
      ref={canvas}
      width={1200}
      height={640}
      className="absolute left-0 right-0 top-0 h-[640px] w-full overflow-hidden"
      style={{ transform: 'translateY(-33%) skewY(-12deg)' }}
    />
  )
}

export default GLSLCanvas
