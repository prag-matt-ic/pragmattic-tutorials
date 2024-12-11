'use client'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import React, { type FC, useEffect, useRef } from 'react'
import { AdditiveBlending, Color, ShaderMaterial } from 'three'

import { SceneSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'
import { POINT_VEC3 } from '@/resources/colours'

import { POINTS_POSITIONS, ROTATE_SPEEDS } from '../torusResources'
import pointsFragmentShader from './torusPoints.frag'
import pointsVertexShader from './torusPoints.vert'

type TorusPointsProps = {
  section: SceneSection
  getScrollProgress: () => number
}

const TorusPoints: FC<TorusPointsProps> = ({ section, getScrollProgress }) => {
  const pointsShaderMaterial = useRef<ShaderMaterial & PointsUniforms>(null)
  const isActive = useRef<boolean>(false)
  const activeProgress = useRef({ value: 0 })
  const activeTween = useRef<gsap.core.Tween>()

  useEffect(
    () =>
      useHomeSceneStore.subscribe((s) => {
        isActive.current = s.allAreActive || s.activeSection === section
        if (isActive.current) {
          if (activeProgress.current.value === 1) return
          activeTween.current?.kill()
          activeTween.current = gsap.to(activeProgress.current, { duration: 1.2, ease: 'power2.out', value: 1 })
        } else {
          if (activeProgress.current.value === 0) return
          activeTween.current?.kill()
          activeTween.current = gsap.to(activeProgress.current, {
            duration: 2,
            ease: 'power1.out',
            value: 0,
            delay: 0.2,
          })
        }
      }),
    [section],
  )

  useFrame(({ clock }) => {
    if (!pointsShaderMaterial.current) return
    const elapsedTime = clock.elapsedTime
    pointsShaderMaterial.current.uTime = elapsedTime
    pointsShaderMaterial.current.uScrollProgress = getScrollProgress()
    pointsShaderMaterial.current.uActiveProgress = activeProgress.current.value
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={POINTS_POSITIONS[section].activePositions}
          count={POINTS_POSITIONS[section].activePositions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-inactivePosition"
          array={POINTS_POSITIONS[section].inactivePositions}
          count={POINTS_POSITIONS[section].inactivePositions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-scatteredPosition"
          array={POINTS_POSITIONS[section].scatteredPositions}
          count={POINTS_POSITIONS[section].scatteredPositions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <torusPointsShaderMaterial
        attach="material"
        ref={pointsShaderMaterial}
        key={TorusPointsShaderMaterial.key}
        vertexShader={pointsVertexShader}
        fragmentShader={pointsFragmentShader}
        depthTest={false}
        transparent={true}
        uRotateSpeed={ROTATE_SPEEDS[section]}
        blending={AdditiveBlending}
      />
    </points>
  )
}

export default TorusPoints

type PointsUniforms = {
  uTime: number
  uRotateSpeed: number
  uColour: Color
  uScrollProgress: number
  uActiveProgress: number
}

const POINTS_UNIFORMS: PointsUniforms = {
  uTime: 0,
  uRotateSpeed: 0.3,
  uColour: POINT_VEC3,
  uScrollProgress: 0,
  uActiveProgress: 0,
}

const TorusPointsShaderMaterial = shaderMaterial(POINTS_UNIFORMS, pointsVertexShader, pointsFragmentShader)

extend({ TorusPointsShaderMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      torusPointsShaderMaterial: ShaderMaterialProps & Partial<PointsUniforms>
    }
  }
}
