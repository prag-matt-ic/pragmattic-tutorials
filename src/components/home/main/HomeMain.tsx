'use client'
import { useGSAP } from '@gsap/react'
import { Billboard, shaderMaterial, Torus } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
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

import FloatingInfo from '../SkillPill'
import fragmentShader from './torus.frag'
import vertexShader from './torus.vert'
import pointsFragmentShader from './torusPoints.frag'
import pointsVertexShader from './torusPoints.vert'

const LIGHT_INTENSITY: Record<SceneSection, number> = {
  [SceneSection.Purpose]: 0.8,
  [SceneSection.Design]: 1.4,
  [SceneSection.Engineering]: 2.4,
}

const HomeMain: FC = () => {
  const torusGroup = useRef<Group>(null)
  const pointLight = useRef<PointLight>(null)

  const setHasScrolledIntoView = useHomeSceneStore((s) => s.setHasScrolledIntoView)
  const introScrollProgress = useRef<number>(0)

  // Translate the group in as the header text moves out
  useGSAP(() => {
    if (!torusGroup.current) return

    // Intro scroll animation
    gsap.fromTo(
      torusGroup.current.position,
      { z: -2 },
      {
        ease: 'none',
        z: 0,
        scrollTrigger: {
          trigger: '#home-header',
          start: 0,
          end: 1400,
          scrub: true,
          fastScrollEnd: true,
          onUpdate: ({ progress }) => {
            introScrollProgress.current = progress
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

  const getScrollProgress = () => introScrollProgress.current

  return (
    <>
      <group ref={torusGroup} position={[0, 0, 1]}>
        <pointLight ref={pointLight} position={[0, 0, 0]} intensity={0.8} color="#FFF" />
        <TorusWithPoints section={SceneSection.Purpose} getScrollProgress={getScrollProgress} />
        <TorusWithPoints section={SceneSection.Design} getScrollProgress={getScrollProgress} />
        <TorusWithPoints section={SceneSection.Engineering} getScrollProgress={getScrollProgress} />
      </group>
      <group>
        <Billboard position={[-1.1, 1, 1]}>
          <FloatingInfo section={SceneSection.Purpose} />
        </Billboard>
        <Billboard position={[1.6, 0, 2]}>
          <FloatingInfo section={SceneSection.Design} />
        </Billboard>
        <Billboard position={[0, -1.7, 1]}>
          <FloatingInfo section={SceneSection.Engineering} />
        </Billboard>
      </group>
    </>
  )
}

export default HomeMain

type Props = {
  section: SceneSection
  getScrollProgress: () => number
}

const TorusWithPoints: FC<Props> = ({ section, getScrollProgress }) => {
  const torusMesh = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)
  const shaderMaterial = useRef<ShaderMaterial>(null)
  const pointsShaderMaterial = useRef<ShaderMaterial & PointsUniforms>(null)

  const transitionStartTime = useRef<number>(1)
  const isActive = useRef<boolean>(false)
  const isPrevActive = useRef<boolean>(false)
  const isAnimating = useRef(false)

  const setActiveSection = useHomeSceneStore((s) => s.setActiveSection)

  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      useHomeSceneStore.subscribe((s) => {
        transitionStartTime.current = 0
        isPrevActive.current = s.prevActiveSection === section
        isActive.current = s.activeSection === section

        const TRANSITION_DURATION = 1500

        setTimeout(() => {
          isAnimating.current = false
        }, TRANSITION_DURATION)
      }),
    [section],
  )

  // make active when the corresonding HTML section enters the view
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: `#${section}-section`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          setActiveSection(section)
        },
        onEnterBack: () => {
          setActiveSection(section)
        },
      })
    },
    { dependencies: [section] },
  )

  useFrame(({ clock }) => {
    if (!shaderMaterial.current || !pointsShaderMaterial.current) return
    const elapsedTime = clock.elapsedTime

    // Set the time uniform
    shaderMaterial.current.uniforms.uTime.value = elapsedTime
    pointsShaderMaterial.current.uTime = elapsedTime
    pointsShaderMaterial.current.uScrollProgress = getScrollProgress()

    // Exit out to allow for the current shader animation to finish
    if (isAnimating.current) return

    // Set active states
    shaderMaterial.current.uniforms.uIsActive.value = isActive.current
    pointsShaderMaterial.current.uIsActive = isActive.current

    // Handle the colour change time
    const shouldStartTransition = transitionStartTime.current === 0 && isPrevActive.current !== isActive.current
    if (!shouldStartTransition) return

    isAnimating.current = true
    transitionStartTime.current = elapsedTime
    shaderMaterial.current.uniforms.uTransitionStartTime.value = elapsedTime
    pointsShaderMaterial.current.uTransitionStartTime = elapsedTime
  })

  return (
    <>
      {/* TODO: Review args  */}
      <Torus ref={torusMesh} args={[...TORUS_ARGS[section], 16, 80]}>
        <CustomShaderMaterial
          ref={shaderMaterial}
          baseMaterial={MeshLambertMaterial}
          transparent={true}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={SHADER_UNIFORMS[section]}
        />
      </Torus>
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
    </>
  )
}

