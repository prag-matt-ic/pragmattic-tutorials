'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import React, { type FC, useRef } from 'react'

const HomeHeader: FC = () => {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // TODO: Transition in
      gsap
        .timeline({
          scrollTrigger: {
            start: 0,
            end: 'max',
            scrub: true,
            fastScrollEnd: true,
            pin: container.current,
          },
        })
        .to('h1', {
          keyframes: [{ scale: 1.1 }, { scale: 1.2, opacity: 0 }],
          duration: 0.5,
        })
        .to(
          'h2',
          {
            keyframes: [
              { scale: 0.9, opacity: 1, duration: 0.2 },
              { scale: 1, opacity: 0, duration: 0.1 },
            ],
          },
          '+=0.05',
        )
    },
    { scope: container, dependencies: [] },
  )

  return (
    <header
      ref={container}
      className="flex h-lvh w-full select-none flex-col items-center justify-center text-center text-white">
      <h1 className="relative max-w-4xl text-8xl font-bold leading-[1.1] tracking-tight">
        Helping innovative thinkers bring big ideas to life
      </h1>
      <h2 className="absolute max-w-3xl scale-75 text-6xl font-bold leading-[1.1] tracking-tight opacity-0">
        through design and engineering
      </h2>
    </header>
  )
}

export default HomeHeader
