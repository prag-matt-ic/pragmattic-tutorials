'use client'
import { useGSAP } from '@gsap/react'
import { Billboard, shaderMaterial, Sphere, Torus } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import React, { type FC, useEffect, useRef } from 'react'
import {
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

import SkillPill from './SkillPill'
import fragmentShader from './torus.frag'
import vertexShader from './torus.vert'

type UniformValues = {
  [key: string]: {
    value: any
  }
}

const PURPOSE_TORUS_RADIUS = 0.5 as const
const PURPOSE_TORUS_TUBE = 0.1 as const

const PURPOSE_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uIsActive: { value: false },
  uColour: { value: new Color('#BDB8C6') },
  uActiveColour: { value: GREEN_VEC3 },
  uColourChangeStartTime: { value: 0 },
  uRadius: { value: PURPOSE_TORUS_RADIUS },
  uTube: { value: PURPOSE_TORUS_TUBE },
}

const DESIGN_TORUS_RADIUS = 0.9 as const
const DESIGN_TORUS_TUBE = 0.1 as const

const DESIGN_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uIsActive: { value: false },
  uColour: { value: new Color('#9A93A9') },
  uActiveColour: { value: ORANGE_VEC3 },
  uColourChangeStartTime: { value: 0 },
  uRadius: { value: DESIGN_TORUS_RADIUS },
  uTube: { value: DESIGN_TORUS_TUBE },
}

const ENGINEERING_TORUS_RADIUS = 1.3 as const
const ENGINEERING_TORUS_TUBE = 0.1 as const

const ENGINEERING_UNIFORMS: UniformValues = {
  uTime: { value: 0 },
  uIsActive: { value: false },
  uColour: { value: LIGHT_VEC3 },
  uActiveColour: { value: CYAN_VEC3 },
  uColourChangeStartTime: { value: 0 },
  uRadius: { value: ENGINEERING_TORUS_RADIUS },
  uTube: { value: ENGINEERING_TORUS_TUBE },
}

