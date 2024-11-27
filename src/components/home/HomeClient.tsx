'use client'
import { useGSAP } from '@gsap/react'
import { Billboard, Plane, Sphere, Stats, Torus } from '@react-three/drei'
import { ScreenQuad, shaderMaterial, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { extend, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import SplitText from 'gsap/dist/SplitText'
import React, { type FC, useRef } from 'react'
import { BufferGeometry, Mesh, MeshPhongMaterial, NormalBufferAttributes, ShaderMaterial, Texture } from 'three'

import Button from '@/components/buttons/Button'
import PointerCamera from '@/components/PointerCamera'
import { HeaderSection } from '@/hooks/home/useHomeStore'
import { ExamplePathname } from '@/resources/navigation'

import WavePlane from '../examples/wavePlane/WavePlane'
import bgFragment from './background.frag'
import bgVertex from './background.vert'
import SkillPill from './SkillPill'
gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

const HomeClient: FC = () => {
  return (
    <Canvas
      className="!fixed inset-0"
      dpr={2}
      gl={{
        antialias: false,
      }}>
      <ambientLight intensity={1.4} />
      <PointerCamera cameraProps={{ far: 12, position: [0, 0, 6] }} />
      <BackgroundShader />
      {/* TODO: Render all of this into an FBO for postprocessing */}
      <Rings />
    </Canvas>
  )
}

export default HomeClient

const Rings: FC = () => {
  const sphere = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)
  const torus = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)
  const torus2 = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)

  useGSAP(() => {
    if (!torus.current || !torus2.current) return
    // Rotate the torus

    gsap.fromTo(
      torus.current.rotation,
      { y: 0, x: 0 },
      {
        ease: 'none',
        y: Math.PI * 4, // Rotate 720 degrees in radians
        x: -Math.PI * 2, // Rotate 360 degrees in radians
        duration: 4,
        repeat: -1,
      },
    )

    gsap.fromTo(
      torus2.current.rotation,
      {
        y: 0,
        x: 0,
      },
      {
        ease: 'none',
        y: -Math.PI * 4, // Rotate 720 degrees in radians
        x: Math.PI * 2, // Rotate 360 degrees in radians
        duration: 6,
        repeat: -1,
      },
    )
  }, [])

  return (
    <group position={[0, 0, 0]}>
      <Sphere ref={sphere} args={[0.3, 32, 32]} position={[0, 0, 0]}>
        <pointLight position={[0, 0, 0]} intensity={2.6} color={'#fff'} />
        <meshBasicMaterial color="#fff" />
      </Sphere>

      <Torus ref={torus} args={[1, 0.2, 16, 100]} position={[0, 0, 0]}>
        <meshLambertMaterial color="#37F3FF" reflectivity={2} />
      </Torus>

      <Torus ref={torus2} args={[1.6, 0.2, 16, 100]} position={[0, 0, 0]}>
        <meshPhongMaterial color="#37FFA8" reflectivity={2} />
      </Torus>

      <Billboard position={[-1, 1.6, 1]}>
        <SkillPill section={HeaderSection.Purpose} />
      </Billboard>

      <Billboard position={[1.6, 0, 2]}>
        <SkillPill section={HeaderSection.Design} />
      </Billboard>

      <Billboard position={[0, -2, 1]}>
        <SkillPill section={HeaderSection.Engineering} />
      </Billboard>
    </group>
  )
}

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

const BackgroundShader: FC = () => {
  const { viewport } = useThree()
  const shader = useRef<ShaderMaterial & Partial<Uniforms>>(null)

  useFrame(({ clock }) => {
    if (!shader.current) return
    shader.current.uTime = clock.elapsedTime
  })

  return (
    <Plane args={[viewport.width * 1.8, viewport.height * 1.8, 1, 1]} position={[0, 0, -3]}>
      <homeBackgroundShaderMaterial
        key={HomeBackgroundShaderMaterial.key}
        ref={shader}
        // Uniforms
        uTime={0}
        uAspect={viewport.aspect}
      />
    </Plane>
  )
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      homeBackgroundShaderMaterial: ShaderMaterialProps & Uniforms
    }
  }
}
