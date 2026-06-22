/**
 * One-off maintenance script: remove the SEEDED ("mock") products and blog
 * articles while leaving anything the admin added through the CMS untouched.
 *
 * Identification is by the deterministic seed markers, NOT by timestamp:
 *   - Products: slug ∈ SEED_PRODUCT_SLUGS, OR any image.publicId starts "seed:"
 *     (the seed writes `publicId: "seed:<slug>:<index>"`).
 *   - Articles: slug ∈ SEED_ARTICLE_SLUGS.
 * Categories and blog types are left in place (not requested; admin rows may FK them).
 *
 * Safe by default — DRY RUN unless CONFIRM_DELETE=1 is set.
 *   Dry run : node --env-file=.env --import tsx prisma/scripts/remove-seed-content.ts
 *   Delete  : CONFIRM_DELETE=1 node --env-file=.env --import tsx prisma/scripts/remove-seed-content.ts
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SEED_PRODUCT_SLUGS = new Set([
  'green-cardamom',
  'malabar-black-pepper',
  'turmeric-fingers',
  'guntur-red-chilli',
])

const SEED_ARTICLE_SLUGS = new Set([
  'reading-the-2026-cardamom-market',
  'why-pepper-prices-moved-this-quarter',
  'what-global-buyers-are-asking-for-in-2026',
  'freight-and-the-real-cost-of-landed-spice',
  'green-cardamom-grades-explained',
  'malabar-black-pepper-and-bulk-density',
  'erode-turmeric-and-the-curcumin-question',
  'guntur-chilli-heat-versus-colour',
  'what-makes-a-lot-export-ready',
  'iso-22000-haccp-and-why-documentation-ships',
  'containers-incoterms-and-a-clean-handover',
  'building-direct-trade-from-origin',
])

function hasSeedPublicId(images: unknown): boolean {
  if (!Array.isArray(images)) return false
  return images.some(
    (img) =>
      img &&
      typeof img === 'object' &&
      typeof (img as { publicId?: unknown }).publicId === 'string' &&
      (img as { publicId: string }).publicId.startsWith('seed:'),
  )
}

const stamp = (date: Date) => date.toISOString().slice(0, 16).replace('T', ' ')

async function main() {
  const confirm = process.env.CONFIRM_DELETE === '1'

  const products = await prisma.product.findMany({
    select: { id: true, slug: true, createdAt: true, images: true },
    orderBy: { createdAt: 'asc' },
  })
  const articles = await prisma.blogArticle.findMany({
    select: { id: true, slug: true, createdAt: true, authorName: true },
    orderBy: { createdAt: 'asc' },
  })

  const seedProducts = products.filter(
    (product) =>
      SEED_PRODUCT_SLUGS.has(product.slug) || hasSeedPublicId(product.images),
  )
  const keepProducts = products.filter(
    (product) => !seedProducts.includes(product),
  )
  const seedArticles = articles.filter((article) =>
    SEED_ARTICLE_SLUGS.has(article.slug),
  )
  const keepArticles = articles.filter(
    (article) => !seedArticles.includes(article),
  )

  console.log(`\n=== PRODUCTS (${products.length} total) ===`)
  console.log(`-- SEED → will delete (${seedProducts.length}):`)
  seedProducts.forEach((p) =>
    console.log(`   ✗ ${p.slug}  [${stamp(p.createdAt)}]`),
  )
  console.log(`-- ADMIN → keep (${keepProducts.length}):`)
  keepProducts.forEach((p) =>
    console.log(`   ✓ ${p.slug}  [${stamp(p.createdAt)}]`),
  )

  console.log(`\n=== BLOG ARTICLES (${articles.length} total) ===`)
  console.log(`-- SEED → will delete (${seedArticles.length}):`)
  seedArticles.forEach((a) =>
    console.log(`   ✗ ${a.slug}  [${stamp(a.createdAt)}]`),
  )
  console.log(`-- ADMIN → keep (${keepArticles.length}):`)
  keepArticles.forEach((a) =>
    console.log(`   ✓ ${a.slug}  [${stamp(a.createdAt)}]`),
  )

  if (!confirm) {
    console.log(
      `\nDRY RUN — nothing deleted. Re-run with CONFIRM_DELETE=1 to remove the ${seedProducts.length} products + ${seedArticles.length} articles above.\n`,
    )
    return
  }

  const deletedProducts = await prisma.product.deleteMany({
    where: { id: { in: seedProducts.map((p) => p.id) } },
  })
  const deletedArticles = await prisma.blogArticle.deleteMany({
    where: { id: { in: seedArticles.map((a) => a.id) } },
  })
  console.log(
    `\n✔ Deleted ${deletedProducts.count} seed products and ${deletedArticles.count} seed articles. Kept ${keepProducts.length} products + ${keepArticles.length} articles.\n`,
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
