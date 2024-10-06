import Image from 'next/image'

import logo from '@/assets/brand/pragmattic.svg'

export default function HomePage() {
  return (
    <main className="h-screen w-full bg-off-black p-10">
      <header className="flex w-full items-center justify-center">
        <Image src={logo} alt="Pragmattic" height={40} />
      </header>
      <section></section>
    </main>
  )
}
