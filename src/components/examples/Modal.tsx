import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { type FC, useRef } from 'react'
import { Transition } from 'react-transition-group'

type Props = {
  isShowing: boolean
  onClose: () => void
}

gsap.registerPlugin(useGSAP)

const Modal: FC<Props> = ({ isShowing, onClose }) => {
  const container = useRef<HTMLDivElement>(null)
  const { contextSafe } = useGSAP({ scope: container })

  const onEnter = contextSafe(() => {
    gsap
      .timeline()
      .to('.backdrop', { opacity: 1, duration: 0.5 })
      .fromTo('.content', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3 }, 0)
      .fromTo('h2, p', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.24, stagger: 0.1 }, '-=0.2')
  })

  const onExit = contextSafe(() => {
    gsap.to('.backdrop', { opacity: 0, duration: 0.2 })
    gsap.to('.content', { opacity: 0, scale: 0.95, duration: 0.2 })
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
      <div ref={container} className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="backdrop absolute inset-0 cursor-pointer bg-black/20 opacity-0 backdrop-blur-md"
          onClick={onClose}
        />
        <div className="content relative h-[240px] w-[320px] space-y-4 rounded-md border border-black bg-off-black p-8 text-white shadow-2xl">
          <h2 className="text-xl font-bold text-green">This modal is nice</h2>
          <p>
            It animates in and out of the DOM. It’s child content fades in too. The structure is easy to update for
            mobile menus too!
          </p>
        </div>
      </div>
    </Transition>
  )
}

export default Modal
