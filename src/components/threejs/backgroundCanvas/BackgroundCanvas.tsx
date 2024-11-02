'use client'

import { OrthographicCamera } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { type FC } from 'react'

import BackdropPlane from '@/components/threejs/backgroundCanvas/BackdropPlane'

type Props = {}

const BackgroundCanvas: FC<Props> = ({}) => {
  return (
    <Canvas gl={{ alpha: false, antialias: false }} className="!fixed inset-0">
      <OrthographicCamera makeDefault={true} position={[0, 0, 5]} />
      <BackdropPlane />
    </Canvas>
  )
}

export default BackgroundCanvas
