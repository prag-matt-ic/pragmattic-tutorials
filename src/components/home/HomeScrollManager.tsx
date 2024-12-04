'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import Image from 'next/image'
import { type FC } from 'react'
import { twJoin } from 'tailwind-merge'

import positionArrow from '@/assets/icons/scroll-position.svg'
import { SceneSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP)

const HomeScrollManager: FC = () => {
  const activeSection = useHomeSceneStore((s) => s.activeSection)
  const setActiveSection = useHomeSceneStore((s) => s.setActiveSection)

  useGSAP(
    () => {
      Object.values(SceneSection).forEach((section) => {
        ScrollTrigger.create({
          trigger: `#${section}-section`,
          start: 'top top',
          end: 'bottom top',
          onEnter: () => {
            setActiveSection(section)
          },
          onEnterBack: () => {
            setActiveSection(section)
          },
          onLeave: () => {
            setActiveSection(null)
          },
          onLeaveBack: () => {
            setActiveSection(null)
          },
        })
      })
    },
    { dependencies: [] },
  )

  useGSAP(() => {
    // Update scroll progress indicator
    const matchMedia = gsap.matchMedia()
    matchMedia.add('(min-width: 640px)', () => {
      const scrollBarHeight = document.getElementById('scroll-bar')?.getBoundingClientRect()?.height
      if (!scrollBarHeight) return
      gsap.to('#scroll-indicator', {
        y: scrollBarHeight,
        ease: 'none',
        scrollTrigger: {
          start: 0,
          end: 'max',
          scrub: true,
        },
      })
    })
  }, [])

  const onLinkClick = (section: SceneSection) => {
    gsap.to(window, { scrollTo: { y: `#${section}-section`, offsetY: -8 } })
  }

  return (
    <nav className="fixed bottom-0 left-4 top-0 z-[100] hidden items-center justify-center sm:flex">
      <div id="scroll-bar" className="relative w-1.5 bg-light/40">
        {/* Height 40px corresponds to a 1000px height section. */}
        <div className="h-[40px] w-full shrink-0" />
        <div className="h-[40px] w-full shrink-0" />
        <button
          className={twJoin(
            'h-[40px] w-full shrink-0 bg-green transition-opacity duration-200 hover:opacity-100',
            activeSection === SceneSection.Purpose ? 'opacity-100' : 'opacity-20',
          )}
          onClick={() => onLinkClick(SceneSection.Purpose)}
        />
        <div className="h-[40px] w-full shrink-0" />
        <button
          className={twJoin(
            'h-[40px] w-full shrink-0 bg-orange transition-opacity duration-200 hover:opacity-100',
            activeSection === SceneSection.Design ? 'opacity-100' : 'opacity-20',
          )}
          onClick={() => onLinkClick(SceneSection.Design)}
        />
        <div className="h-[40px] w-full shrink-0" />
        <button
          className={twJoin(
            'h-[40px] w-full shrink-0 bg-cyan transition-opacity duration-200 hover:opacity-100',
            activeSection === SceneSection.Engineering ? 'opacity-100' : 'opacity-20',
          )}
          onClick={() => onLinkClick(SceneSection.Engineering)}
        />
        <div className="h-[40px] w-full shrink-0" />
        <div className="h-[40px] w-full shrink-0" />

        <div id="scroll-indicator" className="absolute left-1 top-0 size-5">
          <Image src={positionArrow} alt="arrow" className="size-5 -translate-y-1/2" />
        </div>
      </div>
    </nav>
  )
}

export default HomeScrollManager
