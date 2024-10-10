import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { type FC, useRef } from 'react'
import { Transition } from 'react-transition-group'

type Props = {
  isShowing: boolean
  onClose: () => void
}

gsap.registerPlugin(useGSAP)

const SideMenu: FC<Props> = ({ isShowing, onClose }) => {
  const container = useRef<HTMLDivElement>(null)
  const { contextSafe } = useGSAP({ scope: container })

  const onEnter = contextSafe(() => {
    gsap
      .timeline()
      .to('.backdrop', { opacity: 1, duration: 0.5 })
      .fromTo('.content', { opacity: 0, xPercent: 100 }, { opacity: 1, xPercent: 0, duration: 0.3 }, 0)
      .fromTo('h2, p', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.24, stagger: 0.1 }, '-=0.2')
  })

  const onExit = contextSafe(() => {
    gsap.to('.backdrop', { opacity: 0, duration: 0.2 })
    gsap.to('.content', { opacity: 0, xPercent: 100, duration: 0.2 })
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
      {(status) => (
        <div ref={container} className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="backdrop absolute inset-0 cursor-pointer bg-black/20 opacity-0 backdrop-blur-md"
            onClick={onClose}
          />
          <div className="content absolute right-0 top-0 h-full w-[320px] space-y-4 border-l border-black bg-off-black p-8 text-white shadow-2xl">
            <h2 className="text-xl font-bold text-green">This modal is nice</h2>
            <p>
              It animates in and out of the DOM. It’s child content fades in too. The structure is easy to update for
              mobile menus too!
            </p>
          </div>
        </div>
      )}
    </Transition>
  )
}

export default SideMenu
