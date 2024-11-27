import HomeCanvas from '@/components/home/HomeCanvas'
import HomeHeader from '@/components/home/HomeHeader'

export default function HomePage() {
  return (
    <>
      <HomeCanvas />

      <main className="pointer-events-none relative z-10 h-[300vh] w-full">
        <HomeHeader />

        <section className="fixed bottom-4 left-4 rounded-md bg-black/20 p-3">
          <h3 className="font-bold uppercase text-white">🚧 Under Construction 🚧</h3>
        </section>
      </main>
    </>
  )
}
