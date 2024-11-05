import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import CustomCursor from '@/components/Cursor'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { template: '%s | Pragmattic', default: 'Pragmattic | design and engineering' },
  description: 'Frontend development for commercial projects',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-off-black`}>
        {children}
        <CustomCursor />
      </body>
    </html>
  )
}
