import Image from 'next/image'
import React, { type FC } from 'react'

import avatarPic from '@/assets/avatar.jpg'
import pragmattic from '@/assets/brand/pragmattic.svg'

const Avatar: FC = () => {
  return (
    <div className="relative flex w-fit items-center gap-4">
      <Image
        src={avatarPic}
        width={120}
        height={120}
        alt="Matthew Frawley"
        className="size-10 overflow-hidden rounded-full object-cover md:size-16"
      />
      <Image src={pragmattic} alt="Pragmattic" className="h-5 w-auto md:h-6" />
    </div>
  )
}

export default Avatar
