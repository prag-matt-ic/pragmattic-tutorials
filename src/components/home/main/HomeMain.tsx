'use client'
import { useGSAP } from '@gsap/react'
import { Billboard } from '@react-three/drei'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, { type FC, useRef } from 'react'
import { Group, PointLight } from 'three'

import { SceneSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'

import FloatingInfo from '../FloatingInfo'
import Points from './points/Points'
import Torus from './torus/Torus'
import TorusPoints from './torusPoints/TorusPoints'

const HomeMain: FC = () => {
  const torusGroup = useRef<Group>(null)
  const pointLight = useRef<PointLight>(null)

  const setAllAreActive = useHomeSceneStore((s) => s.setAllAreActive)

  const introScrollProgress = useRef<number>(0)
  const outroScrollProgress = useRef<number>(0)

  // // Translate the group in as the header text moves out
  useGSAP(() => {
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
      z: -5,
      ease: 'none',
      scrollTrigger: {
        trigger: '#home-footer',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onEnter: () => {
          // Make them all colourful!
          setAllAreActive(true)
        },
        onLeaveBack: () => {
          setAllAreActive(false)
        },
        onUpdate: (self) => {
          outroScrollProgress.current = self.progress
        },
      },
    })
  }, [])

  const getScrollProgress = (): number => introScrollProgress.current

  return (
    <>
      <Points />
      <group ref={torusGroup} position={[0, 0, 0]}>
        <pointLight ref={pointLight} position={[1.0, 1.7, 0.5]} intensity={5.0} color="#FFF" />
        <Torus section={SceneSection.Purpose} />
        <TorusPoints section={SceneSection.Purpose} getScrollProgress={getScrollProgress} />
        <Torus section={SceneSection.Design} />
        <TorusPoints section={SceneSection.Design} getScrollProgress={getScrollProgress} />
        <Torus section={SceneSection.Engineering} />
        <TorusPoints section={SceneSection.Engineering} getScrollProgress={getScrollProgress} />
      </group>
      <group>
        <Billboard position={[-1.1, 0.7, 1]}>
          <FloatingInfo section={SceneSection.Purpose} />
        </Billboard>
        <Billboard position={[1.6, 0, 2]}>
          <FloatingInfo section={SceneSection.Design} />
        </Billboard>
        <Billboard position={[-0.5, -2, 1]}>
          <FloatingInfo section={SceneSection.Engineering} />
        </Billboard>
      </group>
    </>
  )
}

export default HomeMain
