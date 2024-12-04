'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, { type FC, useRef } from 'react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const HEADER_SCROLL_END = 1000 as const

const HomeHeader: FC = () => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            start: 0,
            trigger: container.current,
            end: 'bottom top',
            scrub: true,
            fastScrollEnd: true,
            pin: '#home-header',
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
    <div className="pointer-events-none relative z-20 h-[1000px] w-full" ref={container}>
      <header
        id="home-header"
        className="pointer-events-none flex h-lvh w-full select-none flex-col items-center justify-center px-4 text-center text-white">
        <h1 className="relative max-w-4xl text-2xl font-extrabold !leading-[1.3] tracking-tight md:text-6xl xl:text-7xl">
          Helping innovative thinkers bring big ideas to life
        </h1>
        <h2 className="absolute max-w-4xl scale-75 text-2xl font-extrabold !leading-[1.3] tracking-tight opacity-0 md:text-6xl xl:text-7xl">
          with purposeful design and engineering
        </h2>
      </header>
    </div>
  )
}

export default HomeHeader
