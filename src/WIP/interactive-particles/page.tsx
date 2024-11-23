'use client'
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { type FC } from 'react'

// import InstancedParticles from '@/components/instances/Instances'
// import BasicParticles from '@/components/particles/basicParticles/BasicParticles'
// import FBOParticles from '@/components/particles/fboParticles/FBOParticles'
// import MeshSamplerParticles from '@/components/particles/meshSamplerParticles/MeshSamplerParticles'
// import ParallaxParticles from '@/components/particles/parallaxParticles/ParallaxParticles'
import PointerCamera from '@/components/PointerCamera'

export default function Page() {
  // Inspiration: https://dala.craftedbygc.com/
  return (
    <main className="w-full bg-black font-sans">
      {/* ThreeJS content */}
      <Canvas
        className="!fixed inset-0"
        dpr={2}
        gl={{
          alpha: false,
          antialias: false,
          powerPreference: 'high-performance',
        }}>
        {/* <Environment files="/images/environment/sky.hdr" background={true} backgroundBlurriness={0.05} ground={false} /> */}
        <ambientLight intensity={1} />
        <pointLight position={[0, 4, 10]} intensity={10} />
        {/* Part 1 - Basic Particles */}
        {/* <BasicParticles /> */}

        {/* Part 2 - Parallax Particles for background */}
        {/* <ParallaxParticles /> */}

        {/* Part 3 - Instanced Mesh particles for 3D particles */}
        {/* <InstancedParticles /> */}

        {/* Part 2 - Mesh Particles */}
        {/* <MeshSamplerParticles /> */}
        {/* Part 3 - Animating particles */}
        {/* <FBOParticles /> */}

        <PointerCamera cameraProps={{ position: [0, 0, 7] }} />

        {/* <MeshParticles2 /> */}
        {/* <OrbitControls /> */}
      </Canvas>
      <header
        id="header"
        className="pointer-events-none relative z-50 grid h-svh w-full grid-cols-2 items-center horizontal-padding">
        <div className="space-y-3 text-white">
          <h1 className="text-8xl">I am machine.</h1>
          <h2 className="text-3xl">I am not human</h2>
        </div>
      </header>
      <section
        id="section"
        className="pointer-events-none relative z-50 grid h-svh w-full grid-cols-2 items-center horizontal-padding"></section>
    </main>
  )
}
