'use client'
import Image from 'next/image'

import logo from '@/assets/brand/pragmattic.svg'
import Button from '@/components/Button'
import TestimonialsMarquee from '@/components/Marquee'
import Nav, { SectionId } from '@/components/Nav'

export default function HomePage() {
  return (
    <main className="w-full bg-off-black font-sans">
      <Nav />
      {/* <header className="flex w-full items-center justify-center">
        <Image src={logo} alt="Pragmattic" height={40} />
      </header> */}
      {/* <section>
        <Button variant="filled" onClick={() => {}}>
          Press me
        </Button>
      </section> */}
      <section
        id={SectionId.Welcome}
        className="nav-section flex h-[100vh] w-full flex-col items-center justify-center gap-8">
        <TestimonialsMarquee />
        <TestimonialsMarquee isReversed />
      </section>

      <section id={SectionId.About} className="nav-section h-[200vh] w-full p-20"></section>

      <section id={SectionId.Services} className="nav-section h-[100vh] w-full p-20"></section>

      <section id={SectionId.Portfolio} className="nav-section h-[200vh] w-full p-20"></section>

      <section id={SectionId.Contact} className="nav-section h-[200vh] w-full p-20"></section>
    </main>
  )
}
