'use client'
import { useGSAP } from '@gsap/react'
import { Billboard, OrthographicCamera, Plane, Sphere, Stats, Torus, useFBO } from '@react-three/drei'
import { ScreenQuad, shaderMaterial, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { extend, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import SplitText from 'gsap/dist/SplitText'
import React, { type FC, useRef } from 'react'
import { BufferGeometry, Group, Mesh, NormalBufferAttributes, ShaderMaterial } from 'three'

import PointerCamera from '@/components/PointerCamera'
import { HeaderSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'

import bgFragment from './background.frag'
import bgVertex from './background.vert'
import SkillPill from './SkillPill'

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

const CAMERA_FAR = 20 as const
const CAMERA_NEAR = 0.001 as const

const HomeCanvas: FC = () => {
  return (
    <Canvas
      className="!fixed inset-0"
      dpr={window.devicePixelRatio}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
      }}>
      <MainScene />
    </Canvas>
  )
}

export default HomeCanvas

const MainScene: FC = () => {
  return (
    <>
      <PointerCamera cameraProps={{ far: CAMERA_FAR, near: CAMERA_NEAR, position: [0, 0, 5] }} intensity={0.04} />
      <ambientLight intensity={1} />
      <BackgroundPlane />
      <Rings />

      {/* TODO: something fun when all of the 3 pillars have been hovered - particles effects? */}
    </>
  )
}

const Rings: FC = () => {
  const group = useRef<Group>(null)
  const sphere = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)
  const torus = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)
  const torus2 = useRef<Mesh<BufferGeometry<NormalBufferAttributes>>>(null)
  const setHasScrolledIntoView = useHomeSceneStore((s) => s.setHasScrolledIntoView)

  // Translate the group in as the header text moves out
  useGSAP(() => {
    if (!group.current) return

    gsap.fromTo(
      group.current.position,
      { z: -15 },
      {
        ease: 'power1.in',
        z: 0,
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
    if (!torus.current || !torus2.current) return
    // Rotate the torus

    gsap.fromTo(
      torus.current.rotation,
      { y: 0, x: 0 },
      {
        ease: 'none',
        y: Math.PI * 4, // Rotate 720 degrees in radians
        x: -Math.PI * 2, // Rotate 360 degrees in radians
        duration: 5,
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
        duration: 7,
        repeat: -1,
      },
    )
  }, [])

  return (
    <group ref={group} position={[0, 0, -15]}>
      {/* TODO: Create custom shader material for the sphere and rings */}
      {/* Fade them in and out based on depth */}
      {/* Highlight them when the active section is hovered */}

      <Sphere ref={sphere} args={[0.2, 32, 32]} position={[0, 0, 0]}>
        <pointLight position={[0, 0, 0]} intensity={2} color={'#fff'} />
        <meshBasicMaterial color="#fff" />
      </Sphere>

      <Torus ref={torus} args={[0.6, 0.1, 16, 80]} position={[0, 0, 0]} castShadow={true}>
        <meshLambertMaterial color="#37F3FF" />
      </Torus>

      <Torus ref={torus2} args={[1, 0.1, 16, 80]} position={[0, 0, 0]} receiveShadow={true}>
        <meshLambertMaterial color="#37FFA8" />
      </Torus>

      <Billboard position={[-1.1, 1, 1]}>
        <SkillPill section={HeaderSection.Purpose} />
      </Billboard>

      <Billboard position={[1.1, 0, 2]}>
        <SkillPill section={HeaderSection.Design} />
      </Billboard>

      <Billboard position={[0, -1.4, 1]}>
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

const BackgroundPlane: FC = () => {
  const { viewport } = useThree()
  const shader = useRef<ShaderMaterial & Partial<Uniforms>>(null)
  const activeSection = useHomeSceneStore((s) => s.activeSection)

  useFrame(({ clock }) => {
    if (!shader.current) return
    shader.current.uTime = clock.elapsedTime
  })

  return (
    <Plane args={[viewport.width * 4, viewport.height * 4, 1, 1]} position={[0, 0, -12]}>
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

// type HomeEffectsUniforms = {
//   uTime: number
//   uFar: number
//   uNear: number
//   uResolution: [number, number]
//   uSceneTexture: Texture | null
//   uDepthTexture: Texture | null
// }

// const EFFECTS_INITIAL_UNIFORMS: HomeEffectsUniforms = {
//   uTime: 0,
//   uFar: CAMERA_FAR,
//   uNear: CAMERA_NEAR,
//   uResolution: [0, 0],
//   uSceneTexture: null,
//   uDepthTexture: null,
// }

// const HomeEffectsShader = shaderMaterial(EFFECTS_INITIAL_UNIFORMS, effectsVertex, effectsFragment)

// extend({ HomeEffectsShader })

// const CustomEffects: FC<PropsWithChildren> = ({ children }) => {
//   const { viewport, size } = useThree()
//   const material = useRef<ShaderMaterial & Partial<HomeEffectsUniforms>>(null)

//   const FBOscene = useMemo(() => new Scene(), [])
//   const depthTexture = useMemo(() => {
//     const dt = new DepthTexture(size.width, size.height)
//     dt.type = UnsignedShortType
//     dt.minFilter = NearestFilter
//     dt.magFilter = NearestFilter
//     return dt
//   }, [size.width, size.height])

//   const renderTarget = useFBO(size.width, size.height, {
//     stencilBuffer: false,
//     format: RGBAFormat,
//     type: UnsignedByteType,
//     depth: true,
//     depthTexture: depthTexture,
//   })

//   const perspectiveCamera = useRef<any>(null)
//   const orthographiCamera = useRef<any>(null)

//   useFrame(({ gl, scene, camera, clock }) => {
//     if (!material.current) return

//     // Render the FBO scene (offscreen) into the render target
//     gl.setRenderTarget(renderTarget)
//     gl.render(FBOscene, perspectiveCamera.current)
//     gl.setRenderTarget(null)
//     // Update the shader uniforms
//     material.current.uSceneTexture = renderTarget.texture
//     material.current.uDepthTexture = renderTarget.depthTexture
//     material.current.uTime = clock.elapsedTime
//     // Render the effects scene (default scene) using the effects shader

//     gl.render(scene, orthographiCamera.current)
//   })

//   return (
//     <>
//       {createPortal(children, FBOscene)}
//       <PointerCamera
//         ref={perspectiveCamera}
//         cameraProps={{ far: CAMERA_FAR, near: CAMERA_NEAR, position: [0, 0, 5] }}
//       />
//       <OrthographicCamera ref={orthographiCamera} makeDefault={true} position={[0, 0, 1]} />
//       <ScreenQuad>
//         <homeEffectsShader
//           attach="material"
//           key={HomeEffectsShader.key}
//           ref={material}
//           uTime={0}
//           uFar={CAMERA_FAR}
//           uNear={CAMERA_NEAR}
//           uResolution={[viewport.width, viewport.height]}
//           uSceneTexture={null}
//           uDepthTexture={null}
//         />
//       </ScreenQuad>
//     </>
//   )
// }
