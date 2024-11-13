import { Metadata, ResolvingMetadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React, { type ButtonHTMLAttributes, type FC, type PropsWithChildren } from 'react'
import Markdown from 'react-markdown'

// import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
// SyntaxHighlighter.registerLanguage('javascript', js)
import { getBlogBySlug, getSortedPostsData } from '@/utils/posts'

type Props = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = getSortedPostsData()
  return posts.map((post) => ({ params: { slug: post.slug } }))
}

export function generateMetadata({ params }: Props, parent: ResolvingMetadata): Metadata {
  const post = getBlogBySlug(params.slug)
  return {
    title: post.title,
    description: post.date,
  }
}

// https://github.com/tailwindlabs/tailwindcss-typography

export default function PostPage({ params }: Props) {
  const post = getBlogBySlug(params.slug)
  console.log(post)

  const { tags = [], title, content } = post

  return (
    <main className="flex w-full flex-col items-center bg-mid font-sans lg:px-8">
      <div className="grid h-full min-h-screen w-full max-w-[1024px] grid-cols-1 grid-rows-[auto_1fr] bg-white">
        {/* TODO: Design nice header with shader visuals */}
        <header className="w-full select-none space-y-4 bg-black px-12 py-32">
          <div className="flex gap-2">
            {tags.map((tag) => (
              <span key={tag} className="rounded bg-green px-2 py-1 font-mono text-sm font-bold tracking-wide">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="max-w-2xl text-5xl font-extrabold leading-snug text-white">{title}</h1>
        </header>
        <article className="prose size-full text-pretty px-12 py-16 text-black xl:prose-lg">
          <Markdown className="w-full">{content}</Markdown>
        </article>
      </div>
    </main>
  )
}

// TODO: handle code blocks syntax highlighting and "copy code to clipboard" button
// TODO: handle images

//   code: string
//   language?: string
//   className?: string
// }

//  components={{
//             code(props) {
//               const { children, className, node, ...rest } = props
//               const match = /language-(\w+)/.exec(className || '')
//               return match ? (
//                 <SyntaxHighlighter
//                   language={match[1]}
//                   customStyle={{ background: 'none' }}
//                   codeTagProps={{ className: 'text-lg' }}>
//                   {String(children).replace(/\n$/, '')}
//                 </SyntaxHighlighter>
//               ) : (
//                 <code {...rest} className={className}>
//                   {children}
//                 </code>
//               )
//             },
//           }}
