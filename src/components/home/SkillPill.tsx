'use client'

import { flip, offset, shift, useFloating, useHover, useInteractions } from '@floating-ui/react'
import { Html } from '@react-three/drei'
import gsap from 'gsap'
import SplitText from 'gsap/dist/SplitText'
import { type FC, type ReactNode, useRef, useState } from 'react'
import { Transition } from 'react-transition-group'

import { SceneSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'
import { twJoin } from 'tailwind-merge'

type Props = {
  section: SceneSection
}

const BUTTON_LABELS: Record<SceneSection, string> = {
  [SceneSection.None]: '',
  [SceneSection.Purpose]: 'Purpose',
  [SceneSection.Design]: 'Design',
  [SceneSection.Engineering]: 'Engineering',
} as const

const BUTTON_CLASSES: Record<SceneSection, string> = {
  [SceneSection.None]: '',
  [SceneSection.Purpose]: 'hover:border-green',
  [SceneSection.Design]: 'hover:border-orange',
  [SceneSection.Engineering]: 'hover:border-cyan',
} as const

const MODAL_CONTENT: Record<SceneSection, ReactNode> = {
  [SceneSection.None]: null,
  [SceneSection.Purpose]: 'Using technology to make the world a better place',
  [SceneSection.Design]: 'Functional and aesthetic in equal parts',
  [SceneSection.Engineering]: 'Turning the vision into reality',
} as const

const SkillPill: FC<Props> = ({ section }) => {
  const activeSection = useHomeSceneStore((s) => s.activeSection)
  const setActiveSection = useHomeSceneStore((s) => s.setSectionsSeen)
  const hasSeenSections = useHomeSceneStore((s) => s.sectionsSeen)
  const hasScrolledIntoView = useHomeSceneStore((s) => s.hasScrolledIntoView)

  const isOpen = activeSection === section && hasScrolledIntoView

  let modalTextTween = useRef<GSAPTween>()
  const [isAnimatingModalText, setIsAnimatingModalText] = useState(false)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement: 'top',
    onOpenChange: (open) => {
      setActiveSection(open ? section : SceneSection.None)
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
          setTimeout(() => setIsAnimatingModalText(false), 1000)
        },
      },
    )
  }

  const onModalExit = () => {
    modalTextTween.current?.kill()
    modalTextTween.current = gsap.to(refs.floating.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power1.out',
    })
    setIsAnimatingModalText(false)
  }

  const showPill = (): boolean => {
    if (!hasScrolledIntoView) return false
    if (section === SceneSection.Purpose) return true
    if (section === SceneSection.Design && hasSeenSections[SceneSection.Purpose]) return true
    if (section === SceneSection.Engineering && hasSeenSections[SceneSection.Design]) return true
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
          <button
            className={twJoin(
              'pointer-events-auto rounded-full border-2 border-white/20 bg-black/20 px-6 py-3 text-base font-bold italic text-white md:text-xl',
              BUTTON_CLASSES[section],
            )}
            color="secondary"
            ref={refs.setReference}
            {...getReferenceProps()}>
            {BUTTON_LABELS[section]}
          </button>
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
          <p className="w-[calc(100vw-48px)] p-2 text-center text-xl font-bold leading-tight text-white md:w-[360px] md:p-3 md:text-2xl 2xl:w-[420px] 2xl:text-3xl">
            {MODAL_CONTENT[section]}
          </p>
        </div>
      </Transition>
    </Html>
  )
}

export default SkillPill
