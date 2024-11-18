'use client'
import { Canvas } from '@react-three/fiber'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import logo from '@/assets/brand/pragmattic.svg'
import Button from '@/components/Button'
import WavePlane from '@/components/examples/wavePlane/WavePlane'
import HomeNav, { SectionId } from '@/components/HomeNav'
import ImageSequenceHeader from '@/components/ImageSequenceHeader'
import Marquee from '@/components/Marquee'
import Modal from '@/components/Modal'
<<<<<<< Updated upstream
import SideMenu from '@/components/SideMenu'
import BackgroundCanvas from '@/components/threejs/backgroundCanvas/BackgroundCanvas'
=======
import PointerCamera from '@/components/PointerCamera'
>>>>>>> Stashed changes

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
        <WavePlane />
        <PointerCamera cameraProps={{ far: 20 }} />
      </Canvas>

      <main className="h-[500vh] w-full bg-black font-sans">
        {/* <HomeNav /> */}

        {/* <ImageSequenceHeader /> */}

        {/* <section
          id={SectionId.Welcome}
<<<<<<< Updated upstream
          className="nav-section relative flex h-[100vh] w-full flex-col items-center justify-center gap-8">
          <Button variant="filled" hoverEmoji="💚" onClick={() => setIsModalShowing(true)}>
            Open Modal
          </Button>

          <Button variant="filled" onClick={() => setIsSideMenuShowing(true)}>
            Open Menu
          </Button>
        </section>

        <section id={SectionId.About} className="nav-section relative h-[200vh] w-full p-20">
          <TestimonialsMarquee />
          <TestimonialsMarquee isReversed className="mt-8" />
        </section>

        <section id={SectionId.Services} className="nav-section h-[100vh] w-full p-20"></section>

        <section id={SectionId.Portfolio} className="nav-section h-[200vh] w-full p-20"></section>

        <section id={SectionId.Contact} className="nav-section h-[200vh] w-full p-20"></section>

        <Modal isShowing={isModalShowing} onClose={() => setIsModalShowing(false)} />

        <SideMenu isShowing={isSideMenuShowing} onClose={() => setIsSideMenuShowing(false)} />
=======
          className="nav-section relative flex h-screen w-full flex-col items-center justify-center gap-10"></section> */}

        {/* <section id={SectionId.About} className="nav-section relative h-[200vh] w-full p-20"></section> */}

        {/* <section id={SectionId.Services} className="nav-section h-[100vh] w-full p-20"></section> */}

        {/* <section id={SectionId.Portfolio} className="nav-section h-[200vh] w-full p-20"></section> */}

        {/* <section id={SectionId.Contact} className="nav-section h-[200vh] w-full p-20"></section> */}

        {/* <Modal isShowing={isModalShowing} onClose={() => setIsModalShowing(false)} /> */}
>>>>>>> Stashed changes
      </main>
    </>
  )
}
