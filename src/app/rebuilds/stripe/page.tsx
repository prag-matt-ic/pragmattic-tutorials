import Image, { type StaticImageData } from 'next/image'
import { twJoin } from 'tailwind-merge'

import airbnbLogo from '@/assets/rebuilds/airbnb.svg'
import amazonLogo from '@/assets/rebuilds/amazon.svg'
import anthropicLogo from '@/assets/rebuilds/anthropic.svg'
import dashboardImg from '@/assets/rebuilds/dashboard.svg'
import googleLogo from '@/assets/rebuilds/google.svg'
import marriottLogo from '@/assets/rebuilds/marriott.svg'
import openAiLogo from '@/assets/rebuilds/openai.svg'
import phoneImg from '@/assets/rebuilds/phone.svg'
import shopifyLogo from '@/assets/rebuilds/shopify.svg'
import urbnLogo from '@/assets/rebuilds/urbn.svg'
import GLSLCanvas from '@/components/glsl/GLSLCanvas'

// Rebuild the Stripe home page header using Tailwind CSS and React

// Plan of action

// Foreground:
// - text section
// - image section
// - logos section

// Background:
// - canvas shader
// - striped lines

// Not covering:
// Nav bar

export default function StripeHeaderRebuild() {
  const headingClass = 'text-[min(88px,7vmax)] font-bold leading-[1] tracking-tighter text-[#3a3a3a]'
  const gridWidthClass = 'grid w-full max-w-[1080px]'
  const headerGridClass =
    'relative grid w-full max-w-[1080px] grid-cols-1 pb-24 pt-40 md:grid-cols-[max(50%,400px)_1fr]'
  return (
    <>
      <main className="relative min-h-screen w-full overflow-x-hidden text-black">
        {/* TODO: Hacky implemenation of dashed lines in the background */}
        <div className="fixed left-0 right-0 top-0 z-0 flex h-full w-full justify-center bg-white px-5">
          <div className={twJoin(gridWidthClass, 'h-full grid-cols-2 md:grid-cols-4')}>
            <div className="size-full border-l border-[#E4E4E4]" />
            <div className="relative hidden size-full border-l border-r border-dashed border-[#E4E4E4] md:block" />
            <div className="relative hidden size-full border-r border-dashed border-[#E4E4E4] md:block" />
            <div className="relative size-full border-r border-[#E4E4E4]" />
          </div>
        </div>

        {/* Heading layered beneath the canvas without color burn blending */}
        <aside className="absolute flex h-full w-full flex-col items-center px-5">
          <div className={headerGridClass}>
            <span className={twJoin(headingClass, 'mt-14 pl-6')}>Financial infrastructure to grow your revenue</span>
          </div>
        </aside>

        {/* Background shader */}
        <GLSLCanvas />

        {/* Main content */}
        <div className="relative flex w-full flex-col items-center px-5">
          <header className={headerGridClass}>
            {/* Text section */}
            <div className="space-y-7 pl-6">
              <div className="flex h-7 w-fit items-center gap-2 whitespace-nowrap rounded-full bg-black/50 px-3 py-0.5 text-xs font-semibold text-white backdrop-blur">
                Sessions 2025<span className="block pb-1 text-[20px]">•</span>Early-bird registration now open
              </div>

              <h1 className={twJoin(headingClass, 'isolate mix-blend-color-burn')}>
                Financial infrastructure to grow your revenue
              </h1>

              <p className="text-lg text-off-black">
                Join the millions of companies of all sizes that use Stripe to accept payments online and in person,
                embed financial services, power custom revenue models, and build a more profitable business.
              </p>

              <form className="relative flex w-96 items-center">
                <input
                  type="email"
                  className="relative h-12 w-full rounded-full border border-black/10 bg-[#f6f9fb] py-2 pl-4 pr-32 outline-offset-1 focus:outline-[#0048e5]"
                  placeholder="Email address"
                />
                <button
                  type="submit"
                  className="group absolute right-2 flex items-center gap-2.5 rounded-full bg-black py-1 pl-4 pr-2 font-semibold text-white hover:bg-mid">
                  Start now
                  {/* Icon with hover effect */}
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <line
                      x1="0"
                      y1="5"
                      x2="6"
                      y2="5"
                      stroke="#fff"
                      strokeWidth={2}
                      fill="#fff"
                      className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                    <path
                      d="M1 1l4 4-4 4"
                      fill="#fff"
                      className="transition-transform duration-150 group-hover:translate-x-1"
                    />
                  </svg>
                </button>
              </form>
            </div>

            {/* Images section */}
            <Image
              src={dashboardImg}
              alt="dashboard"
              height={580}
              width={920}
              className="absolute bottom-12 left-56 col-start-2 h-full max-w-max border-black"
            />
            <div className="relative hidden h-full items-center justify-center md:flex">
              <Image src={phoneImg} alt="phone" width={270} height={536} className="relative object-contain" />
            </div>
          </header>

          <section className="grid w-full max-w-[1080px] grid-cols-2 place-items-center gap-y-12 py-10 md:grid-cols-4">
            {BRAND_ICONS.map((logos) => (
              <Image src={logos.src} key={logos.name} alt={logos.name} />
            ))}
          </section>
        </div>
      </main>
    </>
  )
}

const BRAND_ICONS: { name: string; src: StaticImageData }[] = [
  { name: 'OpenAI', src: openAiLogo },
  { name: 'Amazon', src: amazonLogo },
  { name: 'Google', src: googleLogo },
  { name: 'Anthropic', src: anthropicLogo },
  { name: 'Marriott', src: marriottLogo },
  { name: 'Shopify', src: shopifyLogo },
  { name: 'Airbnb', src: airbnbLogo },
  { name: 'Urbn', src: urbnLogo },
] as const
