'use client'
import { useViewportSize } from '@mantine/hooks'
import { ContextMode } from 'glsl-canvas-js/dist/esm/context/context'
import { Canvas, type ICanvasOptions } from 'glsl-canvas-js/dist/esm/glsl'
import { type FC, useEffect, useLayoutEffect, useRef } from 'react'
import React from 'react'

import fragmentShader from './vercel.frag'

const glsl = (x: any) => x

const vertexShader = glsl`
  attribute vec4 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position.xy;
    gl_Position = a_position;
  }
`

// TODO: use a defferred value when width changes
// TOOD: use webGL2 for better performance

const VercelCanvas: FC = () => {
  const canvas = useRef<HTMLCanvasElement>(null)
  const { width } = useViewportSize()
  const glsl = useRef<Canvas | null>(null)

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
    glsl.current = new Canvas(canvas.current, options)
  }, [canvas])

  useEffect(() => {
    if (!glsl.current) return
    glsl.current.setUniform('u_columns', width < 768 ? 8.0 : 12.0)
  }, [width])

  return <canvas ref={canvas} width={1080} height={720} className="absolute size-full overflow-hidden opacity-50" />
}

export default VercelCanvas
