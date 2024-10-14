import CustomCursor from '@/components/Cursor'
import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pragmattic | Design and Engineering',
  description: 'Cinematic coding for commercial projects, by Matthew Frawley',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        {children}
        <CustomCursor />
      </body>
    </html>
  )
}
