import { Metadata, ResolvingMetadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import React, { type ButtonHTMLAttributes, type FC, type PropsWithChildren } from 'react'
import Markdown from 'react-markdown'

// import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
// import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
// SyntaxHighlighter.registerLanguage('javascript', js)
import { getPostBySlug } from '@/utils/posts'

type Props = {
  params: {
    slug: string
  }
}

// export async function generateStaticParams() {}

// TODO: setup metadata like SE website
export function generateMetadata({ params }: Props, parent: ResolvingMetadata): Metadata {
  const post = getPostBySlug(params.slug)
  return {
    title: post.title,
    description: post.date,
  }
}

// https://github.com/tailwindlabs/tailwindcss-typography

export default function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug)
  console.log(post)

  // TODO: handle code blocks syntax highlighting and "copy code to clipboard" button
  // TODO: handle images

  //     code: string
  //   language?: string
  //   className?: string
  // }

  const { tags = [], title, content } = post

  return (
    <main className="bg-mid flex w-full flex-col items-center font-sans lg:px-8">
      <div className="grid h-full min-h-screen max-w-full grid-cols-1 grid-rows-[auto_1fr] bg-white px-12 py-16">
        <header className="w-full pb-10">
          <div className="flex gap-2">
            {tags.map((tag) => (
              <span key={tag} className="py-2 font-mono text-sm tracking-wide">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-5xl font-extrabold">{title}</h1>
        </header>
        <article className="prose xl:prose-lg h-full w-full text-pretty text-black">
          <Markdown>{content}</Markdown>
        </article>
      </div>
    </main>
  )
}

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
