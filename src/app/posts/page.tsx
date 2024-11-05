import { type Metadata } from 'next'
import Link from 'next/link'

import { getSortedPostsData } from '@/utils/posts'

type Props = {}

export async function generateStaticParams() {}

export const metadata: Metadata = {
  title: 'Posts',
  description: 'Case study description',
}

export default function Posts() {
  const posts = getSortedPostsData()
  return (
    <main className="horizontal-padding w-full">
      <section className="grid grid-cols-4 gap-10 p-12 text-white">
        {posts.map((post) => (
          <Link href={`/posts/${post.slug}`} key={post.slug}>
            <div className="p-8">{JSON.stringify(post)}</div>
          </Link>
        ))}
      </section>
    </main>
  )
}
