'use client'

import { useGSAP } from '@gsap/react'
import { ScreenQuad, shaderMaterial } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { useControls } from 'leva'
import React, { type FC, useRef } from 'react'
import { ShaderMaterial, Vector3 } from 'three'

import { COSINE_COLOUR_PALETTES } from '@/resources/colours'

import gradientFragment from './gradient.frag'
import vertexShader from './screen.vert'
// import textureFragment from './texture.frag'
// import textureImg from './texture.jpg'

// Boilerplate for creating a screen quad shader - ideal for backgrounds, post-processing effects, etc.

// Remember to register the plugins if using GSAP
gsap.registerPlugin(useGSAP, ScrollTrigger)

type Uniforms = {
  uTime: number
  uScrollProgress: number
  uSpeed: number
  uUvScale: number
  uUvDistortionIterations: number
  uUvDistortionIntensity: number
  uColourPalette: Vector3[]
}

const ScreenQuadShaderGradientMaterial = shaderMaterial(
  {
    uTime: 0,
    uScrollProgress: 0,
    uSpeed: 0.2,
    uUvScale: 1,
    uUvDistortionIterations: 4,
    uUvDistortionIntensity: 0.16,
    uColourPalette: COSINE_COLOUR_PALETTES['Rainbow'],
  } as Uniforms,
  vertexShader,
  gradientFragment,
)

extend({ ScreenQuadShaderGradientMaterial })

type Props = {
  screens: number
}

const ScreenQuadShader: FC<Props> = ({ screens }) => {
  const { colourPalette, speed, scale, distortionIterations, distortionIntensity } = useConfig()
  const gradientShader = useRef<ShaderMaterial & Partial<Uniforms>>(null)
  const scrollProgress = useRef(0)

  useFrame(({ clock }) => {
    if (!gradientShader.current) return
    gradientShader.current.uTime = clock.elapsedTime
    gradientShader.current.uScrollProgress = scrollProgress.current * screens
  })

  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: ({ progress }) => {
        scrollProgress.current = progress
      },
    })
  }, [])

  return (
    <ScreenQuad>
      <screenQuadShaderGradientMaterial
        key={ScreenQuadShaderGradientMaterial.key}
        ref={gradientShader}
        // Uniforms
        uTime={0}
        uScrollProgress={0}
        uSpeed={speed}
        uUvScale={scale}
        uUvDistortionIterations={distortionIterations}
        uUvDistortionIntensity={distortionIntensity}
        uColourPalette={COSINE_COLOUR_PALETTES[colourPalette]}
      />
    </ScreenQuad>
  )
}

export default ScreenQuadShader

function useConfig() {
  // Config for the shader
  const { colourPalette, speed, scale, distortionIterations, distortionIntensity } = useControls({
    // Only available for the gradient shader
    colourPalette: {
      label: 'Palette',
      value: 'Rainbow',
      options: Object.keys(COSINE_COLOUR_PALETTES),
    },
    speed: {
      label: 'Speed',
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.05,
    },
    scale: {
      label: 'Scale',
      value: 1,
      min: 0.1,
      max: 4,
      step: 0.1,
    },
    distortionIterations: {
      label: 'Iterations',
      value: 6,
      min: 0,
      max: 16,
      step: 1,
    },
    distortionIntensity: {
      label: 'Intensity',
      value: 0.3,
      min: 0,
      max: 1,
      step: 0.01,
      render: (get) => get('distortionIterations') > 0,
    },
  })

  return { colourPalette, speed, scale, distortionIterations, distortionIntensity }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      screenQuadShaderGradientMaterial: ShaderMaterialProps & Uniforms
    }
  }
}

// type TextureUniforms = {
//   uTime: number
//   uAspect: number
//   uTexture: Texture | null
// }

// const ScreenQuadShaderTextureMaterial = shaderMaterial(
//   {
//     uTime: 0,
//     uAspect: 0,
//     uTexture: null,
//   } as TextureUniforms,
//   vertexShader,
//   textureFragment,
// )
