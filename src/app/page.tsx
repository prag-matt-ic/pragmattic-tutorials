import HomeCanvas from '@/components/home/HomeCanvas'
import HomeHeader from '@/components/home/HomeHeader'
import HomeScrollManager from '@/components/home/HomeScrollManager'

export default function HomePage() {
  return (
    <main className="w-full overflow-x-hidden bg-black text-white">
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
      <footer className="relative grid h-lvh w-full grid-cols-1 grid-rows-[1fr_auto] border-t-2 border-t-black bg-black/20">
        <div className="py-32 horizontal-padding">
          <section className="z-50 w-fit rounded-md bg-black/30 p-12">
            <h3 className="font-bold uppercase">🚧 Site under construction 🚧</h3>
            <p className="mt-2 text-light">Check back again soon for more content!</p>
          </section>
        </div>

        <div className="w-full bg-[#000] py-4 horizontal-padding">
          <span className="text-sm text-white/40">Copyright 2024 - Pragmattic Ltd</span>
        </div>
      </footer>

      <HomeScrollManager />
    </main>
  )
}

const SCENE_SECTION_CLASSES = 'relative z-10 pointer-events-none h-[1000px] w-full'
const PADDING_SECTION_CLASSES = 'relative z-10 pointer-events-none h-[1000px] w-full'
