// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Srtatus page',
  description: 'Clerk Auth Integration',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body className={inter.className + ' bg-gradient-to-br from-white via-blue-50 to-pink-50 min-h-screen'}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
