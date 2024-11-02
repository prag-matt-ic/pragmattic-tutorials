'use client'
import { useGSAP } from '@gsap/react'
import { OrthographicCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, { type FC } from 'react'

import EffectsCanvas from '@/components/fboEffectShader/FBOEffects'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function PlayPage() {
  return (
    <main className="h-[200vh] w-full bg-black font-sans">
      <EffectsCanvas />
    </main>
  )
}
