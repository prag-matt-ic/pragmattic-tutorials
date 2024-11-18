import { type Metadata } from 'next'
import Link from 'next/link'

import { getSortedPostsData } from '@/utils/blogPosts'

export const metadata: Metadata = {
  title: 'Badass blueprints',
  description: '',
}

export default async function Posts() {
  const posts = getSortedPostsData()
  return (
    <main className="w-full horizontal-padding">
      <section className="grid grid-cols-4 gap-10 p-12 text-white">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug}>
            <div className="p-8">{JSON.stringify(post)}</div>
          </Link>
        ))}
      </section>
    </main>
  )
}
