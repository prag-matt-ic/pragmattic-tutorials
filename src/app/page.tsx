'use client'
import { Canvas } from '@react-three/fiber'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import logo from '@/assets/brand/pragmattic.svg'
import BackgroundCanvas from '@/components/backgroundCanvas/BackgroundCanvas'
import Button from '@/components/Button'
import WavePlane from '@/components/examples/wavePlane/WavePlane'
import HomeNav, { SectionId } from '@/components/HomeNav'
import ImageSequenceHeader from '@/components/ImageSequenceHeader'
import Marquee from '@/components/Marquee'
import Modal from '@/components/Modal'
import PointerCamera from '@/components/PointerCamera'

export default function HomePage() {
  const [isModalShowing, setIsModalShowing] = useState(false)

  return (
    <>
      <Canvas
        className="!fixed inset-0"
        dpr={2}
        gl={{
          antialias: false,
        }}>
        <ambientLight intensity={2} />
        <WavePlane screenHeights={5} />
        <PointerCamera cameraProps={{ far: 20 }} />
      </Canvas>

      <main className="h-[500vh] w-full bg-black font-sans"></main>
    </>
  )
}
