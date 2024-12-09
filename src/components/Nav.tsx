'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type FC, useState } from 'react'
import { twJoin } from 'tailwind-merge'

import logo from '@/assets/brand/pragmattic.svg'
import menuIcon from '@/assets/icons/menu.svg'
import Menu from '@/components/Menu'

const Nav: FC = () => {
  const pathname = usePathname()
  const hideLogo = pathname.includes('rebuild')

  const [isMenuShowing, setIsMenuShowing] = useState(false)

  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-[500] flex items-center justify-between pl-6">
        <Link href="/">
          <Image
            alt="Pragmattic"
            src={logo}
            height={20}
            className={twJoin('h-11 transition-opacity duration-200', hideLogo ? 'opacity-0' : 'opacity-100')}
          />
        </Link>

        <button className="rounded-bl-lg bg-black p-2.5" onClick={() => setIsMenuShowing((prev) => !prev)}>
          <Image src={menuIcon} alt="menu" width={32} height={32} />
        </button>
      </nav>
      <Menu isShowing={isMenuShowing} onClose={() => setIsMenuShowing(false)} />
    </>
  )
}

export default Nav
