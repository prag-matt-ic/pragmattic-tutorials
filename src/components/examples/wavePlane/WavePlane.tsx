'use client'
// import { useTexture } from "@react-three/drei";
import { useGSAP } from '@gsap/react'
import { shaderMaterial } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import { COSINE_GRADIENTS, type CosineGradientPreset } from '@thi.ng/color'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/src/ScrollTrigger'
import { useControls } from 'leva'
import React, { type FC, useMemo, useRef } from 'react'
import { ShaderMaterial, Vector3 } from 'three'

import fragmentShader from './wavePlane.frag'
import vertexShader from './wavePlane.vert'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Blog Post
// https://blog.maximeheckel.com/posts/vaporwave-3d-scene-with-threejs/

type Uniforms = {
  uTime: number
  uScrollOffset: number
  uColourPalette: Vector3[]
  uShowGrid: boolean
  uGridSize: number
}

const DEFAULT_COLOUR_PALETTE: Vector3[] = COSINE_GRADIENTS['heat1'].map((color) => new Vector3(...color))

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uScrollOffset: 0,
  uColourPalette: DEFAULT_COLOUR_PALETTE,
  uShowGrid: true,
  uGridSize: 16,
}

const WavePlaneShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, fragmentShader)

extend({ WavePlaneShaderMaterial })

const WavePlane: FC<{ screenHeights: number }> = ({ screenHeights }) => {
  const viewport = useThree((s) => s.viewport)

  const planeWidth = useMemo(() => Math.round(viewport.width + 2), [viewport.width])
  const planeHeight = useMemo(() => Math.round(viewport.height * 2), [viewport.height])
  const planeSize = useMemo(() => Math.max(planeWidth, planeHeight), [planeWidth, planeHeight])
  const planeSegments = useMemo(() => planeSize * 32, [planeSize])

  const shaderMaterial = useRef<ShaderMaterial & Uniforms>(null)
  const scrollProgress = useRef(0)

  useFrame(({ clock }) => {
    if (!shaderMaterial.current) return
    shaderMaterial.current.uTime = clock.elapsedTime
    shaderMaterial.current.uScrollOffset = scrollProgress.current * screenHeights
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

  const { colourPalette, showGrid, gridSize } = useConfig()

  return (
    <mesh position={[0, -viewport.height / 2.5, -1]} rotation={[-0.5 * Math.PI, 0, 0]}>
      <planeGeometry args={[planeSize, planeSize, planeSegments, planeSegments]} />
      <wavePlaneShaderMaterial
        ref={shaderMaterial}
        key={WavePlaneShaderMaterial.key}
        depthTest={false}
        transparent={false}
        uTime={0}
        uScrollOffset={0}
        uColourPalette={colourPalette}
        uShowGrid={showGrid}
        uGridSize={gridSize}
      />
    </mesh>
  )
}

function useConfig() {
  // Config for the shader
  const { paletteKey, showGrid, gridSize } = useControls({
    paletteKey: {
      label: 'Palette',
      value: 'heat1' as CosineGradientPreset,
      options: Object.keys(COSINE_GRADIENTS),
    },
    showGrid: {
      label: 'Grid',
      value: true,
    },
    gridSize: {
      label: 'Grid Size',
      value: 16.0,
      step: 1,
      min: 1,
      max: 48,
    },
  })

  const colourPaletteVec3 = COSINE_GRADIENTS[paletteKey as CosineGradientPreset].map((color) => new Vector3(...color))

  return { colourPalette: colourPaletteVec3, showGrid, gridSize }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      wavePlaneShaderMaterial: ShaderMaterialProps & Uniforms
    }
  }
}

export default WavePlane
