'use client' // TODO: remove this in future
import HomeCanvas from '@/components/home/HomeCanvas'
import HomeHeader from '@/components/home/HomeHeader'

export default function HomePage() {
  return (
    <main className="w-ful h-[300vh] w-full bg-black">
      <HomeCanvas />

      <div className="pointer-events-none relative z-10">
        <HomeHeader />
        <section className="fixed bottom-4 left-4 rounded-md bg-black/20 p-3">
          <h3 className="text-sm font-bold uppercase text-white/50">🚧 Under Construction 🚧</h3>
        </section>
      </div>
    </main>
  )
}
