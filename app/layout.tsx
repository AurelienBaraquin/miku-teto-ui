import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MIKU PROTOCOL — Hatsune Miku Unit 01',
  description: 'MIKU PROTOCOL — Experience the Digital Diva. Hatsune Miku ultra-aggressive Persona 5 inspired single-page experience.',
  keywords: ['Hatsune Miku', 'Vocaloid', 'MIKU PROTOCOL', 'Persona 5', 'music'],
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
