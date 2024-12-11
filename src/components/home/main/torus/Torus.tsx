'use client'
import { Torus } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import React, { type FC, useEffect, useRef } from 'react'
import { BufferGeometry, Color, Mesh, MeshLambertMaterial, type NormalBufferAttributes, ShaderMaterial } from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'

import { SceneSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'
import { CYAN_VEC3, GREEN_VEC3, LIGHT_VEC3, ORANGE_VEC3 } from '@/resources/colours'

import { ROTATE_SPEEDS, TORUS_ARGS } from '../torusResources'
import fragmentShader from './torus.frag'
import vertexShader from './torus.vert'

type Props = {
  section: SceneSection
}

const SectionTorus: FC<Props> = ({ section }) => {
  const torusMesh = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)
  const shaderMaterial = useRef<ShaderMaterial>(null)

  const isActive = useRef<boolean>(false)
  const activeProgress = useRef({ value: 0 })
  const activeTween = useRef<gsap.core.Tween>()

  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      useHomeSceneStore.subscribe((s) => {
        isActive.current = s.allAreActive || s.activeSection === section
        if (isActive.current) {
          if (activeProgress.current.value === 1) return
          activeTween.current?.kill()
          activeTween.current = gsap.to(activeProgress.current, {
            duration: 1.2,
            delay: 0.3,
            ease: 'power2.in',
            value: 1,
          })
        } else {
          if (activeProgress.current.value === 0) return
          activeTween.current?.kill()
          activeTween.current = gsap.to(activeProgress.current, { duration: 0.7, ease: 'power1.out', value: 0 })
        }
      }),
    [section],
  )

  useFrame(({ clock }) => {
    if (!shaderMaterial.current) return
    const elapsedTime = clock.elapsedTime
    shaderMaterial.current.uniforms.uTime.value = elapsedTime
    shaderMaterial.current.uniforms.uActiveProgress.value = activeProgress.current.value
    shaderMaterial.current.uniforms.uIsActive.value = isActive.current
  })

  return (
    <Torus ref={torusMesh} args={TORUS_ARGS[section]}>
      <CustomShaderMaterial
        ref={shaderMaterial}
        baseMaterial={MeshLambertMaterial}
        transparent={true}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={SHADER_UNIFORMS[section]}
      />
    </Torus>
  )
}

export default SectionTorus

type UniformValues = {
  uTime: {
    value: number
  }
  uRotateSpeed: {
    value: number
  }
  uIsActive: {
    value: boolean
  }
  uColour: {
    value: Color
  }
  uActiveColour: {
    value: Color
  }
  uActiveProgress: {
    value: number
  }
  uRadius: {
    value: number
  }
  uTube: {
    value: number
  }
}

const PURPOSE_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateSpeed: { value: ROTATE_SPEEDS.purpose },
  uIsActive: { value: false },
  uColour: { value: new Color('#BDB8C6') },
  uActiveColour: { value: GREEN_VEC3 },
  uActiveProgress: { value: 0 },
  uRadius: { value: TORUS_ARGS.purpose[0] },
  uTube: { value: TORUS_ARGS.purpose[1] },
}

const DESIGN_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateSpeed: { value: ROTATE_SPEEDS.design },
  uIsActive: { value: false },
  uColour: { value: new Color('#9A93A9') },
  uActiveColour: { value: ORANGE_VEC3 },
  uActiveProgress: { value: 0 },
  uRadius: { value: TORUS_ARGS.design[0] },
  uTube: { value: TORUS_ARGS.design[1] },
}

const ENGINEERING_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateSpeed: { value: ROTATE_SPEEDS[SceneSection.Engineering] },
  uIsActive: { value: false },
  uColour: { value: LIGHT_VEC3 },
  uActiveColour: { value: CYAN_VEC3 },
  uActiveProgress: { value: 0 },
  uRadius: { value: TORUS_ARGS.engineering[0] },
  uTube: { value: TORUS_ARGS.engineering[1] },
}

const SHADER_UNIFORMS: Record<SceneSection, UniformValues> = {
  [SceneSection.Purpose]: PURPOSE_UNIFORMS,
  [SceneSection.Design]: DESIGN_UNIFORMS,
  [SceneSection.Engineering]: ENGINEERING_UNIFORMS,
}
