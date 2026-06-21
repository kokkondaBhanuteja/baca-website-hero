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
  /** Extra gallery images (beyond the cover) shown in the detail-page carousel. */
  gallery?: string[]
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
          gallery: ['/images/cat-spices.jpg', '/images/hero-spice.jpg'],
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
          gallery: ['/images/cat-spices.jpg', '/images/hero-spice.jpg'],
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
          gallery: ['/images/cat-spices.jpg'],
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
          gallery: ['/images/cat-spices.jpg', '/images/hero-spice.jpg'],
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
          // Gallery for the carousel: cover first, then any extra images.
          images: [product.image, ...(product.gallery ?? [])].map(
            (url, imageIndex) => ({
              url,
              publicId: `seed:${product.slug}:${imageIndex}`,
            }),
          ) as Prisma.InputJsonValue,
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
  { slug: 'market-insights', name: { en: 'Market Insights' } },
  { slug: 'spices', name: { en: 'Spices' } },
  { slug: 'exports', name: { en: 'Exports' } },
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
  typeSlug: 'market-insights' | 'spices' | 'exports'
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
      typeSlug: 'market-insights',
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
        en: 'The 2026 cardamom season is being shaped by small estates rather than the large auction lots that used to set the price. Yields from the high ranges of Kerala have been uneven, and buyers who once waited for the big sales are now contracting earlier and directly.\n\nFor importers that means two things. Price discovery is happening sooner, and the premium for documented, single-estate material is widening.\n\nWe think this is healthy. It rewards growers who invest in quality and gives buyers a clearer line of sight to where their spice actually comes from.',
      },
    },
    {
      slug: 'why-pepper-prices-moved-this-quarter',
      typeSlug: 'market-insights',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-04-09'),
      coverImageUrl: '/images/insight-3.jpg',
      authorName: 'BACA Team',
      authorRole: 'Trade desk',
      title: {
        en: 'Why pepper prices moved this quarter — supply, freight and the dollar',
      },
      excerpt: {
        en: 'Three forces set the black pepper price this quarter, and only one of them was the harvest.',
      },
      body: {
        en: 'Black pepper rarely moves for a single reason. This quarter the harvest was the smallest input: tight Vietnamese carry-over and a thin Indian crop set the floor, but freight and currency did most of the work above it.\n\nWhen container rates climb, landed cost climbs with them, and buyers quietly shift origin to protect margin. A firmer dollar then re-prices every contract written in it.\n\nFor anyone planning cover, the lesson is to watch freight and FX alongside the crop report — the three together explain the move the crop alone never could.',
      },
    },
    {
      slug: 'what-global-buyers-are-asking-for-in-2026',
      typeSlug: 'market-insights',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-05-15'),
      coverImageUrl: '/images/insight-2.jpg',
      authorName: 'BACA Team',
      authorRole: 'Trade desk',
      title: {
        en: 'What global buyers are asking for in 2026',
      },
      excerpt: {
        en: 'Specifications used to be a formality. This year they are the negotiation.',
      },
      body: {
        en: 'The questions on a first call have changed. Where buyers once led with price, they now lead with proof: a spec sheet, a residue report, a traceable origin.\n\nPart of this is regulation — tighter limits on pesticide residues and aflatoxin across the EU and Gulf. Part of it is risk: nobody wants a rejected container at port.\n\nWe read it as a shift in their favour and ours. Material that is graded and documented at source clears faster and holds its premium, and that is exactly the material we set out to ship.',
      },
    },
    {
      slug: 'freight-and-the-real-cost-of-landed-spice',
      typeSlug: 'market-insights',
      featured: false,
      readMinutes: 5,
      publishedAt: new Date('2026-06-02'),
      coverImageUrl: '/images/global-port.jpg',
      authorName: 'BACA Team',
      authorRole: 'Trade desk',
      title: {
        en: 'Freight and the real cost of landed spice',
      },
      excerpt: {
        en: 'The number on the contract is not the number that lands. Here is the gap.',
      },
      body: {
        en: 'A FOB price tells you what spice costs at the port of loading. It says nothing about what it costs in your warehouse — and in 2026 that gap is wide.\n\nOcean freight, congestion surcharges, insurance and the last-mile haul can add a meaningful share to the landed cost of a container, and they move week to week while the crop price sits still.\n\nWe quote both FOB and CIF for exactly this reason: a buyer planning a year of cover needs to model the lane, not just the lot.',
      },
    },
    {
      slug: 'green-cardamom-grades-explained',
      typeSlug: 'spices',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-02-20'),
      coverImageUrl: '/images/product-green-cardamom.jpg',
      authorName: 'BACA Team',
      authorRole: 'Quality',
      title: {
        en: 'Green cardamom grades explained — AGEB, AGB and bold size',
      },
      excerpt: {
        en: 'What the grade letters mean, and why size and colour set the price.',
      },
      body: {
        en: 'A cardamom grade looks like code until you break it down. AGEB, AGB and AGS describe Alleppey Green capsules sorted by size and colour — bold, well-cured pods at the top, smaller and paler ones below.\n\nSize is measured in millimetres across the capsule; 7–8 mm bold commands the premium because it looks the part and holds aroma. Colour matters next: a deep, even green signals careful curing.\n\nWe grade against AGEB and AGB and publish the size band on every lot, so a buyer is choosing a specification, not a promise.',
      },
    },
    {
      slug: 'malabar-black-pepper-and-bulk-density',
      typeSlug: 'spices',
      featured: false,
      readMinutes: 3,
      publishedAt: new Date('2026-03-12'),
      coverImageUrl: '/images/product-malabar-black-pepper.jpg',
      authorName: 'BACA Team',
      authorRole: 'Quality',
      title: {
        en: 'Malabar black pepper and the meaning of bulk density',
      },
      excerpt: {
        en: '550–570 g/l is the one number that tells you the berry is mature.',
      },
      body: {
        en: 'Bulk density is the quiet workhorse of a pepper spec. Measured in grams per litre, it tells a buyer whether the berries are dense and fully mature or light and underdeveloped.\n\nGarbled Malabar pepper at 550–570 g/l is heavy, pungent and clean — the light and broken berries already removed. Below that band, you are paying for air and stalk.\n\nWe clean to export grade and document the density on every lot, because it is the single fastest way to prove the pepper is what the label says.',
      },
    },
    {
      slug: 'erode-turmeric-and-the-curcumin-question',
      typeSlug: 'spices',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-04-22'),
      coverImageUrl: '/images/product-turmeric-fingers.jpg',
      authorName: 'BACA Team',
      authorRole: 'Quality',
      title: {
        en: 'Erode turmeric and the curcumin question',
      },
      excerpt: {
        en: 'Colour sells turmeric, but curcumin is what buyers are really paying for.',
      },
      body: {
        en: "Turmeric is judged first by its bright finger and even colour, but the value is in the curcumin — the compound behind both the colour and the health claims that drive demand.\n\nErode and Salem fingers run naturally high in curcumin, typically 3–5%, without the artificial brightening that plagues cheaper lots. That natural strength is why the district's name travels.\n\nWe test every lot for curcumin content and for adulteration before it ships, and we would rather show a buyer the certificate than just the colour.",
      },
    },
    {
      slug: 'guntur-chilli-heat-versus-colour',
      typeSlug: 'spices',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-05-18'),
      coverImageUrl: '/images/product-guntur-red-chilli.jpg',
      authorName: 'BACA Team',
      authorRole: 'Quality',
      title: {
        en: 'Guntur chilli — reading heat against colour',
      },
      excerpt: {
        en: 'Scoville heat and ASTA colour are different axes. Most buyers want colour.',
      },
      body: {
        en: 'It is easy to assume a hotter chilli is a better one. In the trade, colour usually matters more: ASTA measures the extractable pigment that shows up in a finished sauce, oil or blend.\n\nGuntur S17 Teja sits in a useful place — real heat at 75,000–85,000 SHU and strong ASTA colour in the 32–38 band, stemless and clean for export.\n\nWe grade heat and colour separately so a buyer can match the chilli to the product, not just the number on the bag.',
      },
    },
    {
      slug: 'what-makes-a-lot-export-ready',
      typeSlug: 'exports',
      featured: false,
      readMinutes: 5,
      publishedAt: new Date('2026-01-30'),
      coverImageUrl: '/images/global-port.jpg',
      authorName: 'BACA Team',
      authorRole: 'Operations',
      title: {
        en: 'What makes a lot export-ready',
      },
      excerpt: {
        en: 'Export-ready is not a grade — it is a stack of paperwork that has to match the goods.',
      },
      body: {
        en: "A lot can be perfectly graded and still not be export-ready. Ready means the goods, the documents and the destination's rules all line up: phytosanitary certificate, certificate of origin, residue and aflatoxin reports, and packing that survives the lane.\n\nThe work happens before the container is sealed. We grade at source, test against the destination's limits, and assemble the document set so the certificate matches the contents.\n\nWhen all of it agrees, a container clears customs quickly. When one piece is missing, it sits at port — and that delay is the most expensive thing in the chain.",
      },
    },
    {
      slug: 'iso-22000-haccp-and-why-documentation-ships',
      typeSlug: 'exports',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-03-06'),
      coverImageUrl: '/images/who-we-are.jpg',
      authorName: 'BACA Team',
      authorRole: 'Compliance',
      title: {
        en: 'ISO 22000, HACCP, and why documentation is what actually ships',
      },
      excerpt: {
        en: 'Food-safety systems are not a badge for the website — they are the reason the goods clear.',
      },
      body: {
        en: 'ISO 22000 and HACCP are often treated as logos. In practice they are working systems: a documented chain of controls from intake to loading that an auditor — or a customs officer — can follow.\n\nThe value shows up at the border. A buyer importing into the EU or the Gulf needs evidence that hazards were controlled, not just a clean-looking sample.\n\nWe grade against these systems and keep records that survive an audit, because in export the documentation is not paperwork around the trade — it is the trade.',
      },
    },
    {
      slug: 'containers-incoterms-and-a-clean-handover',
      typeSlug: 'exports',
      featured: false,
      readMinutes: 4,
      publishedAt: new Date('2026-04-28'),
      coverImageUrl: '/images/cat-nuts.jpg',
      authorName: 'BACA Team',
      authorRole: 'Operations',
      title: {
        en: 'Containers, Incoterms and a clean handover',
      },
      excerpt: {
        en: 'FOB or CIF decides who owns the risk at sea. Pick deliberately.',
      },
      body: {
        en: 'Incoterms look like jargon until a container is delayed and everyone asks who is responsible. FOB hands risk to the buyer at the port of loading; CIF keeps it with the seller through the voyage.\n\nNeither is right or wrong — it depends on who can manage the lane better. A buyer with a strong freight desk often prefers FOB; one who wants a single landed price prefers CIF.\n\nWe quote both and ship in 20-foot containers with packing matched to the route, so the handover is clean and the risk sits where it was agreed.',
      },
    },
    {
      slug: 'building-direct-trade-from-origin',
      typeSlug: 'exports',
      featured: false,
      readMinutes: 5,
      publishedAt: new Date('2026-05-30'),
      coverImageUrl: '/images/cat-spices.jpg',
      authorName: 'BACA Team',
      authorRole: 'Founders',
      title: {
        en: 'Building direct trade from origin',
      },
      excerpt: {
        en: 'Fewer hands between the farm and the container is the whole model.',
      },
      body: {
        en: 'Most Indian spice exports pass through three or four intermediaries before they reach a buyer. Each hand adds a margin and removes a little accountability, until no one can say which farm the lot came from.\n\nOur model is to collapse that distance: buy at origin from the same farming families season after season, grade at source, and document every lot before it ships.\n\nDirect trade is slower and costs more up front. But it is the only way we know to put a name and a place behind a container — and to make the grade inside it match the certificate on it.',
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
