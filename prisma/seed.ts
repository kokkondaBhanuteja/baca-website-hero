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

// Clean slate before reseeding — the seed is the source of truth for the
// catalogue + insights. Delete products before categories (Product.categoryId
// is onDelete: Restrict). Gallery and Enquiry rows are left untouched.
async function wipeContent() {
  await prisma.product.deleteMany()
  await prisma.blogArticle.deleteMany()
  await prisma.productCategory.deleteMany()
  console.log('✔ Cleared existing products, articles, and categories')
}

type ProductSeed = {
  slug: string
  image: string
  name: Prisma.InputJsonValue
  summary: Prisma.InputJsonValue
  description: Prisma.InputJsonValue
  botanicalName: string
  originRegions: string[]
  specs: { label: string; value: string }[]
  harvestMonths: number[]
  peakMonths: number[]
}

type CategorySeed = {
  slug: string
  image: string
  name: Prisma.InputJsonValue
  description: Prisma.InputJsonValue
  products: ProductSeed[]
}

async function seedCatalogue() {
  const categories: CategorySeed[] = [
    {
      slug: 'spices',
      image: '/images/cat-spices.jpg',
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
      products: [
        {
          slug: 'green-cardamom',
          image: '/images/product-green-cardamom.jpg',
          name: json({
            en: 'Green Cardamom',
            de: 'Grüner Kardamom',
            ar: 'هيل أخضر',
          }),
          summary: json({ en: '8mm bold · Alleppey Green · hand-picked' }),
          description: json({
            en: 'Alleppey Green cardamom from the high ranges of Idukki — hand-picked, cured, and graded for size and colour. Bold capsules with a sweet, intense aroma, the grade buyers ask for by name.',
          }),
          botanicalName: 'Elettaria cardamomum',
          originRegions: [
            'Idukki, Kerala',
            'Wayanad, Kerala',
            'Coorg, Karnataka',
          ],
          specs: [
            { label: 'Variety', value: 'Alleppey Green (Malabar / Mysore)' },
            { label: 'Grade', value: 'AGEB · AGB · AGS' },
            { label: 'Size', value: '7–8 mm bold' },
            { label: 'Moisture', value: '≤ 10%' },
            { label: 'Volatile oil', value: '≥ 6%' },
            { label: 'Packaging', value: '5 / 10 / 25 kg jute or vacuum' },
            { label: 'MOQ', value: '5 MT (1×20ft container)' },
            { label: 'HS code', value: '0908.31' },
            { label: 'Incoterms', value: 'FOB Cochin · CIF EU/Dubai/USA' },
          ],
          harvestMonths: [8, 9, 10, 11, 12, 1, 2],
          peakMonths: [10, 11, 12],
        },
        {
          slug: 'malabar-black-pepper',
          image: '/images/product-malabar-black-pepper.jpg',
          name: json({ en: 'Malabar Black Pepper', ar: 'فلفل أسود مالابار' }),
          summary: json({ en: 'Garbled · 550–570 g/l · 5mm' }),
          description: json({
            en: 'Garbled Malabar black pepper — dense, pungent berries cleaned to export grade. High bulk density and a sharp, lingering heat from the coast that gave pepper its name.',
          }),
          botanicalName: 'Piper nigrum',
          originRegions: [
            'Malabar, Kerala',
            'Wayanad, Kerala',
            'Coorg, Karnataka',
          ],
          specs: [
            { label: 'Variety', value: 'Malabar Garbled' },
            { label: 'Grade', value: 'MG1 · TGSEB' },
            { label: 'Bulk density', value: '550–570 g/l' },
            { label: 'Size', value: '4.25–5 mm' },
            { label: 'Moisture', value: '≤ 11%' },
            { label: 'Packaging', value: '25 / 50 kg PP or jute' },
            { label: 'MOQ', value: '5 MT (1×20ft container)' },
            { label: 'HS code', value: '0904.11' },
            { label: 'Incoterms', value: 'FOB Cochin · CIF EU/USA' },
          ],
          harvestMonths: [12, 1, 2, 3],
          peakMonths: [1, 2],
        },
        {
          slug: 'turmeric-fingers',
          image: '/images/product-turmeric-fingers.jpg',
          name: json({ en: 'Turmeric Fingers', ar: 'كركم' }),
          summary: json({ en: 'Erode & Salem · 3–5% curcumin' }),
          description: json({
            en: 'Erode and Salem turmeric fingers — naturally high in curcumin, hard, bright, and free of artificial colour. Every lot is tested for purity and adulteration before it ships.',
          }),
          botanicalName: 'Curcuma longa',
          originRegions: [
            'Erode, Tamil Nadu',
            'Salem, Tamil Nadu',
            'Nizamabad, Telangana',
          ],
          specs: [
            { label: 'Variety', value: 'Erode / Salem fingers' },
            { label: 'Curcumin', value: '3–5%' },
            { label: 'Length', value: '2.5–7 cm fingers' },
            { label: 'Moisture', value: '≤ 10%' },
            { label: 'Purity', value: 'Lead-chromate tested' },
            { label: 'Packaging', value: '25 / 50 kg PP or jute' },
            { label: 'MOQ', value: '5 MT (1×20ft container)' },
            { label: 'HS code', value: '0910.30' },
            { label: 'Incoterms', value: 'FOB Chennai · CIF EU/Gulf' },
          ],
          harvestMonths: [1, 2, 3, 4],
          peakMonths: [2, 3],
        },
        {
          slug: 'guntur-red-chilli',
          image: '/images/product-guntur-red-chilli.jpg',
          name: json({ en: 'Guntur Red Chilli', ar: 'فلفل أحمر' }),
          summary: json({ en: 'S17 Teja · stemless · high colour' }),
          description: json({
            en: 'Guntur S17 Teja chillies — stemless, with the heat and ASTA colour that make them the benchmark Indian chilli. Sorted and graded for export consistency.',
          }),
          botanicalName: 'Capsicum annuum',
          originRegions: ['Guntur, Andhra Pradesh', 'Warangal, Telangana'],
          specs: [
            { label: 'Variety', value: 'S17 Teja' },
            { label: 'Style', value: 'Stemless' },
            { label: 'Heat', value: '75,000–85,000 SHU' },
            { label: 'Colour', value: 'ASTA 32–38' },
            { label: 'Moisture', value: '≤ 11%' },
            { label: 'Packaging', value: '10 / 25 kg cartons or PP' },
            { label: 'MOQ', value: '5 MT (1×20ft container)' },
            { label: 'HS code', value: '0904.21' },
            { label: 'Incoterms', value: 'FOB Chennai · CIF Asia/Gulf' },
          ],
          harvestMonths: [2, 3, 4, 5],
          peakMonths: [3, 4],
        },
      ],
    },
  ]

  let productCount = 0
  for (
    let categoryIndex = 0;
    categoryIndex < categories.length;
    categoryIndex += 1
  ) {
    const category = categories[categoryIndex]
    const created = await prisma.productCategory.create({
      data: {
        slug: category.slug,
        name: category.name,
        description: category.description,
        imageUrl: category.image,
        sortOrder: categoryIndex,
        isPublished: true,
      },
    })

    for (let index = 0; index < category.products.length; index += 1) {
      const product = category.products[index]
      await prisma.product.create({
        data: {
          slug: product.slug,
          categoryId: created.id,
          name: product.name,
          summary: product.summary,
          description: product.description,
          botanicalName: product.botanicalName,
          originRegions: product.originRegions,
          specs: product.specs,
          harvestMonths: product.harvestMonths,
          peakMonths: product.peakMonths,
          imageUrl: product.image,
          sortOrder: index,
          isPublished: true,
        },
      })
      productCount += 1
    }
  }
  console.log(
    `✔ Seeded ${categories.length} categories + ${productCount} products`,
  )
}

