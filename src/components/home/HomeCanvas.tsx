'use client'
import { useGSAP } from '@gsap/react'
import { PerformanceMonitor, type PerformanceMonitorApi } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import SplitText from 'gsap/dist/SplitText'
import React, { type FC, useState } from 'react'

import PointerCamera from '@/components/PointerCamera'

import HomeBackgroundPlane from './background/HomeBackgroundPlane'
import HomeMain from './main/HomeMain'

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

const MIN_DPR = 0.8 as const

const HomeCanvas: FC = () => {
  const [dpr, setDpr] = useState(1.6)

  const onPerformanceInline = (api: PerformanceMonitorApi) => {
    if (dpr < window.devicePixelRatio) setDpr((prev) => prev + 0.2)
  }

  const onPerformanceDecline = (api: PerformanceMonitorApi) => {
    if (dpr > MIN_DPR) setDpr((prev) => prev - 0.2)
  }

  return (
    <Canvas
      className="!fixed inset-0"
      dpr={dpr}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
      }}>
      <PerformanceMonitor
        onIncline={onPerformanceInline}
        onDecline={onPerformanceDecline}
        onFallback={onPerformanceDecline}
        flipflops={4}
      />
      <ambientLight intensity={1} />
      <PointerCamera cameraProps={{ far: 25, position: [0, 0, 5] }} intensity={0.04} />
      <HomeBackgroundPlane />
      <HomeMain />
    </Canvas>
  )
}

export default HomeCanvas
