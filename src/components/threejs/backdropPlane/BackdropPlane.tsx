'use client'
import { useGSAP } from '@gsap/react'
import { Plane, shaderMaterial, useTexture } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, { type FC, useRef } from 'react'
import { Color, ShaderMaterial, Texture } from 'three'

// Create custom shader.d.ts file for .vert and .frag files
import fragmentShader from './backdropPlane.frag'
import vertexShader from './backdropPlane.vert'
import textureImg from './texture.jpg'

// Ensure packages are installed: "npm install @react-three/drei @react-three/fiber three raw-loader glslify-loader glslify glsl-noise"
// Setup Next.js config for handling glsl files

type Uniforms = {
  uTime: number
  uAspectRatio: number
  uScrollOffset: number
  uLightColour: Color
  uDarkColour: Color
  uTexture: Texture | null
}

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uAspectRatio: 1,
  uScrollOffset: 0,
  uLightColour: new Color('#2E2A37').convertLinearToSRGB(),
  uDarkColour: new Color('#0A090C').convertLinearToSRGB(),
  uTexture: null,
}

const BackdropPlaneShader = shaderMaterial(INITIAL_UNIFORMS, vertexShader, fragmentShader)

extend({ BackdropPlaneShader })

const BackdropPlane: FC = () => {
  const texture = useTexture(textureImg.src)
  const { viewport } = useThree()
  const shader = useRef<ShaderMaterial & Partial<Uniforms>>(null)
  const scrollOffset = useRef(0)

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: ({ progress }) => {
        scrollOffset.current = progress
      },
    })
  }, [])

  useFrame(({ clock }) => {
    if (!shader.current) return
    shader.current.uTime = clock.elapsedTime
    shader.current.uScrollOffset = scrollOffset.current
  })

  return (
    <Plane args={[viewport.width, viewport.height, 1, 1]} position={[0, 0, 0]}>
      <backdropPlaneShader
        key={BackdropPlaneShader.key}
        ref={shader}
        uTime={0}
        uScrollOffset={0}
        uAspectRatio={viewport.aspect}
        uLightColour={INITIAL_UNIFORMS.uLightColour}
        uDarkColour={INITIAL_UNIFORMS.uDarkColour}
        uTexture={texture}
      />
    </Plane>
  )
}
export default BackdropPlane

declare global {
  namespace JSX {
    interface IntrinsicElements {
      backdropPlaneShader: ShaderMaterialProps & Uniforms
    }
  }
}
