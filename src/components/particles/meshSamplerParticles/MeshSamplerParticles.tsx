'use client'
import { shaderMaterial, useGLTF } from '@react-three/drei'
import { extend, type ShaderMaterialProps, useFrame } from '@react-three/fiber'
import React, { type FC, useMemo, useRef } from 'react'
import { AdditiveBlending, Mesh, ShaderMaterial, Vector3 } from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'

import particleFragment from './particle.frag'
import particleVertex from './particle.vert'

// Particle shader material
type Uniforms = {
  uTime: number
}

const INITIAL_BG_UNIFORMS: Uniforms = {
  uTime: 0,
}

const MeshSamplerShaderMaterial = shaderMaterial(INITIAL_BG_UNIFORMS, particleVertex, particleFragment)

extend({ MeshSamplerShaderMaterial })

// Position the particles over the model's surface at random positions
const MeshSamplerParticles: FC = () => {
  // Load our model
  // https://sketchfab.com/3d-models/laurel-tree-low-poly-f1a5baa9d2e24f27a98be75f23f38f35
  // https://sketchfab.com/3d-models/free-porsche-911-carrera-4s-d01b254483794de3819786d93e0e1ebf
  const gltf = useGLTF('/models/tree2.glb')

  const meshPositions: Float32Array | null = useMemo(() => {
    if (!gltf.scene) return null

    const particlesCount = 1024
    const positions = new Float32Array(particlesCount * 3)

    // Find the mesh in the GLTF scene
    gltf.scene.traverse((object) => {
      if (object instanceof Mesh) {
        // https://threejs.org/docs/index.html#examples/en/math/MeshSurfaceSampler
        // Create a MeshSurfaceSampler
        const sampler = new MeshSurfaceSampler(object).build()
        const position = new Vector3()

        for (let i = 0; i < particlesCount; i++) {
          // Sample the mesh surface and set the position
          sampler.sample(position)
          positions[i * 3] = position.x
          positions[i * 3 + 1] = position.y
          positions[i * 3 + 2] = position.z
        }
      }
    })

    return positions
  }, [gltf.scene])

  const particlesShader = useRef<ShaderMaterial & Uniforms>(null)

  useFrame(({ gl, clock, pointer }) => {
    if (!particlesShader.current) return
    particlesShader.current.uTime = clock.elapsedTime
  })

  if (!meshPositions) return null

  return (
    <>
      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={meshPositions}
            count={meshPositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <meshSamplerShaderMaterial
          attach="material"
          key={MeshSamplerShaderMaterial.key}
          ref={particlesShader}
          uTime={0}
          depthTest={false}
          transparent={true}
          blending={AdditiveBlending}
        />
      </points>
    </>
  )
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshSamplerShaderMaterial: ShaderMaterialProps & Uniforms
    }
  }
}

export default MeshSamplerParticles
