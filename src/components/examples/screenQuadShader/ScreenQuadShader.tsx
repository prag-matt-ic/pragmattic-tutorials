'use client'

import { useGSAP } from '@gsap/react'
import { ScreenQuad, shaderMaterial, useTexture } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { useControls } from 'leva'
import React, { type FC, useRef } from 'react'
import { ShaderMaterial, Texture, Vector3 } from 'three'

import { COSINE_COLOUR_PALETTES } from '@/resources/colours'

import gradientFragment from './gradient.frag'
import vertexShader from './screen.vert'
import textureFragment from './texture.frag'
import textureImg from './texture.jpg'
// Boilerplate for creating a screen quad shader - ideal for backgrounds, post-processing effects, etc.

// Remember to register the plugins if using GSAP
gsap.registerPlugin(useGSAP, ScrollTrigger)

enum Type {
  Gradient = 'Gradient',
  Texture = 'Texture',
}

type GradientUniforms = {
  uTime: number
  uScrollProgress: number
  uSpeed: number
  uUvDistortionIterations: number
  uUvDistortionIntensity: number
  uColourPalette: Vector3[]
}

const ScreenQuadShaderGradientMaterial = shaderMaterial(
  {
    uTime: 0,
    uScrollProgress: 0,
    uSpeed: 0.2,
    uUvDistortionIterations: 4,
    uUvDistortionIntensity: 0.16,
    uColourPalette: COSINE_COLOUR_PALETTES['Rainbow'],
  } as GradientUniforms,
  vertexShader,
  gradientFragment,
)

type TextureUniforms = {
  uTime: number
  uAspect: number
  uTexture: Texture | null
}

const ScreenQuadShaderTextureMaterial = shaderMaterial(
  {
    uTime: 0,
    uAspect: 0,
    uTexture: null,
  } as TextureUniforms,
  vertexShader,
  textureFragment,
)

extend({ ScreenQuadShaderGradientMaterial, ScreenQuadShaderTextureMaterial })

type Props = {
  screens: number
}

const ScreenQuadShader: FC<Props> = ({ screens }) => {
  const { colourPalette, speed, distortionIterations, distortionIntensity } = useConfig()
  // const texture = useTexture(textureImg.src)
  // const { viewport } = useThree()
  const gradientShader = useRef<ShaderMaterial & Partial<GradientUniforms>>(null)
  const textureShader = useRef<ShaderMaterial & Partial<TextureUniforms>>(null)
  const scrollProgress = useRef(0)

  useFrame(({ clock }) => {
    if (!gradientShader.current) return
    gradientShader.current.uTime = clock.elapsedTime
    gradientShader.current.uScrollProgress = scrollProgress.current * screens
  })

  // useFrame(({ clock }) => {
  //   if (!textureShader.current) return
  //   textureShader.current.uTime = clock.elapsedTime
  // })

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
        uUvDistortionIterations={distortionIterations}
        uUvDistortionIntensity={distortionIntensity}
        uColourPalette={COSINE_COLOUR_PALETTES[colourPalette]}
      />

      {/* {type === Type.Texture && (
        <screenQuadShaderTextureMaterial
          attach="material"
          key={ScreenQuadShaderTextureMaterial.key}
          ref={textureShader}
          // Uniforms
          uTime={0}
          uAspect={viewport.width / viewport.height}
          uTexture={texture}
        />
      )} */}
    </ScreenQuad>
  )
}

export default ScreenQuadShader

function useConfig() {
  // Config for the shader
  const { colourPalette, speed, distortionIterations, distortionIntensity } = useControls({
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

  return { colourPalette, speed, distortionIterations, distortionIntensity }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      screenQuadShaderGradientMaterial: ShaderMaterialProps & GradientUniforms
      screenQuadShaderTextureMaterial: ShaderMaterialProps & TextureUniforms
    }
  }
}
