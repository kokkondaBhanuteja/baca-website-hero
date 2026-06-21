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
// catalogue + blogs. Delete products before categories (Product.categoryId is
// onDelete: Restrict) and articles before blog types (BlogArticle.blogTypeId is
// onDelete: Restrict). Gallery and Enquiry rows are left untouched.
async function wipeContent() {
  await prisma.product.deleteMany()
  await prisma.blogArticle.deleteMany()
  await prisma.productCategory.deleteMany()
  await prisma.blogType.deleteMany()
  console.log('✔ Cleared products, articles, categories, and blog types')
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

const BLOG_TYPE_SEED: { slug: string; name: Record<string, string> }[] = [
  { slug: 'industry-insights', name: { en: 'Industry Insights' } },
  { slug: 'origin-stories', name: { en: 'Origin Stories' } },
  { slug: 'recipes-and-uses', name: { en: 'Recipes & Uses' } },
  { slug: 'sustainability', name: { en: 'Sustainability' } },
]

async function seedBlogTypes(): Promise<Record<string, string>> {
  const idBySlug: Record<string, string> = {}
  for (let index = 0; index < BLOG_TYPE_SEED.length; index += 1) {
    const type = BLOG_TYPE_SEED[index]
    const created = await prisma.blogType.create({
      data: {
        slug: type.slug,
        name: json(type.name),
        sortOrder: index,
        isPublished: true,
      },
    })
    idBySlug[type.slug] = created.id
  }
  console.log(`✔ Seeded ${BLOG_TYPE_SEED.length} blog types`)
  return idBySlug
}

type ArticleSeed = {
  slug: string
  typeSlug:
    | 'industry-insights'
    | 'origin-stories'
    | 'recipes-and-uses'
    | 'sustainability'
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

async function seedArticles(blogTypeIdBySlug: Record<string, string>) {
  const articles: ArticleSeed[] = [
    {
      slug: 'reading-the-2026-cardamom-market',
      typeSlug: 'industry-insights',
      featured: true,
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
      slug: 'how-we-grade-cashew-for-export',
      typeSlug: 'industry-insights',
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
        en: 'A cashew grade like W320 looks simple — "320 kernels to the pound" — but the number only tells you size. A real export grade is four things at once: count, colour, breakage and moisture.\n\nCount sets the size band. Colour separates first-quality white wholes from scorched or dessert grades. Breakage decides whether a lot ships as wholes or drops to splits and pieces. And moisture, held under 5%, is what keeps the kernel crisp.\n\nWe sort against all four before a container is sealed. It is why two lots both labelled W320 can be very different.',
      },
    },
    {
      slug: 'what-asta-colour-really-tells-you',
      typeSlug: 'industry-insights',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-05-12'),
      coverImageUrl: '/images/product-guntur-red-chilli.jpg',
      authorName: 'BACA Team',
      authorRole: 'Quality',
      title: {
        en: 'What ASTA colour really tells you about a red chilli',
      },
      excerpt: {
        en: 'Heat gets the headlines, but for most buyers colour is what sells the chilli.',
      },
      body: {
        en: 'Buyers talk about Scoville heat, but in practice it is ASTA colour that moves a red chilli. ASTA measures extractable colour — the pigment that survives drying and shows up in a finished sauce, oil or blend.\n\nGuntur S17 Teja sits in the 32–38 ASTA band, high enough for vivid colour without the cost of premium paprika grades. Heat and colour are not the same axis, and a good spec sheet reports both.\n\nWe grade for colour and heat separately so a buyer can match the chilli to the product, not just the heat label on the bag.',
      },
    },
    {
      slug: 'sourcing-season-with-idukki-growers',
      typeSlug: 'origin-stories',
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
        en: 'Every cardamom season starts the same way for us: on a hillside in Idukki, with the families who have grown these capsules for generations. We do not buy through a chain of agents. We sit with growers, agree a grade and a price, and come back the next season.\n\nThat continuity changes what we can ask for. Growers who know we will return invest in better curing and cleaner picking, because the quality is rewarded directly rather than averaged away in a pooled auction lot.\n\nIt is slower than buying off the exchange, and it costs more. But it is the only way we know to put a name and a place behind every lot we ship.',
      },
    },
    {
      slug: 'the-turmeric-fields-of-erode',
      typeSlug: 'origin-stories',
      featured: false,
      readMinutes: 5,
      publishedAt: new Date('2026-04-18'),
      coverImageUrl: '/images/product-turmeric-fingers.jpg',
      authorName: 'BACA Team',
      authorRole: 'Sourcing',
      title: {
        en: 'The turmeric fields of Erode — a place that became a grade',
      },
      excerpt: {
        en: 'How one district in Tamil Nadu turned its name into a global byword for turmeric quality.',
      },
      body: {
        en: 'Say "Erode turmeric" anywhere in the trade and people know what you mean: hard, bright fingers with naturally high curcumin. The district turned its name into a grade through generations of growing and curing the same crop.\n\nWe work the Erode and Salem belts because the soil and the know-how are hard to replicate elsewhere. The fingers cure denser and hold colour without any artificial help.\n\nOrigin is not marketing here — it is the reason the lot performs.',
      },
    },
    {
      slug: 'why-malabar-pepper-carries-a-coastline',
      typeSlug: 'origin-stories',
      featured: false,
      readMinutes: 3,
      publishedAt: new Date('2026-05-28'),
      coverImageUrl: '/images/product-malabar-black-pepper.jpg',
      authorName: 'BACA Team',
      authorRole: 'Sourcing',
      title: {
        en: 'Why Malabar pepper still carries the name of a coastline',
      },
      excerpt: {
        en: 'The pepper that gave a coast its reputation, and the bulk density that proves it.',
      },
      body: {
        en: 'The Malabar coast gave black pepper its name long before bulk density was a spec line. Today that heritage shows up as a number: 550–570 g/l, the density that tells a buyer the berries are dense and fully mature.\n\nGarbled Malabar pepper is cleaned to remove light and broken berries, leaving a uniform, pungent lot. The place and the grade are the same story told twice.\n\nWe buy from the Wayanad and Coorg ranges that feed that coast, and we document the density on every lot.',
      },
    },
    {
      slug: 'cardamom-three-ways-in-the-kitchen',
      typeSlug: 'recipes-and-uses',
      featured: false,
      readMinutes: 3,
      publishedAt: new Date('2026-02-22'),
      coverImageUrl: '/images/product-green-cardamom.jpg',
      authorName: 'BACA Team',
      authorRole: 'Editorial',
      title: {
        en: 'Green cardamom, three ways — from chai to slow-braised meat',
      },
      excerpt: {
        en: 'A bold Alleppey capsule is a different ingredient depending on how you open it.',
      },
      body: {
        en: 'Cardamom changes character with how you treat it. Crushed whole into simmering milk, it perfumes chai without bitterness. Ground fresh, it lifts a cake or a kheer. Bruised and dropped into a slow braise, it threads sweetness through rich meat.\n\nThe trick is to grind only what you need. The volatile oils that make a bold Alleppey capsule worth buying fade fast once the pod is opened.\n\nBuy whole, grind late, and a single grade does the work of three.',
      },
    },
    {
      slug: 'a-simple-guide-to-blooming-turmeric',
      typeSlug: 'recipes-and-uses',
      featured: false,
      readMinutes: 3,
      publishedAt: new Date('2026-03-30'),
      coverImageUrl: '/images/insight-2.jpg',
      authorName: 'BACA Team',
      authorRole: 'Editorial',
      title: {
        en: 'A simple guide to blooming turmeric for colour and flavour',
      },
      excerpt: {
        en: 'Why a minute in hot oil changes everything turmeric does in a dish.',
      },
      body: {
        en: 'Raw turmeric stirred in at the end tastes flat and dusty. Bloomed — cooked briefly in hot oil or ghee at the start — it turns earthy, round and deeply coloured.\n\nThe heat releases the fat-soluble curcumin that carries both colour and flavour. Thirty to sixty seconds is enough; push it too far and it turns bitter.\n\nWith a high-curcumin Erode grade, a little goes a long way, so bloom gently and taste as you go.',
      },
    },
    {
      slug: 'building-a-house-blend-with-guntur-chilli',
      typeSlug: 'recipes-and-uses',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-05-02'),
      coverImageUrl: '/images/cat-spices.jpg',
      authorName: 'BACA Team',
      authorRole: 'Editorial',
      title: {
        en: 'Building a house chilli blend with Guntur S17',
      },
      excerpt: {
        en: 'How to balance heat, colour and aroma when a single chilli anchors the mix.',
      },
      body: {
        en: 'A good house blend usually leans on one workhorse chilli. Guntur S17 Teja is a fair anchor: enough heat to register, enough ASTA colour to look the part, and a clean, direct flavour that takes additions well.\n\nStart with Guntur for the base, add a milder, high-colour chilli to deepen the red, and finish with a small aromatic note — a little roasted cumin or coriander.\n\nGrade matters here: stemless, low-moisture chilli grinds cleaner and stores longer than market-grade material.',
      },
    },
    {
      slug: 'what-traceability-actually-costs',
      typeSlug: 'sustainability',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-01-28'),
      coverImageUrl: '/images/insight-3.jpg',
      authorName: 'BACA Team',
      authorRole: 'Founders',
      title: {
        en: 'What traceability actually costs — and who should pay for it',
      },
      excerpt: {
        en: 'Documenting every lot is not free. Here is where the cost goes and why we carry it.',
      },
      body: {
        en: 'Traceability sounds like a feature until you price it. Documenting every lot means grading at source, keeping records that survive an audit, and turning away material that cannot be traced.\n\nThat cost lands somewhere. We choose to carry most of it rather than push it onto growers, because the growers are the ones whose names make the documentation worth anything.\n\nThe payoff is a container whose certificate matches its contents — every time. For buyers who have been burned, that is worth paying for.',
      },
    },
    {
      slug: 'the-cost-of-cheap-turmeric',
      typeSlug: 'sustainability',
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
      slug: 'why-we-started-baca',
      typeSlug: 'sustainability',
      featured: false,
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
        en: 'Most Indian spice exports pass through three or four hands before they reach a buyer. Each hand adds a margin and removes a little accountability. By the time a container lands, no one can tell you which farm the cardamom came from.\n\nWe started BACA to collapse that distance. We buy at origin, from the same farming families season after season. We grade at source, against ISO 22000 and HACCP, and we document every lot before it ships.\n\nThat is the whole idea: fewer hands, more traceability, and a grade in the container that matches the grade on the certificate.',
      },
    },
  ]

  for (const article of articles) {
    await prisma.blogArticle.create({
      data: {
        slug: article.slug,
        blogTypeId: blogTypeIdBySlug[article.typeSlug],
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
  const blogTypeIdBySlug = await seedBlogTypes()
  await seedArticles(blogTypeIdBySlug)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
