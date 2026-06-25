import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import {
  Cormorant_Garamond,
  DM_Mono,
  Inter,
  Noto_Sans_Arabic,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Noto_Sans_SC,
  Noto_Sans_Thai,
  Playfair_Display,
} from 'next/font/google'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { LOCALE_META, type Locale } from '@/constants/i18n'
import { routing } from '@/i18n/routing'
import { WhatsAppFab } from '@/components/sections/whatsapp-fab'

import '../../globals.css'

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
})
const inter = Inter({
  variable: '--font-inter',
  // Latin + Cyrillic so ru / uk / bg render in the brand sans face.
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
})
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  style: ['normal', 'italic'],
})
const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
})
const notoArabic = Noto_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['400', '500', '600'],
})
// CJK + Thai faces. Each is only routed in via the [lang='..'] CSS overrides
// in globals.css, so other locales never download these files.
const notoSC = Noto_Sans_SC({
  variable: '--font-sc',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  preload: false,
})
const notoJP = Noto_Sans_JP({
  variable: '--font-jp',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  preload: false,
})
const notoKR = Noto_Sans_KR({
  variable: '--font-kr',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  preload: false,
})
const notoThai = Noto_Sans_Thai({
  variable: '--font-thai',
  subsets: ['thai'],
  weight: ['400', '500', '600'],
})

type LayoutParams = { params: Promise<{ locale: string }> }

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: LayoutParams): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: 'metadata',
  })

  return {
    title: t('title'),
    description: t('description'),
    icons: {
      icon: [
        {
          url: '/icon-light-32x32.png',
          media: '(prefers-color-scheme: light)',
        },
        { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-icon.png',
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'light',
  // Mobile browser-chrome colour. Must be a literal (applied before CSS loads,
  // so it can't reference the --paper var); keep it in sync with --paper.
  themeColor: '#7c94b8',
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode } & LayoutParams>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering for this locale.
  setRequestLocale(locale)

  const { dir } = LOCALE_META[locale as Locale]
  const tCommon = await getTranslations({
    locale: locale as Locale,
    namespace: 'common',
  })

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${playfair.variable} ${dmMono.variable} ${notoArabic.variable} ${notoSC.variable} ${notoJP.variable} ${notoKR.variable} ${notoThai.variable} ${cormorant.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {/* Skip link for keyboard users — jumps past the fixed header. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
        >
          {tCommon('skipToContent')}
        </a>
        <NextIntlClientProvider>
          {children}
          {/* Floating WhatsApp action — site-wide on every public page. */}
          <WhatsAppFab />
        </NextIntlClientProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
