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
  MathUtils,
  Mesh,
  MeshLambertMaterial,
  type NormalBufferAttributes,
  PointLight,
  ShaderMaterial,
} from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'

import { SceneSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'
import { CYAN_VEC3, GREEN_VEC3, LIGHT_VEC3, ORANGE_VEC3 } from '@/resources/colours'

import FloatingInfo from '../FloatingInfo'
import fragmentShader from './torus.frag'
import vertexShader from './torus.vert'
import pointsFragmentShader from './torusPoints.frag'
import pointsVertexShader from './torusPoints.vert'

const HomeMain: FC = () => {
  const torusGroup = useRef<Group>(null)
  const pointLight = useRef<PointLight>(null)

  const setHasScrolledIntoView = useHomeSceneStore((s) => s.setHasCompletedIntroScroll)
  const introScrollProgress = useRef<number>(0)
  const getScrollProgress = (): number => introScrollProgress.current

  // // Translate the group in as the header text moves out
  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: 1000,
      scrub: true,
      onUpdate: (self) => {
        introScrollProgress.current = self.progress
      },
      onEnterBack: () => {
        setHasScrolledIntoView(false)
      },
      onLeave: () => {
        setHasScrolledIntoView(true)
      },
    })
  }, [])

  return (
    <>
      <group ref={torusGroup} position={[0, 0, 0]}>
        <pointLight ref={pointLight} position={[1.0, 1.7, 0.5]} intensity={5.0} color="#FFF" />
        <SectionTorus section={SceneSection.Purpose} />
        <TorusPoints section={SceneSection.Purpose} getScrollProgress={getScrollProgress} />
        <SectionTorus section={SceneSection.Design} />
        <TorusPoints section={SceneSection.Design} getScrollProgress={getScrollProgress} />
        <SectionTorus section={SceneSection.Engineering} />
        <TorusPoints section={SceneSection.Engineering} getScrollProgress={getScrollProgress} />
      </group>
      <group>
        <Billboard position={[-1.1, 0.7, 1]}>
          <FloatingInfo section={SceneSection.Purpose} />
        </Billboard>
        <Billboard position={[1.6, 0, 2]}>
          <FloatingInfo section={SceneSection.Design} />
        </Billboard>
        <Billboard position={[-0.5, -2, 1]}>
          <FloatingInfo section={SceneSection.Engineering} />
        </Billboard>
      </group>
    </>
  )
}

export default HomeMain

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
        isActive.current = s.activeSection === section
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
        isActive.current = s.activeSection === section
        if (isActive.current) {
          if (activeProgress.current.value === 1) return
          activeTween.current?.kill()
          activeTween.current = gsap.to(activeProgress.current, { duration: 1.2, ease: 'power2.in', value: 1 })
        } else {
          if (activeProgress.current.value === 0) return
          activeTween.current?.kill()
          activeTween.current = gsap.to(activeProgress.current, {
            duration: 0.8,
            ease: 'power1.out',
            value: 0,
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

const ROTATE_SPEEDS: Record<SceneSection, number> = {
  [SceneSection.Purpose]: 0.2,
  [SceneSection.Design]: 0.15,
  [SceneSection.Engineering]: 0.1,
} as const

const PURPOSE_TORUS_RADIUS = 0.5 as const
const PURPOSE_TORUS_TUBE = 0.1 as const

const DESIGN_TORUS_RADIUS = 1.0 as const
const DESIGN_TORUS_TUBE = 0.1 as const

const ENGINEERING_TORUS_RADIUS = 1.5 as const
const ENGINEERING_TORUS_TUBE = 0.1 as const

const TORUS_ARGS: Record<SceneSection, [number, number, number, number]> = {
  [SceneSection.Purpose]: [PURPOSE_TORUS_RADIUS, PURPOSE_TORUS_TUBE, 16, 32],
  [SceneSection.Design]: [DESIGN_TORUS_RADIUS, DESIGN_TORUS_TUBE, 16, 64],
  [SceneSection.Engineering]: [ENGINEERING_TORUS_RADIUS, ENGINEERING_TORUS_TUBE, 16, 128],
}

const PURPOSE_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateSpeed: { value: ROTATE_SPEEDS.purpose },
  uIsActive: { value: false },
  uColour: { value: new Color('#BDB8C6') },
  uActiveColour: { value: GREEN_VEC3 },
  uActiveProgress: { value: 0 },
  uRadius: { value: PURPOSE_TORUS_RADIUS },
  uTube: { value: PURPOSE_TORUS_TUBE },
}

const DESIGN_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateSpeed: { value: ROTATE_SPEEDS.design },
  uIsActive: { value: false },
  uColour: { value: new Color('#9A93A9') },
  uActiveColour: { value: ORANGE_VEC3 },
  uActiveProgress: { value: 0 },
  uRadius: { value: DESIGN_TORUS_RADIUS },
  uTube: { value: DESIGN_TORUS_TUBE },
}

const ENGINEERING_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uRotateSpeed: { value: ROTATE_SPEEDS[SceneSection.Engineering] },
  uIsActive: { value: false },
  uColour: { value: LIGHT_VEC3 },
  uActiveColour: { value: CYAN_VEC3 },
  uActiveProgress: { value: 0 },
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
  uRotateSpeed: number
  uColour: Color
  uScrollProgress: number
  uActiveProgress: number
}

const POINTS_UNIFORMS: PointsUniforms = {
  uTime: 0,
  uRotateSpeed: 0.3,
  uColour: new Color('#9A93A9'),
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

const POINTS_POSITIONS: Record<SceneSection, ReturnType<typeof getTorusParticlePositions>> = {
  [SceneSection.Purpose]: getTorusParticlePositions({
    radius: PURPOSE_TORUS_RADIUS,
    tube: PURPOSE_TORUS_TUBE,
    radialSegments: 16,
    tubularSegments: 64,
  }),
  [SceneSection.Design]: getTorusParticlePositions({
    radius: DESIGN_TORUS_RADIUS,
    tube: DESIGN_TORUS_TUBE,
    radialSegments: 16,
    tubularSegments: 64 * 2,
  }),
  [SceneSection.Engineering]: getTorusParticlePositions({
    radius: ENGINEERING_TORUS_RADIUS,
    tube: ENGINEERING_TORUS_TUBE,
    radialSegments: 15,
    tubularSegments: 64 * 3,
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
        x + (Math.random() - 0.25) * 0.12,
        y + (Math.random() - 0.25) * 0.12,
        z + (Math.random() - 0.25) * 0.08,
      )

      // Create random positions around a sphere
      const distance = 2.0
      const theta = MathUtils.randFloatSpread(360)
      const phi = MathUtils.randFloatSpread(360)
      scatteredPositions.push(
        distance * Math.sin(theta) * Math.cos(phi),
        distance * Math.sin(theta) * Math.sin(phi),
        distance * Math.cos(theta) + Math.random() * 0.5 - 0.25,
      )
    }
  }

  return {
    activePositions: new Float32Array(activePositions),
    inactivePositions: new Float32Array(inactivePositions),
    scatteredPositions: new Float32Array(scatteredPositions),
  }
}
