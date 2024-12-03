'use client'
import { useGSAP } from '@gsap/react'
import { PerformanceMonitor, type PerformanceMonitorApi } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import SplitText from 'gsap/dist/SplitText'
import React, { type FC, useState } from 'react'

import PointerCamera from '@/components/PointerCamera'

import HomeBackgroundPlane from './background/HomeBackgroundPlane'
import HomeMain from './main/HomeMain'

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

const MIN_DPR = 0.8
const MAX_DPR = 2

const HomeCanvas: FC = () => {
  const [dpr, setDpr] = useState(1.6)

  const onPerformanceInline = (api: PerformanceMonitorApi) => {
    if (dpr < MAX_DPR) setDpr((prev) => prev + 0.2)
  }

  const onPerformanceDecline = (api: PerformanceMonitorApi) => {
    if (dpr > MIN_DPR) setDpr((prev) => prev - 0.2)
  }

  return (
    <Canvas
      className="!fixed inset-0"
      dpr={dpr}
      gl={{
        antialias: false,
        powerPreference: 'high-performance',
      }}>
      <PerformanceMonitor
        onIncline={onPerformanceInline}
        onDecline={onPerformanceDecline}
        onFallback={onPerformanceDecline}
        flipflops={4}
      />
      <ambientLight intensity={1} />
      <PointerCamera cameraProps={{ far: 25, position: [0, 0, 5] }} intensity={0.04} />
      <HomeBackgroundPlane />
      <HomeMain />
    </Canvas>
  )
}

export default HomeCanvas

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
