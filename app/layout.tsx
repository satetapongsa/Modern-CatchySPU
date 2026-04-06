import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Modern&Catchy SPU | Project Console',
  description: 'Smart Distributed Registration & AI-Predictive Scaling System',
  generator: 'Modern&Catchy SPU',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster position="top-right" theme="dark" richColors />
        <Analytics />
      </body>
    </html>
  )
}
