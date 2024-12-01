'use client'
import { useGSAP } from '@gsap/react'
import { Billboard, shaderMaterial, Torus } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import React, { type FC, useEffect, useRef } from 'react'
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Group,
  Mesh,
  MeshLambertMaterial,
  NormalBufferAttributes,
  PointLight,
  ShaderMaterial,
} from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'

import { SceneSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'
import { CYAN_VEC3, GREEN_VEC3, LIGHT_VEC3, ORANGE_VEC3 } from '@/resources/colours'

import SkillPill from '../SkillPill'
import fragmentShader from './torus.frag'
import vertexShader from './torus.vert'
import pointsFragmentShader from './torusPoints.frag'
import pointsVertexShader from './torusPoints.vert'

type UniformValues = {
  [key: string]: {
    value: any
  }
}

const PURPOSE_TORUS_RADIUS = 0.5 as const
const PURPOSE_TORUS_TUBE = 0.1 as const
const PURPOSE_ROTATE_SPEED = 0.4 as const

const PURPOSE_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateSpeed: { value: PURPOSE_ROTATE_SPEED },
  uIsActive: { value: false },
  uColour: { value: new Color('#BDB8C6') },
  uActiveColour: { value: GREEN_VEC3 },
  uTransitionStartTime: { value: 0 },
  uRadius: { value: PURPOSE_TORUS_RADIUS },
  uTube: { value: PURPOSE_TORUS_TUBE },
}

const DESIGN_TORUS_RADIUS = 0.9 as const
const DESIGN_TORUS_TUBE = 0.1 as const
const DESIGN_ROTATE_SPEED = 0.3 as const

const DESIGN_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateSpeed: { value: DESIGN_ROTATE_SPEED },
  uIsActive: { value: false },
  uColour: { value: new Color('#9A93A9') },
  uActiveColour: { value: ORANGE_VEC3 },
  uTransitionStartTime: { value: 0 },
  uRadius: { value: DESIGN_TORUS_RADIUS },
  uTube: { value: DESIGN_TORUS_TUBE },
}

const ENGINEERING_TORUS_RADIUS = 1.3 as const
const ENGINEERING_TORUS_TUBE = 0.1 as const
const ENGINEERING_ROTATE_SPEED = 0.2 as const

const ENGINEERING_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateSpeed: { value: ENGINEERING_ROTATE_SPEED },
  uIsActive: { value: false },
  uColour: { value: LIGHT_VEC3 },
  uActiveColour: { value: CYAN_VEC3 },
  uTransitionStartTime: { value: 0 },
  uRadius: { value: ENGINEERING_TORUS_RADIUS },
  uTube: { value: ENGINEERING_TORUS_TUBE },
}

const LIGHT_INTENSITY: Record<SceneSection, number> = {
  [SceneSection.Purpose]: 0.8,
  [SceneSection.Design]: 1.4,
  [SceneSection.Engineering]: 2.4,
}

