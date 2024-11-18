'use client'
import { useGLTF } from '@react-three/drei'
import React, { type FC, useMemo } from 'react'
import { AdditiveBlending, Mesh, Vector3 } from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'

// Position the particles over the model's surface at random positions
const MeshSamplerParticles: FC = () => {
  // Load our model
  // https://sketchfab.com/3d-models/laurel-tree-low-poly-f1a5baa9d2e24f27a98be75f23f38f35
  // https://sketchfab.com/3d-models/free-porsche-911-carrera-4s-d01b254483794de3819786d93e0e1ebf
  const gltf = useGLTF('/models/black_panther.glb')

  const meshSurfacePositions: Float32Array | null = useMemo(() => {
    if (!gltf.scene) return null

    const particlesCount = 2048 * 2
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

  if (!meshSurfacePositions) return null

  return (
    <>
      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute
            attach="attributes-position"
            array={meshSurfacePositions}
            count={meshSurfacePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          attach="material"
          color="#45F1A6"
          size={0.02}
          opacity={0.3}
          transparent={true}
          sizeAttenuation={true}
          blending={AdditiveBlending}
        />
      </points>
    </>
  )
}

export default MeshSamplerParticles
