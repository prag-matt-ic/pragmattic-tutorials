import HomeCanvas from '@/components/home/HomeCanvas'
import HomeHeader from '@/components/home/HomeHeader'
import HomeScrollManager from '@/components/home/HomeScrollManager'

export default function HomePage() {
  return (
    <main className="w-full overflow-x-hidden bg-black">
      <HomeCanvas />

      <HomeHeader />

      <div className={PADDING_SECTION_CLASSES} />

      <section id="purpose-section" className={SCENE_SECTION_CLASSES} />

      <div className={PADDING_SECTION_CLASSES} />

      <section id="design-section" className={SCENE_SECTION_CLASSES} />

      <div className={PADDING_SECTION_CLASSES} />

      <section id="engineering-section" className={SCENE_SECTION_CLASSES} />

      <div className={PADDING_SECTION_CLASSES} />
      <div className={PADDING_SECTION_CLASSES} />

      {/* Main navigation section */}
      <footer className="relative h-lvh w-full bg-black/40 backdrop-blur-md">
        <div></div>
      </footer>

      <HomeScrollManager />

      {/* TEMP */}
      <section className="fixed bottom-4 left-4 z-50 rounded-md bg-black/20 p-3">
        <h3 className="text-sm font-bold uppercase text-white">🚧 Under Construction 🚧</h3>
      </section>
    </main>
  )
}

const SCENE_SECTION_CLASSES = 'relative z-10 pointer-events-none h-[1000px] w-full'
const PADDING_SECTION_CLASSES = 'relative z-10 pointer-events-none h-[1000px] w-full'
