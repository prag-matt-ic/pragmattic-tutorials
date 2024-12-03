'use client'
import { useGSAP } from '@gsap/react'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { Leva } from 'leva'

import WavePlane from '@/components/examples/wavePlane/WavePlane'
import PointerCamera from '@/components/PointerCamera'
import ScrollDownArrow from '@/components/examples/ScrollDown'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function WavePlaneExample() {
  return (
    <main className="h-[2000vh] w-full">
      <Canvas
        className="!fixed inset-0"
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: 'high-performance',
        }}>
        <color attach="background" args={['#000']} />
        <WavePlane screenHeights={20 - 1} />
        <PointerCamera />
      </Canvas>

      <ScrollDownArrow />

      {/* Controls */}
      <Leva titleBar={{ position: { x: -8, y: 64 } }} />
    </main>
  )
}
