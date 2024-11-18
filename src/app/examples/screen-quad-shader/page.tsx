'use client'

import { Canvas } from '@react-three/fiber'
import React from 'react'

import ScreenQuadShader from '@/components/screenQuadShader/ScreenQuadShader'

export default function ScreenQuadBoilerPlate() {
  return (
    <main className="h-lvh w-full font-sans">
      <Canvas
        className="!fixed inset-0"
        gl={{
          alpha: false,
          antialias: false,
        }}>
        <ScreenQuadShader />
      </Canvas>

      <header className="relative z-20 flex size-full select-none items-center justify-center px-20">
        <h1 className="text-center text-6xl font-black uppercase tracking-tight text-white">
          SCREENQUAD SHADER BACKGROUND
        </h1>
      </header>
    </main>
  )
}
