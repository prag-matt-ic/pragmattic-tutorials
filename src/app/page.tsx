'use client'
import Image from 'next/image'
import { useState } from 'react'

import logo from '@/assets/brand/pragmattic.svg'
import Button from '@/components/Button'
import HomeNav, { SectionId } from '@/components/HomeNav'
import ImageSequenceHeader from '@/components/ImageSequenceHeader'
import TestimonialsMarquee from '@/components/Marquee'
import Modal from '@/components/Modal'
import SideMenu from '@/components/SideMenu'
import BackgroundCanvas from '@/components/threejs/BackgroundCanvas'

export default function HomePage() {
  const [isModalShowing, setIsModalShowing] = useState(false)
  const [isSideMenuShowing, setIsSideMenuShowing] = useState(false)

  return (
    <>
      <BackgroundCanvas />

      <main className="w-full bg-black font-sans">
        <nav className="fixed left-6 top-4 z-50">
          <Image src={logo} alt="Pragmattic" width={120} />
        </nav>
        <HomeNav />

        <ImageSequenceHeader />

        <section
          id={SectionId.Welcome}
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
      </main>
    </>
  )
}
