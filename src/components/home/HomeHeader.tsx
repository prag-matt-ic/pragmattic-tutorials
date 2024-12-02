'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, { type FC, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const HomeHeader: FC = () => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: '#home-header',
            start: 0,
            end: 1400,
            scrub: true,
            fastScrollEnd: true,
            pin: container.current,
          },
        })
        .to('h1', {
          scale: 1.16,
          opacity: 0,
          duration: 0.3,
        })
        .to('h2', {
          keyframes: [
            { scale: 0.9, opacity: 1, duration: 0.2 },
            { scale: 1, opacity: 0, duration: 0.1 },
          ],
        })
    },
    { scope: container, dependencies: [] },
  )

  return (
    <header
      ref={container}
      id="home-header"
      className="pointer-events-none flex h-lvh w-full select-none flex-col items-center justify-center px-4 text-center text-white">
      <h1 className="relative max-w-4xl text-2xl font-extrabold !leading-[1.25] tracking-tight md:text-6xl xl:text-7xl">
        Helping innovative thinkers bring big ideas to life
      </h1>
      <h2 className="absolute max-w-4xl scale-75 text-xl font-extrabold !leading-[1.25] tracking-tight opacity-0 md:text-6xl xl:text-7xl">
        with purposeful design and engineering
      </h2>
    </header>
  )
}

export default HomeHeader
