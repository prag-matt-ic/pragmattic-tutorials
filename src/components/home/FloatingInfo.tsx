'use client'

import { flip, offset, shift, useFloating } from '@floating-ui/react'
import { useGSAP } from '@gsap/react'
import { Html } from '@react-three/drei'
import gsap from 'gsap'
import SplitText from 'gsap/dist/SplitText'
import { type FC, type ReactNode, useRef } from 'react'
import { Transition } from 'react-transition-group'
import { twJoin } from 'tailwind-merge'

import { SceneSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'

type Props = {
  section: SceneSection
}

const CONFIG: Record<
  SceneSection,
  {
    overlineClass: string
    heading: ReactNode
    paragraph: ReactNode
  }
> = {
  [SceneSection.Purpose]: {
    overlineClass: 'text-green',
    heading: 'Use technology to improve human performance',
    paragraph: `Purpose fuels progress. That's why it's at the core of everything we create together.`,
  },
  [SceneSection.Design]: {
    overlineClass: 'text-orange',
    heading: 'Where form meets function',
    paragraph:
      'By deeply understanding the problem and any constraints, we design solutions that are both effective and delightful.',
  },
  [SceneSection.Engineering]: {
    overlineClass: 'text-cyan',
    heading: 'From concept to impact',
    paragraph: 'We bring your vision to life with cutting-edge web solutions. Fast, secure, and built to maintain.',
  },
} as const

const FloatingInfo: FC<Props> = ({ section }) => {
  const activeSection = useHomeSceneStore((s) => s.activeSection)
  const isOpen = activeSection === section

  const modalTextTween = useRef<GSAPTween>()
  const container = useRef<HTMLDivElement>(null)
  const { contextSafe } = useGSAP({ scope: container })

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    placement: 'top',
    middleware: [shift({ padding: 24 }), offset({ mainAxis: 24 }), flip()],
  })

  const onModalEnter = contextSafe(() => {
    if (!refs.floating.current) return
    modalTextTween.current?.kill()

    const splitParagraph = new SplitText('h3, p', {
      charsClass: 'opacity-0',
    })

    gsap.set(refs.floating.current, { opacity: 1 })

    gsap.to('.span', {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
    })

    modalTextTween.current = gsap.fromTo(
      splitParagraph.chars,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        stagger: 0.014,
        ease: 'power2.out',
      },
    )
  })

  const onModalExit = () => {
    modalTextTween.current?.kill()
    modalTextTween.current = gsap.to(refs.floating.current, {
      opacity: 0,
      duration: 0.5,
      scale: 0.95,
      ease: 'power2.out',
    })
  }

  return (
    <Html ref={container} className="pointer-events-none select-none">
      <div ref={refs.setReference} className="size-5 -translate-x-1/2 -translate-y-1/2" />
      <Transition
        in={isOpen}
        timeout={{ enter: 0, exit: 350 }}
        mountOnEnter={true}
        unmountOnExit={true}
        onEnter={onModalEnter}
        onExit={onModalExit}
        nodeRef={refs.floating}>
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          className="pointer-events-none absolute w-[calc(100vw-80px)] origin-top-left space-y-2 opacity-0 md:w-[420px] 2xl:w-[560px]">
          <span
            className={twJoin(
              CONFIG[section].overlineClass,
              'span block w-full text-xl font-black capitalize italic tracking-wide opacity-0 xl:text-2xl',
            )}>
            {section}
          </span>
          <h3 className="w-full text-lg font-bold md:text-2xl lg:text-3xl 2xl:text-4xl">{CONFIG[section].heading}</h3>
          <p className="w-full max-w-xl text-lg text-light">{CONFIG[section].paragraph}</p>
        </div>
      </Transition>
    </Html>
  )
}

export default FloatingInfo
