'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type FC, useRef } from 'react'
import { Transition } from 'react-transition-group'
import { twJoin } from 'tailwind-merge'

import pragmatticLogo from '@/assets/brand/pragmattic.svg'
import githubIcon from '@/assets/icons/github.svg'
import youtubeIcon from '@/assets/icons/youtube.svg'
import { EXAMPLES } from '@/resources/navigation'

type Props = {
  isShowing: boolean
  onClose: () => void
}

gsap.registerPlugin(useGSAP)

const ExamplesMenu: FC<Props> = ({ isShowing, onClose }) => {
  const currentPathname = usePathname()
  const container = useRef<HTMLDivElement>(null)
  const { contextSafe } = useGSAP({ scope: container })

  const onEnter = contextSafe(() => {
    gsap
      .timeline()
      .to('.backdrop', { opacity: 1, duration: 0.5 })
      .fromTo('nav', { opacity: 0, xPercent: 100 }, { opacity: 1, xPercent: 0, duration: 0.3 }, 0)
      .fromTo('.example', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.24, stagger: 0.05 }, '-=0.2')
  })

  const onExit = contextSafe(() => {
    gsap.to('.backdrop', { opacity: 0, duration: 0.2 })
    gsap.to('nav', { opacity: 0, xPercent: 100, duration: 0.2 })
  })

  return (
    <Transition
      in={isShowing}
      timeout={{ enter: 0, exit: 300 }}
      mountOnEnter
      unmountOnExit
      onEnter={onEnter}
      onExit={onExit}
      nodeRef={container}>
      <div ref={container} className="fixed inset-0 z-[1001] flex items-center justify-center">
        <div
          className="backdrop absolute inset-0 cursor-pointer bg-black/30 opacity-0 backdrop-blur-md"
          onClick={onClose}
        />
        <nav className="absolute right-0 top-0 h-full w-[400px] space-y-4 bg-black px-4 py-6 text-white shadow-2xl">
          <Image src={pragmatticLogo} alt="Pragmattic" width={120} />
          <h2 className="text-lg font-bold">Examples</h2>
          {Object.values(EXAMPLES).map(({ title, pathname, youtubeUrl, githubUrl }) => {
            const isActive = pathname === currentPathname
            const hasLinks = !!youtubeUrl || !!githubUrl
            return (
              <div
                key={title}
                className={twJoin('example space-y-3 rounded bg-off-black p-4', isActive && 'outline outline-green')}>
                <Link href={pathname} className="block font-medium hover:text-green" onClick={onClose}>
                  {title}
                </Link>
                {hasLinks && (
                  <div className="flex items-center gap-4">
                    {!!youtubeUrl && (
                      <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-50">
                        <Image src={youtubeIcon} alt="Youtube" />
                      </a>
                    )}
                    {!!githubUrl && (
                      <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-50">
                        <Image src={githubIcon} alt="Github" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </Transition>
  )
}

export default ExamplesMenu
