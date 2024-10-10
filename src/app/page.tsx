'use client'
import Image from 'next/image'

import logo from '@/assets/brand/pragmattic.svg'
import Button from '@/components/Button'
import TestimonialsMarquee from '@/components/Marquee'
import Modal from '@/components/Modal'
import Nav, { SectionId } from '@/components/Nav'
import { useState } from 'react'
import SideMenu from '@/components/SideMenu'

export default function HomePage() {
  const [isModalShowing, setIsModalShowing] = useState(false)

  const [isSideMenuShowing, setIsSideMenuShowing] = useState(false)

  return (
    <main className="w-full bg-off-black font-sans">
      <Nav />
      <section
        id={SectionId.Welcome}
        className="nav-section flex h-[100vh] w-full flex-col items-center justify-center gap-8">
        <Button variant="filled" onClick={() => setIsModalShowing(true)}>
          Open Modal
        </Button>

        <Button variant="filled" onClick={() => setIsSideMenuShowing(true)}>
          Open Menu
        </Button>
        <TestimonialsMarquee />
        <TestimonialsMarquee isReversed />
      </section>

      <section id={SectionId.About} className="nav-section h-[200vh] w-full p-20"></section>

      <section id={SectionId.Services} className="nav-section h-[100vh] w-full p-20"></section>

      <section id={SectionId.Portfolio} className="nav-section h-[200vh] w-full p-20"></section>

      <section id={SectionId.Contact} className="nav-section h-[200vh] w-full p-20"></section>

      <Modal isShowing={isModalShowing} onClose={() => setIsModalShowing(false)} />

      <SideMenu isShowing={isSideMenuShowing} onClose={() => setIsSideMenuShowing(false)} />
    </main>
  )
}
