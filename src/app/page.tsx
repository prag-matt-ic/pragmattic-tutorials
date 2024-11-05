'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import logo from '@/assets/brand/pragmattic.svg'
import Button from '@/components/Button'
import HomeNav, { SectionId } from '@/components/HomeNav'
import ImageSequenceHeader from '@/components/ImageSequenceHeader'
import TestimonialsMarquee from '@/components/Marquee'
import Modal from '@/components/Modal'
import SideMenu from '@/components/SideMenu'
import BackgroundCanvas from '@/components/threejs/backgroundCanvas/BackgroundCanvas'

export default function HomePage() {
  const [isModalShowing, setIsModalShowing] = useState(false)
  const [isSideMenuShowing, setIsSideMenuShowing] = useState(false)

  return (
    <>
      <BackgroundCanvas />

      <main className="w-full bg-black font-sans">
        <nav className="fixed left-6 top-4 z-50">
          <Link href="/">
            <Image src={logo} alt="Pragmattic" width={120} />
          </Link>
        </nav>
        <HomeNav />

        <ImageSequenceHeader />

        <section
          id={SectionId.Welcome}
          className="nav-section relative flex h-screen w-full flex-col items-center justify-center gap-10">
          <h2 className="text-3xl font-bold text-white">Next.js Tailwind Buttons</h2>
          <p className="max-w-3xl text-white/80">
            Lightweight buttons which can accept onClick or href props. The buttons are styled using Tailwind CSS and
            can be customised with size, variant, and colour.
          </p>
          <div className="grid grid-cols-3 gap-8">
            {/* Primary */}
            <Button variant="filled" colour="primary" onClick={() => setIsModalShowing(true)}>
              Primary Filled
            </Button>

            <Button variant="outlined" colour="primary" onClick={() => setIsSideMenuShowing(true)}>
              Primary Outlined
            </Button>

            <Button variant="text" colour="primary" onClick={() => setIsSideMenuShowing(true)}>
              Text button
            </Button>

            {/* Secondary */}
            <Button variant="filled" colour="secondary" onClick={() => setIsModalShowing(true)}>
              Filled Button
            </Button>

            <Button variant="outlined" colour="secondary" onClick={() => setIsSideMenuShowing(true)}>
              Open Menu
            </Button>

            <Button variant="text" colour="secondary" onClick={() => setIsSideMenuShowing(true)}>
              Text button
            </Button>
          </div>
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
