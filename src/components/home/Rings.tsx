'use client'
import { useGSAP } from '@gsap/react'
import { Billboard, Sphere, Torus } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import React, { type FC, useEffect, useRef } from 'react'
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  NormalBufferAttributes,
  PointLight,
  ShaderMaterial,
} from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'

import { SceneSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'
import { CYAN_VEC3, GREEN_VEC3, ORANGE_VEC3 } from '@/resources/colours'

import SkillPill from './SkillPill'
import fragmentShader from './torus.frag'
import vertexShader from './torus.vert'

type UniformValues = {
  [key: string]: {
    value: any
  }
}

// const PURPOSE_UNIFORMS: UniformValues = {
//   uTime: { value: 0 },
//   uIsActive: { value: false },
//   uColour: { value: new Color('#F6F6F6') },
//   uActiveColour: { value: new Color('#37FFA8') }, // Green
// }

const DESIGN_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uIsActive: { value: false },
  uColour: { value: new Color('#AFAABB') },
  uActiveColour: { value: ORANGE_VEC3 },
}

const ENGINEERING_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uIsActive: { value: false },
  uColour: { value: new Color('#7A718E') },
  uActiveColour: { value: CYAN_VEC3 },
}

const Rings: FC = () => {
  const group = useRef<Group>(null)
  const sphere = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)
  const designTorus = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)
  const engineeringTorus = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)

  const designTorusTween = useRef<GSAPTween>()
  const engineeringTorusTween = useRef<GSAPTween>()

  // TODO: Transition the colour change smoothly in the shader
  // const colourChangeStartTime = useRef<number>(0)
  const pointLight = useRef<PointLight>(null)
  const purposeMaterial = useRef<MeshBasicMaterial>(null)
  const designTorusShader = useRef<ShaderMaterial>(null)
  const engineeringTorusShader = useRef<ShaderMaterial>(null)

  const setHasScrolledIntoView = useHomeSceneStore((s) => s.setHasScrolledIntoView)

  // https://github.com/pmndrs/zustand?tab=readme-ov-file#transient-updates-for-often-occurring-state-changes
  const activeSection = useRef(useHomeSceneStore.getState().activeSection)
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      useHomeSceneStore.subscribe((s) => {
        activeSection.current = s.activeSection
        // Speed up the rotation tweens
        if (!designTorusTween.current || !engineeringTorusTween.current) return
        gsap.to(designTorusTween.current, {
          timeScale: s.activeSection === SceneSection.Design ? 20 : 1,
          duration: 3,
          ease: 'power2.out',
        })
        gsap.to(engineeringTorusTween.current, {
          timeScale: s.activeSection === SceneSection.Engineering ? 20 : 1,
          duration: 3,
          ease: 'power2.out',
        })
        if (!pointLight.current) return
        gsap.to(pointLight.current, {
          intensity: s.activeSection === SceneSection.Purpose ? 5 : 0.8,
          duration: 0.5,
        })
        if (!purposeMaterial.current) return
        purposeMaterial.current.color.set(activeSection.current === SceneSection.Purpose ? GREEN_VEC3 : '#F6F6F6')
      }),
    [],
  )

  // Translate the group in as the header text moves out
  useGSAP(() => {
    if (!group.current) return

    gsap.fromTo(
      group.current.position,
      { y: -10, z: -15 },
      {
        ease: 'power1.in',
        z: 0,
        y: 0,
        duration: 1,
        scrollTrigger: {
          start: 0,
          end: 'max',
          scrub: true,
          fastScrollEnd: true,
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

  useGSAP(() => {
    if (!designTorus.current || !engineeringTorus.current) return
    // Rotate the torus

    designTorusTween.current = gsap.fromTo(
      designTorus.current.rotation,
      { y: 0, x: 0 },
      {
        ease: 'none',
        y: Math.PI * 4, // Rotate 720 degrees in radians
        x: -Math.PI * 2, // Rotate 360 degrees in radians
        duration: 24,
        repeat: -1,
      },
    )

    engineeringTorusTween.current = gsap.fromTo(
      engineeringTorus.current.rotation,
      {
        y: 0,
        x: 0,
      },
      {
        ease: 'none',
        y: -Math.PI * 4, // Rotate 720 degrees in radians
        x: Math.PI * 2, // Rotate 360 degrees in radians
        duration: 32,
        repeat: -1,
      },
    )
  }, [activeSection])

  useFrame(({ clock }) => {
    if (!purposeMaterial.current || !designTorusShader.current || !engineeringTorusShader.current) return

    const elapsedTime = clock.elapsedTime

    designTorusShader.current.uniforms.uTime.value = elapsedTime
    designTorusShader.current.uniforms.uIsActive.value = activeSection.current === SceneSection.Design ? true : false

    engineeringTorusShader.current.uniforms.uTime.value = elapsedTime
    engineeringTorusShader.current.uniforms.uIsActive.value =
      activeSection.current === SceneSection.Engineering ? true : false
  })

  return (
    <group ref={group} position={[0, -10, -15]}>
      <Sphere ref={sphere} args={[0.2, 32, 32]}>
        <pointLight ref={pointLight} position={[0, 0, 0]} intensity={0.8} color="#FFF" />

        {/* TODO: Create custom shader material for the sphere */}
        <meshBasicMaterial ref={purposeMaterial} color="#F6F6F6" />
      </Sphere>

      {/* TODO: place points on the Torus and animate them in and when the section is active */}
      <points>
        <torusGeometry args={[0.6, 0.1, 16, 120]} />
        <pointsMaterial
          size={0.02}
          color="#7A718E"
          sizeAttenuation={true}
          transparent={true}
          opacity={0.03}
          depthTest={false}
          blending={AdditiveBlending}
        />
      </points>

      <points>
        <torusGeometry args={[1, 0.1, 16, 160]} />
        <pointsMaterial
          size={0.02}
          color="#7A718E"
          sizeAttenuation={true}
          transparent={true}
          opacity={0.03}
          depthTest={false}
          blending={AdditiveBlending}
        />
      </points>

      {/* Design Torus */}
      <Torus ref={designTorus} args={[0.6, 0.1, 16, 80]}>
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
      <Torus ref={engineeringTorus} args={[1, 0.1, 16, 80]}>
        <CustomShaderMaterial
          ref={engineeringTorusShader}
          baseMaterial={MeshLambertMaterial}
          transparent={true}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={ENGINEERING_UNIFORMS}
        />
      </Torus>

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
