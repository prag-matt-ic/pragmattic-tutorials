import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'

const postsDirectory = path.join(process.cwd(), 'src/posts')

type PostMetadata = {
  title: string
  date: string
  tags: string[]
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

export function getSortedPostsData(): (PostMetadata & { slug: string })[] {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const slug = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse
    const file = matter(fileContents)
    const metadata = formatMetadata(file.data)

    // Combine the data with the id
    return {
      slug,
      ...metadata,
    }
  })
  // Sort posts by date
  return allPostsData.sort(sortByDate)
}

export function getPostBySlug(slug: string): PostMetadata & { content: string } {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const file = matter(fileContents)
  const metadata = formatMetadata(file.data)

  return {
    ...metadata,
    content: file.content,
  }
}
