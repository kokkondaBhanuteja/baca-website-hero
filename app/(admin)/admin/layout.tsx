import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import '../../globals.css'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BACA Admin',
  robots: { index: false, follow: false },
}

/**
 * Admin root layout — a second, non-localized document root (sibling of the
 * public `[locale]` root). English, LTR, no next-intl provider.
 */
export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} bg-bone`}>
      <body className="font-sans antialiased text-ink">{children}</body>
    </html>
  )
}
