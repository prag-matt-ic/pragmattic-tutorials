'use client'
import { Plane } from '@react-three/drei'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import React, { type FC, useRef } from 'react'
import { ShaderMaterial } from 'three'

import { useHomeSceneStore } from '@/hooks/home/useHomeStore'

import bgFragment from './background.frag'
import bgVertex from './background.vert'

type Uniforms = {
  uTime: number
  uAspect: number
}

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uAspect: 1,
}

const HomeBackgroundShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, bgVertex, bgFragment)

extend({ HomeBackgroundShaderMaterial })

const HomeBackgroundPlane: FC = () => {
  const { viewport } = useThree()
  const shader = useRef<ShaderMaterial & Partial<Uniforms>>(null)
  const activeSection = useHomeSceneStore((s) => s.activeSection)

  // TODO: do something with the colours based on the active section

  useFrame(({ clock }) => {
    if (!shader.current) return
    shader.current.uTime = clock.elapsedTime
  })

  return (
    <Plane args={[viewport.width * 5, viewport.height * 5, 1, 1]} position={[0, 0, -15]}>
      <homeBackgroundShaderMaterial
        key={HomeBackgroundShaderMaterial.key}
        ref={shader}
        uTime={0}
        uAspect={viewport.aspect}
      />
    </Plane>
  )
}

export default HomeBackgroundPlane

declare global {
  namespace JSX {
    interface IntrinsicElements {
      homeBackgroundShaderMaterial: ShaderMaterialProps & Uniforms
    }
  }
}
