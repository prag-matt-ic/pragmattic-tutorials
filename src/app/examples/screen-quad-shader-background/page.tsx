'use client'
import { Stats } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import React from 'react'

import ScreenQuadShader from '@/components/examples/screenQuadShader/ScreenQuadShader'
import ScrollDownArrow from '@/components/ScrollDown'

const SCREENS = 10

// Tasks

// 1. Create a fullscreen shader background using a screen quad
// 2. Implement a gradient shader that animates over time
// 3. Implement a texture shader that animates over time
// 4. Add scroll based uniform
// 4. Add config controls

export default function ScreenQuadBoilerPlate() {
  return (
    <main className="w-full font-sans" style={{ height: `${SCREENS * 100}vh` }}>
      <Canvas
        className="!fixed inset-0"
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: 'high-performance',
        }}>
        <ScreenQuadShader screens={SCREENS} />
        {/* <Stats /> */}
      </Canvas>

      <ScrollDownArrow />

      {/* Controls */}
      <Leva titleBar={{ position: { x: -8, y: 64 } }} />
    </main>
  )
}
