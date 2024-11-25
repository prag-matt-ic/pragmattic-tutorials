'use client'
import Image from 'next/image'
import Link from 'next/link'
import { type FC, useState } from 'react'

import logo from '@/assets/brand/pragmattic.svg'
import menuIcon from '@/assets/icons/menu.svg'
import ExamplesMenu from '@/components/ExamplesMenu'

const Nav: FC = () => {
  const [isMenuShowing, setIsMenuShowing] = useState(false)
  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-[500] flex items-center justify-between px-6">
        <Link href="/">
          <Image alt="Pragmattic" src={logo} height={20} className="h-11" />
        </Link>

        <button className="p-2" onClick={() => setIsMenuShowing((prev) => !prev)}>
          <Image src={menuIcon} alt="menu" width={32} height={32} />
        </button>
      </nav>
      <ExamplesMenu isShowing={isMenuShowing} onClose={() => setIsMenuShowing(false)} />
    </>
  )
}

export default Nav
