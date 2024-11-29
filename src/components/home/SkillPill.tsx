'use client'

import { flip, offset, shift, useFloating, useHover, useInteractions } from '@floating-ui/react'
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

const BUTTON_LABELS: Record<SceneSection, string> = {
  [SceneSection.Purpose]: 'Purpose',
  [SceneSection.Design]: 'Design',
  [SceneSection.Engineering]: 'Engineering',
} as const

const BUTTON_CLASSES: Record<SceneSection, string> = {
  [SceneSection.Purpose]: 'hover:border-green active:border-green',
  [SceneSection.Design]: 'hover:border-orange active:border-orange',
  [SceneSection.Engineering]: 'hover:border-cyan active:border-cyan',
} as const

const MODAL_CONTENT: Record<SceneSection, ReactNode> = {
  [SceneSection.Purpose]: 'Using technology to improve human performance',
  [SceneSection.Design]: 'Balanced function and aesthetics',
  [SceneSection.Engineering]: 'Turn your vision into reality',
} as const

const SkillPill: FC<Props> = ({ section }) => {
  const activeSection = useHomeSceneStore((s) => s.activeSection)
  const setActiveSection = useHomeSceneStore((s) => s.setActiveSection)
  const hasSeenSections = useHomeSceneStore((s) => s.sectionsSeen)
  const hasScrolledIntoView = useHomeSceneStore((s) => s.hasScrolledIntoView)
  const isFinalState = useHomeSceneStore((s) => s.isFinalState)

  const shouldPulseButton = !hasSeenSections.design && section === SceneSection.Design
  console.log({ hasSeenSections, section, shouldPulseButton })

  const isOpen = hasScrolledIntoView && (activeSection === section || isFinalState)

  let modalTextTween = useRef<GSAPTween>()

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    placement: 'top',
    onOpenChange: (open) => {
      setActiveSection(open ? section : null)
    },
    middleware: [shift({ padding: 16 }), offset({ mainAxis: 24 }), flip()],
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
    modalTextTween.current?.kill()

    const paragraph = refs.floating.current.querySelector('p')
    const splitParagraph = new SplitText(paragraph, {
      charsClass: 'opacity-0',
    })
    gsap.set(refs.floating.current, { opacity: 1 })

    modalTextTween.current = gsap.fromTo(
      splitParagraph.chars,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        stagger: 0.016,
        ease: 'power2.out',
      },
    )
  }

  const onModalExit = () => {
    modalTextTween.current?.kill()
    modalTextTween.current = gsap.to(refs.floating.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power1.in',
    })
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
          timeout={{ enter: 0, exit: 350 }}
          mountOnEnter={true}
          unmountOnExit={true}
          onEnter={onButtonEnter}
          onExit={onButtonExit}>
          <button
            className={twJoin(
              'pointer-events-auto rounded-full border-4 border-white/20 bg-black/30 px-6 py-3 text-base font-bold italic text-white md:text-xl',
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
          {...getFloatingProps()}
          className="pointer-events-none absolute z-[200] w-max opacity-0">
          <p className="w-[calc(100vw-64px)] p-2 text-center text-xl font-bold text-white md:w-[360px] md:p-0 md:text-2xl 2xl:w-[480px] 2xl:text-3xl">
            {MODAL_CONTENT[section]}
          </p>
        </div>
      </Transition>
    </Html>
  )
}

export default SkillPill
