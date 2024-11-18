import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

export type PostMetadata = {
  title: string
  date: string
  tags: string[]
  youtubeUrl?: string
  exampleUrl?: string
}

const sortByDate = (a: PostMetadata, b: PostMetadata): number => {
  if (a.date < b.date) return 1
  return -1
}

const formatMetadata = (data: any): PostMetadata => {
  return {
    ...data,
    tags: data?.tags?.split(',').map((tag: string) => tag.trim()) ?? [],
  } as PostMetadata
}

const postsDirectory = path.join(process.cwd(), 'src/blog')

export function getSortedPostsData(): (PostMetadata & { slug: string })[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)

  let allPostsData: (PostMetadata & { slug: string })[] = []

  fileNames.forEach((fileName) => {
    // Ignore non-markdown files
    if (!fileName.endsWith('.md')) return

    // Remove ".md" from file name to get id
    const slug = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse
    const file = matter(fileContents)
    const metadata = formatMetadata(file.data)

    // Combine the data with the id
    allPostsData.push({
      slug,
      ...metadata,
    })
  })
  // Sort posts by date
  return allPostsData.sort(sortByDate)
}

export function getBlogBySlug(slug: string): { metadata: PostMetadata; content: string } {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const file = matter(fileContents)
  const metadata = formatMetadata(file.data)

  return {
    metadata,
    content: file.content,
  }
}
