'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, { type FC, useRef } from 'react'
import { Group, PointLight } from 'three'

import { SceneSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'

import FloatingInfo from '../FloatingInfo'
import Points from './points/Points'
import Torus from './torus/Torus'
import TorusPoints from './torusPoints/TorusPoints'

type Props = {
  isMobile: boolean
}

const HomeMain: FC<Props> = ({ isMobile }) => {
  const torusGroup = useRef<Group>(null)
  const pointLight = useRef<PointLight>(null)

  const introScrollProgress = useRef<number>(0)
  const setAllAreActive = useHomeSceneStore((s) => s.setAllAreActive)

  // // Translate the group in as the header text moves out
  useGSAP(
    () => {
      // Particles start scattered and move in as the header text transitions
      ScrollTrigger.create({
        start: 0,
        end: 1000,
        scrub: true,
        onUpdate: (self) => {
          introScrollProgress.current = self.progress
        },
      })
      if (!torusGroup.current) return
      gsap.to(torusGroup.current.position, {
        z: -4,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: '#home-footer',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          onEnter: () => {
            // Make all the rings colourful!
            setAllAreActive(true)
          },
          onLeaveBack: () => {
            setAllAreActive(false)
          },
        },
      })
    },
    { dependencies: [] },
  )

  const getScrollProgress = (): number => introScrollProgress.current

  return (
    <>
      <Points isMobile={isMobile} />
      <group ref={torusGroup} position={isMobile ? [0, 0.5, 0] : [0, 0, 0]}>
        <pointLight ref={pointLight} position={[1.0, 1.7, 0.5]} intensity={5.0} color="#FFF" />
        <Torus section={SceneSection.Purpose} />
        <TorusPoints section={SceneSection.Purpose} getScrollProgress={getScrollProgress} />
        <Torus section={SceneSection.Design} />
        <TorusPoints section={SceneSection.Design} getScrollProgress={getScrollProgress} />
        <Torus section={SceneSection.Engineering} />
        <TorusPoints section={SceneSection.Engineering} getScrollProgress={getScrollProgress} />
      </group>
      <group>
        <FloatingInfo section={SceneSection.Purpose} isMobile={isMobile} />
        <FloatingInfo section={SceneSection.Design} isMobile={isMobile} />
        <FloatingInfo section={SceneSection.Engineering} isMobile={isMobile} />
      </group>
    </>
  )
}

export default HomeMain
