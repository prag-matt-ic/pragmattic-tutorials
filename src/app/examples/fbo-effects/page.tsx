'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React from 'react'

import EffectsCanvas from '@/components/examples/fboEffectShader/FBOEffects'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function FBOEffectsBasic() {
  return (
    <main className="h-[200vh] w-full bg-black font-sans">
      <EffectsCanvas />
    </main>
  )
}
