'use client'
import { Torus } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import React, { type FC, useEffect, useRef } from 'react'
import { BufferGeometry, Color, Mesh, MeshLambertMaterial, type NormalBufferAttributes, ShaderMaterial } from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'

import { ROTATE_SPEEDS, TORUS_ARGS, useTorusRotate } from '@/components/home/main/torusResources'
import { SceneSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'
import { GREEN_VEC3, POINT_VEC3, SECTION_COLOURS } from '@/resources/colours'

import fragmentShader from './torus.frag'
import vertexShader from './torus.vert'

type Props = {
  section: SceneSection
}

const SectionTorus: FC<Props> = ({ section }) => {
  const torusMesh = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)
  const shaderMaterial = useRef<ShaderMaterial & UniformValues>(null)

  const isActive = useRef<boolean>(false)
  const activeProgress = useRef({ value: 0 })
  const progressTween = useRef<gsap.core.Tween>()

  const { angle, rotateFast, rotateNormal } = useTorusRotate(section)

  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      useHomeSceneStore.subscribe((s) => {
        isActive.current = s.activeSection === section
        if (isActive.current) {
          if (activeProgress.current.value === 1) return
          progressTween.current?.kill()
          progressTween.current = gsap.to(activeProgress.current, {
            duration: 1.2,
            delay: 0.3,
            ease: 'power2.in',
            value: 1,
          })
          rotateFast()
        } else {
          if (activeProgress.current.value === 0) return
          progressTween.current?.kill()
          progressTween.current = gsap.to(activeProgress.current, { duration: 0.7, ease: 'power1.out', value: 0 })
          rotateNormal()
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [section],
  )

  useFrame(({ clock }) => {
    if (!shaderMaterial.current || !angle.current) return
    const elapsedTime = clock.elapsedTime
    shaderMaterial.current.uniforms.uTime.value = elapsedTime
    shaderMaterial.current.uniforms.uActiveProgress.value = activeProgress.current.value
    shaderMaterial.current.uniforms.uIsActive.value = isActive.current
    shaderMaterial.current.uniforms.uRotateAngle.value = angle.current.value
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
  uRotateAngle: {
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
  uRotateAngle: { value: 0 },
  uIsActive: { value: false },
  uColour: { value: POINT_VEC3 },
  uActiveColour: { value: GREEN_VEC3 },
  uActiveProgress: { value: 0 },
  uRadius: { value: TORUS_ARGS.purpose[0] },
  uTube: { value: TORUS_ARGS.purpose[1] },
}

const DESIGN_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateAngle: { value: 0 },
  uIsActive: { value: false },
  uColour: { value: POINT_VEC3 },
  uActiveColour: { value: SECTION_COLOURS[SceneSection.Design] },
  uActiveProgress: { value: 0 },
  uRadius: { value: TORUS_ARGS.design[0] },
  uTube: { value: TORUS_ARGS.design[1] },
}

const ENGINEERING_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateAngle: { value: 0 },
  uIsActive: { value: false },
  uColour: { value: POINT_VEC3 },
  uActiveColour: { value: SECTION_COLOURS[SceneSection.Engineering] },
  uActiveProgress: { value: 0 },
  uRadius: { value: TORUS_ARGS.engineering[0] },
  uTube: { value: TORUS_ARGS.engineering[1] },
}

const SHADER_UNIFORMS: Record<SceneSection, UniformValues> = {
  [SceneSection.Purpose]: PURPOSE_UNIFORMS,
  [SceneSection.Design]: DESIGN_UNIFORMS,
  [SceneSection.Engineering]: ENGINEERING_UNIFORMS,
}
