import HomeCanvas from '@/components/home/HomeCanvas'
import HomeFooter from '@/components/home/HomeFooter'
import HomeHeader from '@/components/home/HomeHeader'
import HomeScrollManager from '@/components/home/HomeScrollManager'

export default function HomePage() {
  return (
    <main className="w-full overflow-x-hidden bg-black text-white">
      <HomeCanvas />

      <HomeHeader />

      <div className={SECTION_CLASSES} />
      <section id="purpose-section" className={SECTION_CLASSES} />
      <div className={SECTION_CLASSES} />
      <section id="design-section" className={SECTION_CLASSES} />
      <div className={SECTION_CLASSES} />
      <section id="engineering-section" className={SECTION_CLASSES} />
      <div className={SECTION_CLASSES} />
      <div className={SECTION_CLASSES} />

      <HomeFooter />

      <HomeScrollManager />
    </main>
  )
}

const SECTION_CLASSES = 'relative z-10 pointer-events-none h-[1000px] w-full'
