import React, { type FC, type ReactNode } from 'react'

import Avatar from '@/components/avatar/Avatar'
import { type PostMetadata } from '@/utils/posts'

import HeaderCanvas from './HeaderCanvas'

type Props = PostMetadata

const BlogHeader: FC<Props> = ({ title, tags, exampleUrl, date }) => {
  return (
    <header className="relative flex w-full select-none bg-off-black">
      <HeaderCanvas />
      <div className="relative z-10 flex size-full flex-col items-center space-y-5 px-12 py-40">
        <div className="flex flex-wrap justify-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-mid px-2 py-1 font-mono text-sm font-semibold tracking-wide text-white">
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
        <Avatar />
        <span className="text-sm font-medium">{date}</span>

        {/* {!!exampleUrl && (
          <a target="_blank" href={exampleUrl} className="rounded bg-off-black px-4 py-1 text-white">
            Live Example
          </a>
        )} */}
      </div>
    </header>
  )
}

export default BlogHeader
