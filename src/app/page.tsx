'use client'
import Image from 'next/image'

import logo from '@/assets/brand/pragmattic.svg'
import Button from '@/components/Button'

export default function HomePage() {
  return (
    <main className="h-screen w-full bg-off-black p-10">
      <header className="flex w-full items-center justify-center">
        <Image src={logo} alt="Pragmattic" height={40} />
      </header>
      <section>
        <Button variant="filled" onClick={() => {}}>
          Press me
        </Button>
      </section>
    </main>
  )
}
