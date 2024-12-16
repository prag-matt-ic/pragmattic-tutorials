import React, { type FC } from 'react'
import { twJoin } from 'tailwind-merge'

import Marquee from '../examples/Marquee'

const HomeFooter: FC = () => {
  const sectionClasses = 'h-fit rounded-xl border border-off-black/50 bg-black/40 p-10'

  return (
    <div id="home-footer" className="relative grid h-lvh w-full grid-cols-1 grid-rows-[1fr_auto_auto] gap-4 pt-16">
      <div className="grid grid-cols-1 grid-rows-2 gap-8 py-12 horizontal-padding sm:py-24 md:grid-cols-3">
        <section className={sectionClasses}>
          <h3 className="font-bold uppercase">🚧 Under construction 🚧</h3>
          <p className="mt-2 text-light">
            Check back again soon for more content!
            <br />
            Thanks, Matt
          </p>
        </section>
      </div>

      <Marquee className="py-4 opacity-40" />

      <footer className="w-full bg-black py-3 horizontal-padding">
        <span className="block text-center font-mono text-xs text-white/50">© Pragmattic Ltd - 2024</span>
      </footer>
    </div>
  )
}

export default HomeFooter
