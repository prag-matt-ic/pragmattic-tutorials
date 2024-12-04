'use client'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import React from 'react'

import ScrollDownArrow from '@/components/examples/ScrollDown'
import ScrollingBackgroundGradient from '@/components/examples/scrollingBackgroundGradient/ScrollingBackgroundGradient'

// Steps:
// 1. Create a fullscreen shader background using a <ScreenQuad> component
// 2. Implement a gradient using the cosine color function & presets
// 3. Add Y translation that matches the users scroll
// 4. Add noise and time to the shader
// 5. Add config controls using Leva

const SCREENS = 30

export default function ScrollingBackgroundShaderExample() {
  return (
    <main className="w-full font-sans" style={{ height: `${SCREENS * 100}vh` }}>
      <Canvas
        className="!fixed inset-0"
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: 'high-performance',
        }}>
        <ScrollingBackgroundGradient screens={SCREENS - 1} />
      </Canvas>

      {/* {new Array(SCREENS).fill(0).map((_, i) => (
        <div key={i} className="relative z-50 h-screen outline outline-2 outline-white/50" />
      ))} */}

      {/* Controls */}
      <Leva titleBar={{ position: { x: -8, y: 64 } }} />

      <ScrollDownArrow />
    </main>
  )
}
