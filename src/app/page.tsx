'use client'
import { Canvas } from '@react-three/fiber'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import logo from '@/assets/brand/pragmattic.svg'
import { ExamplePathname } from '@/resources/navigation'
import Button from '@/components/Button'

export default function HomePage() {
  return (
    <>
      {/* <Canvas
        className="!fixed inset-0"
        dpr={2}
        gl={{
          antialias: false,
        }}>
        <ambientLight intensity={2} />
        <PointerCamera cameraProps={{ far: 20 }} />
      </Canvas> */}

      <main className="h-lvh w-full bg-black p-16 font-sans">
        <h2 className="my-20 text-white">Something cool, coming soon!</h2>

        <Button variant="outlined" href={ExamplePathname.ImageSequence}>
          Check out the examples
        </Button>
      </main>
    </>
  )
}