const Rings: FC = () => {
  const group = useRef<Group>(null)
  const sphere = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)

  const purposeTorus = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)
  const designTorus = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)
  const engineeringTorus = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)

  const purposeTorusTween = useRef<GSAPTween>()
  const designTorusTween = useRef<GSAPTween>()
  const engineeringTorusTween = useRef<GSAPTween>()

  const pointLight = useRef<PointLight>(null)
  const purposeTorusShader = useRef<ShaderMaterial>(null)
  const designTorusShader = useRef<ShaderMaterial>(null)
  const engineeringTorusShader = useRef<ShaderMaterial>(null)

  const setHasScrolledIntoView = useHomeSceneStore((s) => s.setHasScrolledIntoView)

  // https://github.com/pmndrs/zustand?tab=readme-ov-file#transient-updates-for-often-occurring-state-changes
  const colourChangeStartTime = useRef<number>(1)
  const activeSection = useRef<SceneSection | null>(null)
  const previousActiveSection = useRef<SceneSection | null>(null)
  const isFinalState = useRef(useHomeSceneStore.getState().isFinalState)

  const isShaderAnimating = useRef(false)
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(
    () =>
      useHomeSceneStore.subscribe((s) => {
        previousActiveSection.current = s.prevActiveSection
        colourChangeStartTime.current = 0
        activeSection.current = s.activeSection

        const COLOUR_CHANGE_DURATION = 1200

        setTimeout(() => {
          isShaderAnimating.current = false
        }, COLOUR_CHANGE_DURATION)

        isFinalState.current = s.isFinalState

        if (!purposeTorusTween.current || !designTorusTween.current || !engineeringTorusTween.current) return
        if (!pointLight.current) return

        // Speed up the rotation tweens when the section is active or is final state
        gsap.to(purposeTorusTween.current, {
          timeScale: s.isFinalState || s.activeSection === SceneSection.Purpose ? 16 : 1,
          duration: 2,
          ease: 'power2.out',
        })
        gsap.to(designTorusTween.current, {
          timeScale: s.isFinalState || s.activeSection === SceneSection.Design ? 16 : 1,
          duration: 2,
          ease: 'power2.out',
        })
        gsap.to(engineeringTorusTween.current, {
          timeScale: s.isFinalState || s.activeSection === SceneSection.Engineering ? 16 : 1,
          duration: 2,
          ease: 'power2.out',
        })
        // Increase the intensity of the point light when the section is active or is final state
        // gsap.to(pointLight.current, {
        //   intensity: s.isFinalState || s.activeSection === SceneSection.Purpose ? 3.0 : 1.0,
        //   duration: 0.5,
        // })
      }),
    [],
  )

  // Translate the group in as the header text moves out
  useGSAP(() => {
    if (!group.current) return

    gsap.fromTo(
      group.current.position,
      { y: -11, z: -13 },
      {
        ease: 'power1.inOut',
        z: 0,
        y: 0,
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

  // Rotate the torus
  useGSAP(() => {
    if (!purposeTorus.current || !designTorus.current || !engineeringTorus.current) return

    purposeTorusTween.current = gsap.fromTo(
      purposeTorus.current.rotation,
      { y: 0, x: 0 },
      {
        ease: 'none',
        y: -Math.PI * 4, // Rotate 720 degrees in radians
        x: Math.PI * 2, // Rotate 360 degrees in radians
        duration: 24,
        repeat: -1,
      },
    )

    designTorusTween.current = gsap.fromTo(
      designTorus.current.rotation,
      { y: 0, x: 0 },
      {
        ease: 'none',
        y: Math.PI * 4, // Rotate 720 degrees in radians
        x: -Math.PI * 2, // Rotate 360 degrees in radians
        duration: 40,
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
        duration: 50,
        repeat: -1,
      },
    )
  }, [])

  useFrame(({ clock }) => {
    if (!purposeTorusShader.current || !designTorusShader.current || !engineeringTorusShader.current) return

    const elapsedTime = clock.elapsedTime
    purposeTorusShader.current.uniforms.uTime.value = elapsedTime
    designTorusShader.current.uniforms.uTime.value = elapsedTime
    engineeringTorusShader.current.uniforms.uTime.value = elapsedTime

    // Exit out to allow for the current shader animation to finish
    if (isShaderAnimating.current) return

    purposeTorusShader.current.uniforms.uIsActive.value =
      isFinalState.current || activeSection.current === SceneSection.Purpose ? true : false

    designTorusShader.current.uniforms.uIsActive.value =
      isFinalState.current || activeSection.current === SceneSection.Design ? true : false

    engineeringTorusShader.current.uniforms.uIsActive.value =
      isFinalState.current || activeSection.current === SceneSection.Engineering ? true : false

    // Handle the colour change time
    if (colourChangeStartTime.current === 0 && previousActiveSection.current !== activeSection.current) {
      colourChangeStartTime.current = elapsedTime
      isShaderAnimating.current = true

      if (previousActiveSection.current === SceneSection.Purpose || activeSection.current === SceneSection.Purpose) {
        purposeTorusShader.current.uniforms.uColourChangeStartTime.value = elapsedTime
      } else if (
        previousActiveSection.current === SceneSection.Design ||
        activeSection.current === SceneSection.Design
      ) {
        designTorusShader.current.uniforms.uColourChangeStartTime.value = elapsedTime
      } else if (
        previousActiveSection.current === SceneSection.Engineering ||
        activeSection.current === SceneSection.Engineering
      ) {
        engineeringTorusShader.current.uniforms.uColourChangeStartTime.value = elapsedTime
      }
    }
  })

  return (
    <group ref={group} position={[0, -11, -13]}>
      <Sphere ref={sphere} args={[0.04, 12, 12]}>
        <pointLight ref={pointLight} position={[0, 0, 0]} intensity={0.8} color="#FFF" />
        <meshBasicMaterial color="#F6F6F6" />
      </Sphere>

      <TorusPoints radius={PURPOSE_TORUS_RADIUS} tube={PURPOSE_TORUS_TUBE} radialSegments={24} tubularSegments={60} />
      <TorusPoints radius={DESIGN_TORUS_RADIUS} tube={DESIGN_TORUS_TUBE} radialSegments={24} tubularSegments={120} />
      <TorusPoints
        radius={ENGINEERING_TORUS_RADIUS}
        tube={ENGINEERING_TORUS_TUBE}
        radialSegments={24}
        tubularSegments={180}
      />

      {/* Purpose Torus */}
      <Torus ref={purposeTorus} args={[PURPOSE_TORUS_RADIUS, PURPOSE_TORUS_TUBE, 16, 60]} castShadow={true}>
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
      <Torus
        ref={designTorus}
        args={[DESIGN_TORUS_RADIUS, DESIGN_TORUS_TUBE, 16, 60]}
        castShadow={true}
        receiveShadow={true}>
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
      <Torus
        ref={engineeringTorus}
        args={[ENGINEERING_TORUS_RADIUS, ENGINEERING_TORUS_TUBE, 16, 80]}
        receiveShadow={true}>
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

const pointsVertexShader = `
  uniform float uTime;

  void main() {

    // Apply rotation around the Y-axis
    float angle = uTime * 0.2;
    mat3 rotationMatrix = mat3(
      cos(angle), 0.0, sin(angle),
      0.0, 1.0, 0.0,
      -sin(angle), 0.0, cos(angle)
    );

    vec3 rotatedPosition = rotationMatrix * position;

    vec4 modelPosition = modelMatrix * vec4(rotatedPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // Attenuation factor - further away the particle is from the camera, the smaller it will be
    float attenuationFactor = (1.0 / projectedPosition.z);

    // Point size is required for point rendering
    float pointSize = clamp(1.0, 8.0, 8.0 * attenuationFactor);

    gl_Position = projectedPosition;
    gl_PointSize = pointSize;
  }
`

const pointsFragmentShader = `
  void main() {
    vec2 normalizedPoint = gl_PointCoord - vec2(0.5);
    
    float dist = length(normalizedPoint);
    
    vec4 finalColour = vec4(1.0, 1.0, 1.0, (1.0 - dist) * 0.05);

    gl_FragColor = finalColour;
  }
`

type PointsUniforms = {
  uTime: number
}

const POINTS_UNIFORMS: PointsUniforms = {
  uTime: 0,
}

const TorusPointsShaderMaterial = shaderMaterial(POINTS_UNIFORMS, pointsVertexShader, pointsFragmentShader)

extend({ TorusPointsShaderMaterial })

type TorusPointsProps = {
  radius: number
  tube: number
  radialSegments: number
  tubularSegments: number
}

const TorusPoints: FC<TorusPointsProps> = ({ radialSegments, radius, tube, tubularSegments }) => {
  const shaderMaterialRef = useRef<ShaderMaterial & Partial<PointsUniforms>>(null)

  useFrame(({ clock }) => {
    if (!shaderMaterialRef.current) return
    shaderMaterialRef.current.uTime = clock.elapsedTime
  })

  return (
    <points>
      <torusGeometry args={[radius, tube, radialSegments, tubularSegments]} />
      <torusPointsShaderMaterial
        attach="material"
        ref={shaderMaterialRef}
        key={TorusPointsShaderMaterial.key}
        vertexShader={pointsVertexShader}
        fragmentShader={pointsFragmentShader}
        depthTest={false}
        transparent={true}
      />
    </points>
  )
}

// Precompute the positions of the particles
// const particlesPosition = useMemo(() => {
//   const positions = []
//   for (let j = 0; j < tubularSegments; j++) {
//     const u = (j / tubularSegments) * Math.PI * 2
//     for (let i = 0; i < radialSegments; i++) {
//       const v = (i / radialSegments) * Math.PI * 2

//       const x = (radius + tube * Math.cos(v)) * Math.cos(u)
//       const y = (radius + tube * Math.cos(v)) * Math.sin(u)
//       const z = tube * Math.sin(v)

//       positions.push(x, y, z)
//     }
//   }
//   return new Float32Array(positions)
// }, [radius, tube, radialSegments, tubularSegments])

declare global {
  namespace JSX {
    interface IntrinsicElements {
      torusPointsShaderMaterial: ShaderMaterialProps & Partial<PointsUniforms>
    }
  }
}