type UniformValues = {
  [key: string]: {
    value: any
  }
}

const ROTATE_SPEEDS: Record<SceneSection, number> = {
  [SceneSection.Purpose]: 0.4,
  [SceneSection.Design]: 0.3,
  [SceneSection.Engineering]: 0.2,
} as const

const PURPOSE_TORUS_RADIUS = 0.5 as const
const PURPOSE_TORUS_TUBE = 0.1 as const

const DESIGN_TORUS_RADIUS = 0.9 as const
const DESIGN_TORUS_TUBE = 0.1 as const

const ENGINEERING_TORUS_RADIUS = 1.3 as const
const ENGINEERING_TORUS_TUBE = 0.1 as const

const TORUS_ARGS: Record<SceneSection, [number, number]> = {
  [SceneSection.Purpose]: [PURPOSE_TORUS_RADIUS, PURPOSE_TORUS_TUBE],
  [SceneSection.Design]: [DESIGN_TORUS_RADIUS, DESIGN_TORUS_TUBE],
  [SceneSection.Engineering]: [ENGINEERING_TORUS_RADIUS, ENGINEERING_TORUS_TUBE],
}

const PURPOSE_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateSpeed: { value: ROTATE_SPEEDS.purpose },
  uIsActive: { value: false },
  uColour: { value: new Color('#BDB8C6') },
  uActiveColour: { value: GREEN_VEC3 },
  uTransitionStartTime: { value: 0 },
  uRadius: { value: PURPOSE_TORUS_RADIUS },
  uTube: { value: PURPOSE_TORUS_TUBE },
}

const DESIGN_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateSpeed: { value: ROTATE_SPEEDS.design },
  uIsActive: { value: false },
  uColour: { value: new Color('#9A93A9') },
  uActiveColour: { value: ORANGE_VEC3 },
  uTransitionStartTime: { value: 0 },
  uRadius: { value: DESIGN_TORUS_RADIUS },
  uTube: { value: DESIGN_TORUS_TUBE },
}

const ENGINEERING_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateSpeed: { value: ROTATE_SPEEDS[SceneSection.Engineering] },
  uIsActive: { value: false },
  uColour: { value: LIGHT_VEC3 },
  uActiveColour: { value: CYAN_VEC3 },
  uTransitionStartTime: { value: 0 },
  uRadius: { value: ENGINEERING_TORUS_RADIUS },
  uTube: { value: ENGINEERING_TORUS_TUBE },
}

const SHADER_UNIFORMS: Record<SceneSection, UniformValues> = {
  [SceneSection.Purpose]: PURPOSE_UNIFORMS,
  [SceneSection.Design]: DESIGN_UNIFORMS,
  [SceneSection.Engineering]: ENGINEERING_UNIFORMS,
}

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

const POINTS_POSITIONS: Record<SceneSection, ReturnType<typeof getTorusParticlePositions>> = {
  [SceneSection.Purpose]: getTorusParticlePositions({
    radius: PURPOSE_TORUS_RADIUS,
    tube: PURPOSE_TORUS_TUBE,
    radialSegments: 24,
    tubularSegments: 80,
  }),
  [SceneSection.Design]: getTorusParticlePositions({
    radius: DESIGN_TORUS_RADIUS,
    tube: DESIGN_TORUS_TUBE,
    radialSegments: 24,
    tubularSegments: 120,
  }),
  [SceneSection.Engineering]: getTorusParticlePositions({
    radius: ENGINEERING_TORUS_RADIUS,
    tube: ENGINEERING_TORUS_TUBE,
    radialSegments: 24,
    tubularSegments: 180,
  }),
} as const

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
