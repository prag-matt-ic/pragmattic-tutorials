'use client'
import { useGSAP } from '@gsap/react'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import SplitText from 'gsap/dist/SplitText'
import React, { type FC } from 'react'

import PointerCamera from '@/components/PointerCamera'

import HomeBackgroundPlane from './HomeBackgroundPlane'
import Rings from './Rings'

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

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
      <PointerCamera cameraProps={{ far: 25, position: [0, 0, 5] }} intensity={0.04} />
      <ambientLight intensity={1} />
      <HomeBackgroundPlane />
      <Rings />
      {/* TODO: something fun when all of the 3 pillars have been hovered - particles effects? */}
    </>
  )
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
