---
title: 'ScreenQuad shader boilerplate for Next.js + Typescript'
date: '2024-11-12'
tags: 'parallax, js'
youTubeUrl: ''
exampleUrl: '/examples/screen-quad-shader'
githubUrl: ''
---

## A fullscreen shader can be used to create cool backgrounds and fullscreen visuals

Using a ScreenQuad over a Plane has performance advantages ...

but you need to set up the vertex shader differently in order for it to work.

In this example I'll share the Typescript safe code for getting started with a <ScreenQuad/> in a Next.js website using React Three Fiber and drei shaderMaterial.

## Configuring Typescript for Shader files

Create a root 'shader.d.ts' file for importing GLSL files without error.

This declaration file informs Typescript that .frag, .vert and .glsl files should be treated as strings.

```typescript
// shader.d.ts

declare module '*.frag' {
  const value: string
  export default value
}

declare module '*.vert' {
  const value: string
  export default value
}

declare module '*.glsl' {
  const value: string
  export default value
}
```

## React Component Structure

Below is the boilerplate for creating a screen quad fragment shader.

- Uniforms are defined as a type
- The shader ref has the correct type (ShaderMaterial & Partial<Uniforms>)
- The custom JSX element (screenQuadShaderMaterial) is defined at the bottom

```jsx
// ScreenQuadShader.tsx
'use client'

import { ScreenQuad, shaderMaterial, useTexture } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame, useThree } from '@react-three/fiber'
import React, { type FC, useRef } from 'react'
import { ShaderMaterial, Texture } from 'three'

import fragmentShader from './screen.frag'
import vertexShader from './screen.vert'
import textureImg from './texture.jpg'


type Uniforms = {
  uTime: number
  uAspect: number
  uTexture: Texture | null
}

const INITIAL_UNIFORMS: Uniforms = {
  uTime: 0,
  uAspect: 1,
  uTexture: null,
}

const ScreenQuadShaderMaterial = shaderMaterial(INITIAL_UNIFORMS, vertexShader, fragmentShader)

extend({ ScreenQuadShaderMaterial })

const ScreenQuadShader: FC = () => {
  const texture = useTexture(textureImg.src)
  const { viewport } = useThree()
  const shader = useRef<ShaderMaterial & Partial<Uniforms>>(null)

  useFrame(({ clock }) => {
    if (!shader.current) return
    shader.current.uTime = clock.elapsedTime
  })

  return (
    <ScreenQuad>
      <screenQuadShaderMaterial
        key={ScreenQuadShaderMaterial.key}
        ref={shader}
        // Uniforms
        uTime={0}
        uAspect={viewport.aspect}
        uTexture={texture}
      />
    </ScreenQuad>
  )
}

export default ScreenQuadShader

declare global {
  namespace JSX {
    interface IntrinsicElements {
      screenQuadShaderMaterial: ShaderMaterialProps & Uniforms
    }
  }
}
```

### Vertex Shader for ScreenQuad component

By removing transformation matrices, the vertex shader becomes more efficient

```glsl
// screen.vert
// Vertex shader for <ScreenQuad />

varying vec2 vUv;

void main() {
    vUv = position.xy * 0.5 + 0.5; // Map NDC to UV coordinates
    gl_Position = vec4(position.xy, 0.0, 1.0); // Use NDC position
}
```

### Fragment Shader for simple tiled texture

In this fragment shader we are receiving the texture and viewport aspect ratio as uniforms.
We can then create aspect ratio adjusted uv coordinates, and by getting the fractional (fract) value of that, we're able to tile the image.
The texture colour is then sampled using the adjusted uv value.

```glsl
// screen.frag
// Fragment shader

uniform sampler2D uTexture;
uniform float uTime;
uniform float uAspect;

varying vec2 vUv;

void main() {

  vec2 textureUv = vUv * 2.0; // Scale the texture (optional)
  textureUv.x *= uAspect; // Correct aspect ratio
  textureUv = fract(textureUv); // Repeat the texture

  // Sample using adjusted uv value
  vec4 textureColour = texture2D(uTexture, textureUv);

  gl_FragColor = textureColour;
}
```

### Fragment Shader for organic animated background gradient
