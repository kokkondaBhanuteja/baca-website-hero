import { hash } from '@node-rs/argon2'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const json = (value: Record<string, string>) => value as Prisma.InputJsonValue

async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) {
    throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set')
  }

  const passwordHash = await hash(password)
  const admin = await prisma.adminUser.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: {
      email: email.toLowerCase(),
      passwordHash,
      name: 'BACA Admin',
      role: 'SUPER_ADMIN',
    },
  })
  console.log(`✔ Seeded admin user: ${admin.email}`)
}

async function seedCatalogue() {
  // Early stage: a single category — Spices.
  const spices = await prisma.productCategory.upsert({
    where: { slug: 'spices' },
    update: { imageUrl: '/images/cat-spices.jpg' },
    create: {
      slug: 'spices',
      name: json({
        en: 'Spices',
        de: 'Gewürze',
        ar: 'التوابل',
        fr: 'Épices',
        es: 'Especias',
        nl: 'Specerijen',
        it: 'Spezie',
      }),
      description: json({
        en: 'Whole and ground spices — graded at origin and documented for export.',
      }),
      imageUrl: '/images/cat-spices.jpg',
      sortOrder: 0,
      isPublished: true,
    },
  })

  const products = [
    {
      slug: 'green-cardamom',
      image: '/images/product-green-cardamom.jpg',
      name: json({ en: 'Green Cardamom', de: 'Grüner Kardamom', ar: 'هيل أخضر' }),
      summary: json({ en: '8mm bold · Alleppey Green · hand-picked' }),
    },
    {
      slug: 'malabar-black-pepper',
      image: '/images/product-malabar-black-pepper.jpg',
      name: json({ en: 'Malabar Black Pepper', ar: 'فلفل أسود مالابار' }),
      summary: json({ en: 'Garbled · 550–570 g/l · 5mm' }),
    },
    {
      slug: 'turmeric-fingers',
      image: '/images/product-turmeric-fingers.jpg',
      name: json({ en: 'Turmeric Fingers', ar: 'كركم' }),
      summary: json({ en: 'Erode & Salem · 3–5% curcumin' }),
    },
    {
      slug: 'guntur-red-chilli',
      image: '/images/product-guntur-red-chilli.jpg',
      name: json({ en: 'Guntur Red Chilli', ar: 'فلفل أحمر' }),
      summary: json({ en: 'S17 Teja · stemless · high colour' }),
    },
  ]

  for (let index = 0; index < products.length; index += 1) {
    const product = products[index]
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { imageUrl: product.image },
      create: {
        slug: product.slug,
        categoryId: spices.id,
        name: product.name,
        summary: product.summary,
        imageUrl: product.image,
        sortOrder: index,
        isPublished: true,
      },
    })
  }
  console.log(`✔ Seeded category "spices" + ${products.length} products`)
}

type ArticleSeed = {
  slug: string
  category: 'INDUSTRY_INSIGHTS' | 'IMPACT_STORIES' | 'COMMUNITY_ENGAGEMENT'
  featured: boolean
  readMinutes: number
  publishedAt: Date
  coverImageUrl: string
  title: Record<string, string>
  excerpt: Record<string, string>
  body: Record<string, string>
}

async function seedArticles() {
  const articles: ArticleSeed[] = [
    {
      slug: 'why-we-started-baca',
      category: 'INDUSTRY_INSIGHTS',
      featured: true,
      readMinutes: 6,
      publishedAt: new Date('2026-01-15'),
      coverImageUrl: '/images/insight-3.jpg',
      title: {
        en: 'Why we started BACA — and what we want to do differently',
      },
      excerpt: {
        en: 'A short note on what we think is broken about most Indian spice exports, and what we are building instead.',
      },
      body: {
        en: 'Most Indian spice exports pass through three or four hands before they reach a buyer. Each hand adds a margin and removes a little accountability. By the time a container lands, no one can tell you which farm the cardamom came from, or what it was graded against.\n\nWe started BACA to collapse that distance. We buy at origin, from the same farming families season after season. We grade at source, against ISO 22000 and HACCP, and we document every lot before it ships.\n\nThat is the whole idea: fewer hands, more traceability, and a grade in the container that matches the grade on the certificate — every single time.',
      },
    },
    {
      slug: 'reading-the-2026-cardamom-market',
      category: 'INDUSTRY_INSIGHTS',
      featured: false,
      readMinutes: 5,
      publishedAt: new Date('2026-02-04'),
      coverImageUrl: '/images/product-green-cardamom.jpg',
      title: {
        en: 'Reading the 2026 cardamom market — small estates, new price discovery',
      },
      excerpt: {
        en: "Why this season's auctions are behaving differently, and what it means for buyers.",
      },
      body: {
        en: 'The 2026 cardamom season is being shaped by small estates rather than the large auction lots that used to set the price. Yields from the high ranges of Kerala have been uneven, and buyers who once waited for the big sales are now contracting earlier and directly.\n\nFor importers, that means two things. Price discovery is happening sooner, and the premium for documented, single-estate material is widening.\n\nWe think this is healthy. It rewards growers who invest in quality, and it gives buyers a clearer line of sight to where their spice actually comes from.',
      },
    },
    {
      slug: 'the-cost-of-cheap-turmeric',
      category: 'IMPACT_STORIES',
      featured: false,
      readMinutes: 3,
      publishedAt: new Date('2026-03-02'),
      coverImageUrl: '/images/product-turmeric-fingers.jpg',
      title: {
        en: 'The cost of cheap turmeric — and why we will not sell it',
      },
      excerpt: {
        en: 'Curcumin, lead-chromate adulteration, and the price of doing it properly.',
      },
      body: {
        en: 'There is always a cheaper turmeric. The question is what you are paying for when you buy it.\n\nCheap turmeric is often low in curcumin, the compound buyers actually want. Worse, some lots are brightened with lead chromate — an industrial pigment that has no business in food. It is invisible in a sample and dangerous in a kitchen.\n\nWe test every lot for curcumin content and for adulteration before it ships. It costs us margin, and it costs us volume, because we turn away material that does not pass. We think that is the right trade.',
      },
    },
  ]

  for (const article of articles) {
    await prisma.blogArticle.upsert({
      where: { slug: article.slug },
      update: { coverImageUrl: article.coverImageUrl },
      create: {
        slug: article.slug,
        category: article.category,
        featured: article.featured,
        readMinutes: article.readMinutes,
        status: 'PUBLISHED',
        publishedAt: article.publishedAt,
        coverImageUrl: article.coverImageUrl,
        title: json(article.title),
        excerpt: json(article.excerpt),
        body: json(article.body),
      },
    })
  }
  console.log(`✔ Seeded ${articles.length} blog articles`)
}

async function main() {
  await seedAdminUser()
  await seedCatalogue()
  await seedArticles()
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
