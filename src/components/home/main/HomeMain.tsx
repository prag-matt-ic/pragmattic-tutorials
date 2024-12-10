'use client'
import { useGSAP } from '@gsap/react'
import { Billboard } from '@react-three/drei'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import React, { type FC, useRef } from 'react'
import { Group, PointLight } from 'three'

import { SceneSection, useHomeSceneStore } from '@/hooks/home/useHomeStore'

import FloatingInfo from '../FloatingInfo'
import Torus from './Torus'
import TorusPoints from './TorusPoints'

const HomeMain: FC = () => {
  const torusGroup = useRef<Group>(null)
  const pointLight = useRef<PointLight>(null)

  const setHasScrolledIntoView = useHomeSceneStore((s) => s.setHasCompletedIntroScroll)
  const introScrollProgress = useRef<number>(0)
  const getScrollProgress = (): number => introScrollProgress.current

  // // Translate the group in as the header text moves out
  useGSAP(() => {
    ScrollTrigger.create({
      start: 0,
      end: 1000,
      scrub: true,
      onUpdate: (self) => {
        introScrollProgress.current = self.progress
      },
      onEnterBack: () => {
        setHasScrolledIntoView(false)
      },
      onLeave: () => {
        setHasScrolledIntoView(true)
      },
    })
  }, [])

  return (
    <>
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
