'use client'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import React, { type FC, useEffect, useRef } from 'react'
import { AdditiveBlending, Color, MathUtils, ShaderMaterial } from 'three'

import { SceneSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'

import { POINTS_POSITIONS, ROTATE_SPEEDS } from '../torusResources'
import pointsFragmentShader from './points.frag'
import pointsVertexShader from './points.vert'

const PARTICLE_COUNT = 160

const getRandomSpherePositions = (count: number): Float32Array => {
  const positions = new Float32Array(count * 3)
  const distance = 3
  // Create random positions within a sphere
  for (let i = 0; i < count; i++) {
    const theta = MathUtils.randFloatSpread(360)
    const phi = MathUtils.randFloatSpread(360)
    let x = distance * Math.sin(theta) * Math.cos(phi)
    let y = distance * Math.sin(theta) * Math.sin(phi)
    let z = distance * Math.cos(theta) + Math.random() * 0.5 - 0.25
    positions.set([x, y, z], i * 3)
  }
  return positions
}

const getColours = (count: number, activeSection: SceneSection): Float32Array => {
  const colours = new Float32Array(count)
  for (let i = 0; i < count; i++) {}
  return colours
}

const POSITIONS = getRandomSpherePositions(PARTICLE_COUNT)

type Props = {}

const PointsPlane: FC<Props> = () => {
  const pointsShaderMaterial = useRef<ShaderMaterial & Uniforms>(null)

  useEffect(() => useHomeSceneStore.subscribe((s) => {}), [])

  useFrame(({ clock }) => {
    if (!pointsShaderMaterial.current) return
    const elapsedTime = clock.elapsedTime
    pointsShaderMaterial.current.uTime = elapsedTime
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={POSITIONS} count={POSITIONS.length / 3} itemSize={3} />
        {/* Attach colour attribute */}
        {/* <bufferAttribute attach="attributes-colour" /> */}
      </bufferGeometry>
      <torusPointsShaderMaterial
        attach="material"
        ref={pointsShaderMaterial}
        key={HomePointsShaderMaterial.key}
        vertexShader={pointsVertexShader}
        fragmentShader={pointsFragmentShader}
        depthTest={false}
        transparent={true}
        blending={AdditiveBlending}
      />
    </points>
  )
}

export default PointsPlane

type Uniforms = {
  uTime: number
  uColour: Color
}

const UNIFORMS: Uniforms = {
  uTime: 0,
  uColour: new Color('#9A93A9'),
}

const HomePointsShaderMaterial = shaderMaterial(UNIFORMS, pointsVertexShader, pointsFragmentShader)

extend({ HomePointsShaderMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      homePointsShaderMaterial: ShaderMaterialProps & Partial<Uniforms>
    }
  }
}
