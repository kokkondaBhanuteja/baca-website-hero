import Link from 'next/link'

import { prisma } from '@/lib/server/prisma'

const CARDS = [
  { label: 'Products', href: '/admin/products', key: 'products' as const },
  { label: 'Blog articles', href: '/admin/blog-articles', key: 'articles' as const },
  { label: 'Gallery images', href: '/admin/gallery', key: 'gallery' as const },
  { label: 'Enquiries', href: '/admin/enquiries', key: 'enquiries' as const },
]

export default async function AdminDashboardPage() {
  const [products, articles, gallery, enquiries] = await Promise.all([
    prisma.product.count(),
    prisma.blogArticle.count(),
    prisma.galleryImage.count(),
    prisma.enquiry.count(),
  ])
  const counts = { products, articles, gallery, enquiries }

  return (
    <div>
      <h1 className="mb-1 font-heading text-3xl font-light text-ink">Dashboard</h1>
      <p className="mb-8 text-sm text-ink-60">Manage the BACA catalogue and content.</p>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CARDS.map((card) => (
          <Link
            key={card.key}
            href={card.href}
            className="rounded-2xl border border-line bg-paper p-5 transition-colors hover:border-ink/30"
          >
            <p className="font-heading text-4xl font-light text-ink">
              {counts[card.key]}
            </p>
            <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-60">
              {card.label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
