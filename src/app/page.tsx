import Link from 'next/link'

import HomeCanvas from '@/components/home/HomeCanvas'
import HomeHeader from '@/components/home/HomeHeader'

export default function HomePage() {
  return (
    <>
      <HomeCanvas />

      <main className="pointer-events-none relative z-10 h-[300vh] w-full">
        <HomeHeader />
      </main>
    </>
  )
}
