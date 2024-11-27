'use client'

import { flip, offset, shift, useFloating, useHover, useInteractions } from '@floating-ui/react'
import { Html } from '@react-three/drei'
import gsap from 'gsap'
import SplitText from 'gsap/dist/SplitText'
import { type FC, type ReactNode, useRef, useState } from 'react'
import { Transition } from 'react-transition-group'

import Button from '@/components/buttons/Button'
import { HeaderSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'

type Props = {
  section: HeaderSection
}

const BUTTON_LABELS: Record<HeaderSection, string> = {
  [HeaderSection.None]: '',
  [HeaderSection.Purpose]: 'Purpose',
  [HeaderSection.Design]: 'Design',
  [HeaderSection.Engineering]: 'Engineering',
} as const

const MODAL_CONTENT: Record<HeaderSection, ReactNode> = {
  [HeaderSection.None]: null,
  [HeaderSection.Purpose]: 'Using technology to make the world a better place',
  [HeaderSection.Design]: 'Functional and aesthetic in equal parts',
  [HeaderSection.Engineering]: 'Turning the vision into reality',
} as const

const SkillPill: FC<Props> = ({ section }) => {
  const activeSection = useHomeSceneStore((s) => s.activeSection)
  const setActiveSection = useHomeSceneStore((s) => s.setActiveSection)
  const hasSeenSections = useHomeSceneStore((s) => s.hasSeenSections)

  const isOpen = activeSection === section

  let modalTextTween = useRef<GSAPTween>()
  const [isAnimatingModalText, setIsAnimatingModalText] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement: 'top',
    onOpenChange: (open) => {
      setActiveSection(open ? section : HeaderSection.None)
      setIsAnimatingModalText(true)
    },
    middleware: [shift({ padding: 16 }), offset({ mainAxis: 12 }), flip()],
  })
  const hover = useHover(context, {})
  const { getReferenceProps, getFloatingProps } = useInteractions([hover])

  const onButtonEnter = () => {
    gsap.fromTo(
      refs.reference.current,
      { opacity: 0, scale: 0.3 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        delay: 0.5,
        ease: 'power2.out',
      },
    )
  }

  const onButtonExit = () => {
    gsap.to(refs.reference.current, {
      opacity: 0,
      scale: 0.3,
      duration: 0.4,
      ease: 'power2.out',
    })
  }

  const onModalEnter = () => {
    if (!refs.floating.current) return

    const paragraph = refs.floating.current.querySelector('p')
    const splitParagraph = new SplitText(paragraph, {
      charsClass: 'opacity-0',
    })
    gsap.set(refs.floating.current, { opacity: 1 })

    modalTextTween.current?.kill()
    modalTextTween.current = gsap.fromTo(
      splitParagraph.chars,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.4,
        stagger: 0.012,
        ease: 'power2.out',
        onComplete: () => {
          setTimeout(() => setIsAnimatingModalText(false), 2000)
        },
      },
    )
  }

  const onModalExit = () => {
    setIsAnimatingModalText(false)
    modalTextTween.current?.kill()
    modalTextTween.current = gsap.to(refs.floating.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power1.out',
    })
  }

  const showPill = (): boolean => {
    // if (!hasCompletedScroll) return false
    if (section === HeaderSection.Purpose) return true
    if (section === HeaderSection.Design && hasSeenSections[HeaderSection.Purpose]) return true
    if (section === HeaderSection.Engineering && hasSeenSections[HeaderSection.Design]) return true
    return false
  }

  return (
    <Html className="pointer-events-none select-none">
      <div className="h-12 w-48 -translate-x-1/2 -translate-y-1/2 items-center justify-center lg:flex">
        <Transition
          in={showPill()}
          timeout={{ enter: 0, exit: 400 }}
          mountOnEnter={true}
          unmountOnExit={true}
          onEnter={onButtonEnter}
          onExit={onButtonExit}>
          <Button variant="outlined" ref={refs.setReference} {...getReferenceProps()}>
            {BUTTON_LABELS[section]}
          </Button>
        </Transition>
      </div>

      {/* Floating Info modal */}
      <Transition
        in={isAnimatingModalText || isOpen}
        timeout={{ enter: 0, exit: 350 }}
        mountOnEnter={true}
        unmountOnExit={true}
        onEnter={onModalEnter}
        onExit={onModalExit}
        nodeRef={refs.floating}>
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="pointer-events-none absolute z-[200] w-max opacity-0">
          <p className="w-[calc(100vw-48px)] p-2 text-center text-xl font-bold leading-tight text-white md:w-[360px] md:p-3 md:text-2xl 2xl:w-[400px] 2xl:text-3xl">
            {MODAL_CONTENT[section]}
          </p>
        </div>
      </Transition>
    </Html>
  )
}

export default SkillPill
