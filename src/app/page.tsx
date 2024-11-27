import Link from 'next/link'
import { useState } from 'react'

import logo from '@/assets/brand/pragmattic.svg'
import Button from '@/components/buttons/Button'
import HomeClient from '@/components/home/HomeClient'
import { ExamplePathname } from '@/resources/navigation'

export default function HomePage() {
  return (
    <>
      <HomeClient />

      <main className="pointer-events-none relative z-10 h-lvh w-full px-5 py-16 font-sans">
        <header className="w-fit rounded-2xl bg-black/10 p-6">
          <h2 className="text-2xl font-bold text-white">🚧 Under Construction 🚧</h2>
          <Button variant="filled" size="small" className="mt-6" href={ExamplePathname.ImageSequence}>
            Check out the examples
          </Button>
        </header>
      </main>
    </>
  )
}