const Rings: FC = () => {
  const group = useRef<Group>(null)

  const purposeTorus = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)
  const designTorus = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)
  const engineeringTorus = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)

  const pointLight = useRef<PointLight>(null)
  const purposeTorusShader = useRef<ShaderMaterial>(null)
  const designTorusShader = useRef<ShaderMaterial>(null)
  const engineeringTorusShader = useRef<ShaderMaterial>(null)

  const purposePointsShader = useRef<ShaderMaterial & PointsUniforms>(null)
  const designPointsShader = useRef<ShaderMaterial & PointsUniforms>(null)
  const engineeringPointsShader = useRef<ShaderMaterial & PointsUniforms>(null)

  const setHasScrolledIntoView = useHomeSceneStore((s) => s.setHasScrolledIntoView)

  // https://github.com/pmndrs/zustand?tab=readme-ov-file#transient-updates-for-often-occurring-state-changes
  const colourChangeStartTime = useRef<number>(1)
  const activeSection = useRef<SceneSection | null>(null)
  const previousActiveSection = useRef<SceneSection | null>(null)
  const scrollProgress = useRef<number>(0)
  // const purposeRotateSpeedMultiplier = useRef({ value: 1.0 })
  // const designRotateSpeedMultiplier = useRef({ value: 1.0 })
  // const engineeringRotateSpeedMultiplier = useRef({ value: 1.0 })

  const isShaderAnimating = useRef(false)
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      useHomeSceneStore.subscribe((s) => {
        previousActiveSection.current = s.prevActiveSection
        colourChangeStartTime.current = 0
        activeSection.current = s.activeSection

        const TRANSITION_DURATION = 1500

        setTimeout(() => {
          isShaderAnimating.current = false
        }, TRANSITION_DURATION)

        // Increase the intensity of the point light when the section is active or is final state
        gsap.to(pointLight.current, {
          intensity: activeSection.current ? LIGHT_INTENSITY[activeSection.current] : 0.1,
          duration: 0.5,
        })
      }),
    [],
  )

  // Translate the group in as the header text moves out
  useGSAP(() => {
    if (!group.current) return

    gsap.fromTo(
      group.current.position,
      { z: -2 },
      {
        ease: 'power1.inOut',
        z: 0,
        scrollTrigger: {
          start: 0,
          end: 'max',
          scrub: true,
          fastScrollEnd: true,
          onUpdate: ({ progress }) => {
            scrollProgress.current = progress
          },
          onEnterBack: () => {
            setHasScrolledIntoView(false)
          },
          onScrubComplete: () => {
            setHasScrolledIntoView(true)
          },
          onLeave: () => {
            setHasScrolledIntoView(true)
          },
        },
      },
    )
  }, [])

  useFrame(({ clock }) => {
    if (!purposeTorusShader.current || !designTorusShader.current || !engineeringTorusShader.current) return
    if (!purposePointsShader.current || !designPointsShader.current || !engineeringPointsShader.current) return

    const elapsedTime = clock.elapsedTime

    // Set the time uniform
    purposeTorusShader.current.uniforms.uTime.value = elapsedTime
    designTorusShader.current.uniforms.uTime.value = elapsedTime
    engineeringTorusShader.current.uniforms.uTime.value = elapsedTime

    purposePointsShader.current.uTime = elapsedTime
    designPointsShader.current.uTime = elapsedTime
    engineeringPointsShader.current.uTime = elapsedTime

    purposePointsShader.current.uScrollProgress = scrollProgress.current
    designPointsShader.current.uScrollProgress = scrollProgress.current
    engineeringPointsShader.current.uScrollProgress = scrollProgress.current

    // Exit out to allow for the current shader animation to finish
    if (isShaderAnimating.current) return

    // Set active states
    purposeTorusShader.current.uniforms.uIsActive.value = activeSection.current === SceneSection.Purpose ? true : false
    purposePointsShader.current.uIsActive = activeSection.current === SceneSection.Purpose ? true : false

    designTorusShader.current.uniforms.uIsActive.value = activeSection.current === SceneSection.Design ? true : false
    designPointsShader.current.uIsActive = activeSection.current === SceneSection.Design ? true : false

    engineeringTorusShader.current.uniforms.uIsActive.value =
      activeSection.current === SceneSection.Engineering ? true : false
    engineeringPointsShader.current.uIsActive = activeSection.current === SceneSection.Engineering ? true : false

    // Handle the colour change time
    const startStateChange =
      colourChangeStartTime.current === 0 && previousActiveSection.current !== activeSection.current

    if (!startStateChange) return

    colourChangeStartTime.current = elapsedTime
    isShaderAnimating.current = true

    if (previousActiveSection.current === SceneSection.Purpose || activeSection.current === SceneSection.Purpose) {
      purposeTorusShader.current.uniforms.uTransitionStartTime.value = elapsedTime
      purposePointsShader.current.uTransitionStartTime = elapsedTime
    } else if (previousActiveSection.current === SceneSection.Design || activeSection.current === SceneSection.Design) {
      designTorusShader.current.uniforms.uTransitionStartTime.value = elapsedTime
      designPointsShader.current.uTransitionStartTime = elapsedTime
    } else if (
      previousActiveSection.current === SceneSection.Engineering ||
      activeSection.current === SceneSection.Engineering
    ) {
      engineeringTorusShader.current.uniforms.uTransitionStartTime.value = elapsedTime
      engineeringPointsShader.current.uTransitionStartTime = elapsedTime
    }
  })

  return (
    <group ref={group} position={[0, 0, -3]}>
      {/* <Sphere ref={sphere} args={[0.03, 8, 8]}> */}
      <pointLight ref={pointLight} position={[0, 0, 0]} intensity={0.8} color="#FFF" />
      {/* <meshBasicMaterial color="#F6F6F6" /> */}
      {/* </Sphere> */}

      {/* Purpose Torus */}
      <Torus ref={purposeTorus} args={[PURPOSE_TORUS_RADIUS, PURPOSE_TORUS_TUBE, 16, 60]}>
        <CustomShaderMaterial
          ref={purposeTorusShader}
          baseMaterial={MeshLambertMaterial}
          transparent={true}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={PURPOSE_UNIFORMS}
        />
      </Torus>
      {/* Design Torus */}
      <Torus ref={designTorus} args={[DESIGN_TORUS_RADIUS, DESIGN_TORUS_TUBE, 16, 60]}>
        <CustomShaderMaterial
          ref={designTorusShader}
          baseMaterial={MeshLambertMaterial}
          transparent={true}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={DESIGN_UNIFORMS}
        />
      </Torus>
      {/* Engineering Torus */}
      <Torus ref={engineeringTorus} args={[ENGINEERING_TORUS_RADIUS, ENGINEERING_TORUS_TUBE, 16, 80]}>
        <CustomShaderMaterial
          ref={engineeringTorusShader}
          baseMaterial={MeshLambertMaterial}
          transparent={true}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={ENGINEERING_UNIFORMS}
        />
      </Torus>

      {/* Points */}
      {/* Purpose Points */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={purposePointsPositions.activePositions}
            count={purposePointsPositions.activePositions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-inactivePosition"
            array={purposePointsPositions.inactivePositions}
            count={purposePointsPositions.inactivePositions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-scatteredPosition"
            array={purposePointsPositions.scatteredPositions}
            count={purposePointsPositions.scatteredPositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <torusPointsShaderMaterial
          attach="material"
          ref={purposePointsShader}
          key={TorusPointsShaderMaterial.key}
          vertexShader={pointsVertexShader}
          fragmentShader={pointsFragmentShader}
          depthTest={false}
          transparent={true}
          blending={AdditiveBlending}
          uRotateSpeed={PURPOSE_ROTATE_SPEED}
        />
      </points>
      {/* Design Points */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={designPointsPositions.activePositions}
            count={designPointsPositions.activePositions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-inactivePosition"
            array={designPointsPositions.inactivePositions}
            count={designPointsPositions.inactivePositions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-scatteredPosition"
            array={designPointsPositions.scatteredPositions}
            count={designPointsPositions.scatteredPositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <torusPointsShaderMaterial
          attach="material"
          ref={designPointsShader}
          key={TorusPointsShaderMaterial.key}
          vertexShader={pointsVertexShader}
          fragmentShader={pointsFragmentShader}
          depthTest={false}
          transparent={true}
          uRotateSpeed={DESIGN_ROTATE_SPEED}
          blending={AdditiveBlending}
        />
      </points>
      {/* Engineering points */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={engineeringPointsPositions.activePositions}
            count={engineeringPointsPositions.activePositions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-inactivePosition"
            array={engineeringPointsPositions.inactivePositions}
            count={engineeringPointsPositions.inactivePositions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-scatteredPosition"
            array={engineeringPointsPositions.scatteredPositions}
            count={engineeringPointsPositions.scatteredPositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <torusPointsShaderMaterial
          attach="material"
          ref={engineeringPointsShader}
          key={TorusPointsShaderMaterial.key}
          vertexShader={pointsVertexShader}
          fragmentShader={pointsFragmentShader}
          depthTest={false}
          transparent={true}
          uRotateSpeed={ENGINEERING_ROTATE_SPEED}
          blending={AdditiveBlending}
        />
      </points>

      <Billboard position={[-1.1, 1, 1]}>
        <SkillPill section={SceneSection.Purpose} />
      </Billboard>
      <Billboard position={[1.1, 0, 2]}>
        <SkillPill section={SceneSection.Design} />
      </Billboard>
      <Billboard position={[0, -1.6, 1]}>
        <SkillPill section={SceneSection.Engineering} />
      </Billboard>
    </group>
  )
}

export default Rings

type PointsUniforms = {
  uTime: number
  uTransitionStartTime: number
  uIsActive: boolean
  uRotateSpeed: number
  uColour: Color
  uScrollProgress: number
}

const POINTS_UNIFORMS: PointsUniforms = {
  uTime: 0,
  uTransitionStartTime: 0,
  uIsActive: false,
  uRotateSpeed: 0.3,
  uColour: new Color('#9A93A9'),
  uScrollProgress: 0,
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

const purposePointsPositions = getTorusParticlePositions({
  radius: PURPOSE_TORUS_RADIUS,
  tube: PURPOSE_TORUS_TUBE,
  radialSegments: 24,
  tubularSegments: 80,
})

const designPointsPositions = getTorusParticlePositions({
  radius: DESIGN_TORUS_RADIUS,
  tube: DESIGN_TORUS_TUBE,
  radialSegments: 24,
  tubularSegments: 120,
})

const engineeringPointsPositions = getTorusParticlePositions({
  radius: ENGINEERING_TORUS_RADIUS,
  tube: ENGINEERING_TORUS_TUBE,
  radialSegments: 24,
  tubularSegments: 180,
})

function getTorusParticlePositions({
  radius,
  tube,
  radialSegments,
  tubularSegments,
}: {
  radius: number
  tube: number
  radialSegments: number
  tubularSegments: number
}): {
  activePositions: Float32Array
  inactivePositions: Float32Array
  scatteredPositions: Float32Array
} {
  const activePositions = []
  const inactivePositions = []
  const scatteredPositions = []

  for (let j = 0; j <= tubularSegments; j++) {
    const u = (j / tubularSegments) * Math.PI * 2
    for (let i = 0; i <= radialSegments; i++) {
      const v = (i / radialSegments) * Math.PI * 2

      const x = (radius + tube * Math.cos(v)) * Math.cos(u)
      const y = (radius + tube * Math.cos(v)) * Math.sin(u)
      const z = tube * Math.sin(v)

      activePositions.push(x, y, z)

      // Spread the particles out
      inactivePositions.push(
        x + (Math.random() - 0.5) * 0.12,
        y + (Math.random() - 0.5) * 0.12,
        z + (Math.random() - 0.5) * 0.12,
      )

      // Scatter the particles
      scatteredPositions.push(
        x + (Math.random() - 0.5) * 3.0,
        y + (Math.random() - 0.5) * 3.0,
        z + (Math.random() - 0.5) * 3.0,
      )
    }
  }

  return {
    activePositions: new Float32Array(activePositions),
    inactivePositions: new Float32Array(inactivePositions),
    scatteredPositions: new Float32Array(scatteredPositions),
  }
}
