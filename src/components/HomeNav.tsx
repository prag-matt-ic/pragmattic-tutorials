'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import React, { type FC, useState } from 'react'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, useGSAP)

// Video Tutorial:
// https://www.youtube.com/watch?v=ee1CcxRkplU&t=173s

// Steps
// 0. Install dependencies - gsap, @gsap/react
// 0. Register Plugins - ScrollTrigger, ScrollToPlugin, useGSAP
// 1. Define Section IDs
// 2. Add Sections with IDs and className "nav-section"
// 3. Map Section IDs to Nav Links
// 4. Setup Scroll Triggers to highlight active section
// 5. Setup Scroll Trigger to update scroll progress indicator
// 6. Handle mobile version

// Resources
// https://gsap.com/docs/v3/Plugins/ScrollTrigger/
// https://gsap.com/docs/v3/Plugins/ScrollToPlugin/

export enum SectionId {
  Welcome = 'Animate Responsibly',
  About = 'About',
  Services = 'Services',
  Portfolio = 'Portfolio',
  Contact = 'Contact',
}

const HomeNav: FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>(SectionId.Welcome)

  useGSAP(
    () => {
      const addScrollTriggersToSections = () => {
        const sections = gsap.utils.toArray('.nav-section') as HTMLElement[]
        sections.forEach((section, index) => {
          ScrollTrigger.create({
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            onEnter: () => {
              setActiveSection(section.id as SectionId)
            },
            onEnterBack: () => {
              setActiveSection(section.id as SectionId)
            },
          })
        })
      }
      addScrollTriggersToSections()
    },
    { dependencies: [] },
  )

  useGSAP(
    () => {
      // Toggle link opacity based on the active section
      const matchMedia = gsap.matchMedia()

      matchMedia.add('(min-width: 640px)', () => {
        gsap.to('.nav-link', {
          opacity: (_, element: HTMLElement) => {
            const isActive = element.dataset.sectionId === activeSection
            return isActive ? 1 : 0.3
          },
        })
      })
    },
    { dependencies: [activeSection] },
  )

  const indicatorHeight = 12

  useGSAP(() => {
    // Update scroll progress indicator
    const scrollBarHeight = document.getElementById('scroll-bar')?.getBoundingClientRect()?.height
    if (!scrollBarHeight) return
    gsap.to('#scroll-indicator', {
      y: scrollBarHeight - indicatorHeight,
      ease: 'none',
      scrollTrigger: {
        start: 0,
        end: 'max',
        scrub: true,
      },
    })
  }, [])

  const onLinkClick = (id: SectionId) => {
    gsap.to(window, { scrollTo: { y: `#${id}`, offsetY: 0 } })
  }

  return (
    <nav className="fixed left-4 top-4 z-50 gap-4 sm:left-6 sm:top-16">
      {/* Scroll bar */}
      <div id="scroll-bar" className="absolute h-20 w-1 bg-white/20 sm:h-full">
        <div id="scroll-indicator" className="absolute top-0 w-full bg-white" style={{ height: indicatorHeight }} />
      </div>
      {/* Links */}
      <div className="ml-4 flex flex-col gap-4 py-4 text-sm text-white">
        {Object.values(SectionId).map((id) => (
          <a
            key={id}
            data-section-id={id}
            className={'nav-link hidden cursor-pointer opacity-20 sm:block'}
            onClick={() => onLinkClick(id)}>
            {id}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default HomeNav
