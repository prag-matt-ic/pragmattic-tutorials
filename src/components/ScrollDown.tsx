import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import { type FC } from 'react'
import { twMerge } from 'tailwind-merge'

import downArrow from '@/assets/icons/scroll-down-arrow.svg'

type Props = {
  className?: string
}

const ScrollDownArrow: FC<Props> = ({ className }) => {
  useGSAP(() => {
    gsap.to('#scroll-down', {
      opacity: 0,
      duration: 1.5,
      scrollTrigger: {
        start: 24,
        once: true,
      },
    })
  }, [])
  return (
    <div
      id="scroll-down"
      className={twMerge('pointer-events-none fixed bottom-0 z-50 flex items-center gap-3 p-6 text-white', className)}>
      <Image src={downArrow} alt="scroll down" className="w-4 animate-bounce" />
      <span className="text-sm font-semibold tracking-wide">Scroll</span>
    </div>
  )
}

export default ScrollDownArrow
