import { format } from 'date-fns'
import Image from 'next/image'
import React, { type FC, type ReactNode } from 'react'

import openNewIcon from '@/assets/icons/open-new.svg'
import Avatar from '@/components/avatar/Avatar'
import { type PostMetadata } from '@/utils/blogPosts'

import HeaderCanvas from './HeaderCanvas'
type Props = PostMetadata

const BlogHeader: FC<Props> = ({ title, tags, exampleUrl, date }) => {
  const formattedDate = format(new Date(date), 'PPP')
  return (
    <>
      <header className="relative flex w-full select-none bg-off-black">
        <HeaderCanvas />
        <div className="relative z-10 flex size-full flex-col items-center space-y-6 px-12 py-40">
          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm bg-white px-2 py-1 font-mono text-xs font-semibold tracking-wide shadow-sm">
                #{tag}
              </span>
            ))}
          </div>
          <h1
            className="max-w-[800px] text-center text-5xl font-extrabold leading-snug text-white"
            style={{
              textShadow: '0 3px 8px rgba(0, 0, 0, 0.1)',
            }}>
            {title}
          </h1>
          {/* <Avatar /> */}
          <span className="text-sm font-medium text-white">{formattedDate}</span>

          {!!exampleUrl && (
            <a
              target="_blank"
              href={exampleUrl}
              className="flex items-center gap-2 rounded bg-off-black px-3 py-2 text-white hover:bg-black">
              <span>Live Example</span>
              <Image src={openNewIcon} alt="open" />
            </a>
          )}
        </div>
      </header>
    </>
  )
}

export default BlogHeader
