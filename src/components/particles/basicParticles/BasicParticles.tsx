'use client'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import React, { type FC, useMemo, useRef } from 'react'
import { AdditiveBlending, Color, ShaderMaterial } from 'three'

import { getRandomSpherePositions } from '@/utils/particles/particles'

import particleFragment from './particle.frag'
import particleVertex from './particle.vert'

const BasicParticles: FC = () => {
  const particlesCount = 512
  const particlesPosition: Float32Array = useMemo(() => getRandomSpherePositions(particlesCount), [particlesCount])
  const particlesShader = useRef<ShaderMaterial & Uniforms>(null)

  useFrame(({ clock }) => {
    if (!particlesShader.current) return
    particlesShader.current.uTime = clock.elapsedTime
  })

  return (
    <points>
      {/* Basic setup with predefined geometry and material */}
      <sphereGeometry attach="geometry" args={[2, 48, 48]} />

      <pointsMaterial
        attach="material"
        color={new Color('#45F1A6')}
        size={0.03}
        sizeAttenuation={true}
        blending={AdditiveBlending}
      />

      {/* <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={particlesPosition}
          count={particlesPosition.length / 3}
          itemSize={3}
        />
      </bufferGeometry> */}
      {/* 
      <basicParticleShaderMaterial
        key={BasicParticleShaderMaterial.key}
        ref={particlesShader}
        uTime={0}
        depthTest={false}
        transparent={true}
        blending={AdditiveBlending}
      /> */}
    </points>
  )
}

type Uniforms = {
  uTime: number
}

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
} as const

const BasicParticleShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, particleVertex, particleFragment)

extend({ BasicParticleShaderMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      basicParticleShaderMaterial: ShaderMaterialProps & Uniforms
    }
  }
}

export default BasicParticles
