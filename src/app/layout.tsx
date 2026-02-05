import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NICU Dose Calculator',
  description: 'Professional dose calculator for Neonatal Intensive Care Units with Arabic RTL support',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
