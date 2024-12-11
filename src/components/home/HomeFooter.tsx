import React, { type FC } from 'react'

const HomeFooter: FC = () => {
  return (
    <div id="home-footer" className="relative grid h-lvh w-full grid-cols-1 grid-rows-[1fr_auto]">
      <div />
      <footer className="w-full bg-[#000] py-4 horizontal-padding">
        <span className="text-sm text-white/40">Copyright 2024 - Pragmattic Ltd</span>
      </footer>
    </div>
  )
}

export default HomeFooter

{
  /* <section className="z-50 w-fit rounded-md bg-black/30 p-12">
<h3 className="font-bold uppercase">🚧 Site under construction 🚧</h3>
<p className="mt-2 text-light">Check back again soon for more content!</p>
</section>

<section></section> */
}