type ArticleSeed = {
  slug: string
  category: 'INDUSTRY_INSIGHTS' | 'IMPACT_STORIES' | 'COMMUNITY_ENGAGEMENT'
  featured: boolean
  readMinutes: number
  publishedAt: Date
  coverImageUrl: string
  authorName: string
  authorRole: string
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
      authorName: 'BACA Team',
      authorRole: 'Founders',
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
      coverImageUrl: '/images/insight-1.jpg',
      authorName: 'BACA Team',
      authorRole: 'Trade desk',
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
      coverImageUrl: '/images/insight-2.jpg',
      authorName: 'BACA Team',
      authorRole: 'Quality',
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
    {
      slug: 'sourcing-with-idukki-growers',
      category: 'COMMUNITY_ENGAGEMENT',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-03-20'),
      coverImageUrl: '/images/cat-spices.jpg',
      authorName: 'BACA Team',
      authorRole: 'Sourcing',
      title: {
        en: 'Sourcing season with the cardamom growers of Idukki',
      },
      excerpt: {
        en: 'What buying directly, season after season, actually looks like on the ground in the Kerala high ranges.',
      },
      body: {
        en: 'Every cardamom season starts the same way for us: on a hillside in Idukki, with the families who have grown these capsules for generations. We do not buy through a chain of agents. We sit with growers, agree a grade and a price, and come back the next season — and the one after that.\n\nThat continuity changes what we can ask for. Growers who know we will return invest in better curing and cleaner picking, because the quality is rewarded directly rather than averaged away in a pooled auction lot.\n\nIt is slower than buying off the exchange, and it costs more. But it is the only way we know to put a name and a place behind every lot we ship.',
      },
    },
    {
      slug: 'grading-cashew-for-export',
      category: 'INDUSTRY_INSIGHTS',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-04-05'),
      coverImageUrl: '/images/cat-nuts.jpg',
      authorName: 'BACA Team',
      authorRole: 'Trade desk',
      title: {
        en: 'How we grade cashew for export — and why W320 is only the start',
      },
      excerpt: {
        en: 'Counts, colour, breakage and moisture: a short guide to what actually goes into a cashew grade.',
      },
      body: {
        en: 'A cashew grade like W320 looks simple — "320 kernels to the pound" — but the number only tells you size. A real export grade is four things at once: count, colour, breakage and moisture.\n\nCount sets the size band. Colour separates first-quality white wholes from scorched or dessert grades. Breakage decides whether a lot ships as wholes or drops to splits and pieces. And moisture, held under 5%, is what keeps the kernel crisp and stops it turning rancid in transit.\n\nWe sort against all four before a container is sealed. It is why two lots both labelled W320 can be very different — and why we would rather show a buyer the spec sheet than just the grade.',
      },
    },
  ]

  for (const article of articles) {
    await prisma.blogArticle.create({
      data: {
        slug: article.slug,
        category: article.category,
        featured: article.featured,
        readMinutes: article.readMinutes,
        status: 'PUBLISHED',
        publishedAt: article.publishedAt,
        coverImageUrl: article.coverImageUrl,
        authorName: article.authorName,
        authorRole: article.authorRole,
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
  await wipeContent()
  await seedCatalogue()
  await seedArticles()
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
