# Project Documentation Index

Every meaningful unit of code in this project has a per-file `.claude.md` sibling with structured YAML frontmatter (`kind`, `name`, `exports`, `imports_from`, etc.). This index lists them all, grouped by kind.

## How to use this index

- **Cold-start an AI agent**: read this file + `CLAUDE.md` + `AGENTS.md`. That's the whole project map.
- **Find a doc by kind**: `grep "kind: service"` across the repo, or scan the section below.
- **Find a doc by exported symbol**: `grep "exports:" -A 10` — frontmatter lists every export.
- **Find who calls a service**: look at the `called_by` field in the service's frontmatter, OR grep `from '@/lib/server/services/<name>'`.
- **Find the source file**: every `.claude.md` declares its `file:` in frontmatter.

### Components (UI primitives, sections, layout, shared, admin) (48)

- [`AdminListSkeleton`](<app/(admin)/admin/components/admin-list-skeleton/admin-list-skeleton.claude.md>) — The single generic loading skeleton for every admin dashboard page. Replaces what
- [`AdminShell`](<app/(admin)/admin/components/admin-shell/admin-shell.claude.md>) — Admin dashboard chrome: fixed sidebar nav + main content area. Shows admin email + logout button.
- [`BlogArticleForm`](<app/(admin)/admin/components/blog-article-form/blog-article-form.claude.md>) — Blog article create/edit form: slug, category dropdown, localized title/excerpt/body, cover image, read minutes, status, featured toggle.
- [`CategoryForm`](<app/(admin)/admin/components/category-form/category-form.claude.md>) — Product category create/edit form: slug, localized name/description, category image, sort order, published toggle.
- [`DeleteEntityButton`](<app/(admin)/admin/components/delete-entity-button/delete-entity-button.claude.md>) — Generic delete button for admin lists: confirms via window.confirm, then calls the appropriate API delete method.
- [`EnquiryStatusControl`](<app/(admin)/admin/components/enquiry-status-control/enquiry-status-control.claude.md>) — Inline dropdown status selector for enquiries: NEW | READ | ARCHIVED. Updates via API and re-renders.
- [`GalleryUploaderForm`](<app/(admin)/admin/components/gallery-uploader-form/gallery-uploader-form.claude.md>) — Single-image gallery upload form: select image (via ImageUploader), optional caption (via LocalizedTextInput), upload to gallery.
- [`ImageUploader`](<app/(admin)/admin/components/image-uploader/image-uploader.claude.md>) — Cloudinary signed upload component: get signature from backend, POST file directly to Cloudinary, capture URL + public_id.
- [`LocalizedTextInput`](<app/(admin)/admin/components/localized-text-input/localized-text-input.claude.md>) — Multi-locale input: tabs for each locale, English required, others optional. Rendered as text or textarea. Dots indicate filled locales.
- [`ProductForm`](<app/(admin)/admin/components/product-form/product-form.claude.md>) — Product create/edit form: slug, category dropdown, localized name/summary/description, product image, sort order, published toggle.
- [`FooterColumns`](components/layout/site-footer/footer-columns/footer-columns.claude.md) — Middle grid of footer: description + address block, localized nav columns, certifications strip. Opts into parent's [data-footer-reveal] ani
- [`FooterLink`](components/layout/site-footer/footer-link/footer-link.claude.md) — Hover-underline link primitive: renders a link with animated saffron underline on hover + arrow icon slide-in.
- [`FooterMarquee`](components/layout/site-footer/footer-marquee/footer-marquee.claude.md) — Top strip of footer: localized taglines scrolling horizontally on CSS keyframe animation (baca-marquee).
- [`FooterWordmark`](components/layout/site-footer/footer-wordmark/footer-wordmark.claude.md) — Oversized ocean wordmark montage at the bottom of footer: wraps WordmarkSlideshow with 4 ocean images cycling.
- [`SiteFooter`](components/layout/site-footer/site-footer.claude.md) — Site-wide footer: orchestrates [data-footer-reveal] GSAP scroll animations, includes marquee + columns + wordmark + legal strip.
- [`DesktopNav`](components/layout/site-header/desktop-nav/desktop-nav.claude.md) — Desktop nav row (hidden below lg): plain text links with optional hover dropdowns for Products/Insights.
- [`MobileMenu`](components/layout/site-header/mobile-menu/mobile-menu.claude.md) — Full-screen mobile overlay menu (shown below lg): accordion nav, language switcher, contact CTA. Body scroll is locked while open.
- [`SiteHeaderClient`](components/layout/site-header/site-header-client/site-header-client.claude.md) — Header orchestrator: scroll state (transparent → solid), mobile overlay toggle, body-scroll lock, nav-item derivation (Products/Insights dro
- [`SiteHeader`](components/layout/site-header/site-header.claude.md) — Server wrapper for the header: fetches top-3 products + top-3 articles for the current locale and passes them to SiteHeaderClient as nav dro
- [`Approach`](components/sections/approach/approach.claude.md) — Four-pillar value-prop section with scroll-triggered stagger animation. Each card has a top border rule that scales in on scroll.
- [`Certifications`](components/sections/certifications/certifications.claude.md) — Grid of certification/compliance badges with icon, name, and localized sub-label. Each badge fades in on scroll with stagger.
- [`EnquiryForm`](components/sections/contact/enquiry-form/enquiry-form.claude.md) — Public contact form: name, email, company, phone, message. Submits to POST /api/enquiry. Shows success message or field errors on response.
- [`CtaBand`](components/sections/cta-band/cta-band.claude.md) — Full-width dark forest call-to-action band: eyebrow + headline + body + two CTAs (primary saffron + secondary outline).
- [`FeaturedInsights`](components/sections/featured-insights/featured-insights.claude.md) — DB-driven: fetches top 3 published blog articles and renders them in a 3-column card grid with cover, category badge, title, excerpt.
- [`GlobalPresence`](components/sections/global-presence/global-presence.claude.md) — 4-stat strip showing regional presence (countries, certifications, etc.) over a parallax-enabled background image.
- [`HeroEntry`](components/sections/hero-entry/hero-entry.claude.md) — Home-only GSAP entry timeline: header slides down + fades in, then hero-reveal elements stagger up. Runs once on mount; honors reduced motio
- [`Hero`](components/sections/hero/hero.claude.md) — Home hero section: eyebrow + oversized BACA wordmark with per-letter India videos + body text + dual CTA + meta footer (countries/certs coun
- [`Manifesto`](components/sections/manifesto/manifesto.claude.md) — Why-we're-here section: headline + body text + hero-style reveal image (Lusion-style clip + scale). Anchor #why-we-re-here.
- [`MarqueeStrip`](components/sections/marquee-strip/marquee-strip.claude.md) — GSAP banner marquee with scroll-velocity reactivity: seamless horizontal loop speeds up + skews on fast scroll, eases back on idle.
- [`ProductPreview`](components/sections/product-preview/product-preview.claude.md) — DB-driven: fetches published categories and renders each as a full-width feature row with image + name + products list + CTA.
- [`PullQuote`](components/sections/pull-quote/pull-quote.claude.md) — Single oversized editorial testimonial block: large blockquote + author portrait + name + title.
- [`StatsRow`](components/sections/stats-row/stats-row.claude.md) — 4-stat count-up row: numbers animate from 0 to target on intersection, with IntersectionObserver + RAF animation frame.
- [`WhatsappFab`](components/sections/whatsapp-fab/whatsapp-fab.claude.md) — Floating WhatsApp action button fixed in bottom-right corner, links to CONTACT.whatsappUrl.
- [`PageIntro`](components/shared/page-intro/page-intro.claude.md) — Shared inner-page header: eyebrow + oversized H1 + optional intro text. Used on all non-home pages.
- [`Button`](components/ui/button/button.claude.md) — Base button primitive with CVA variants for size/style. Wraps @base-ui ButtonPrimitive with outline, disabled, aria-invalid, and focus-visib
- [`Cursor`](components/ui/cursor/cursor.claude.md) — Desktop-only magnetic cursor: a saffron dot tracks the pointer instantly; a ring trails with easing and morphs to wrap buttons/data-cursor e
- [`Dropdown`](components/ui/dropdown/dropdown.claude.md) — Custom replacement for native `<select>`. Full keyboard support (Arrow/Home/End/Enter/Space/Tab), roving active-descendant pattern, outside-
- [`Eyebrow`](components/ui/eyebrow/eyebrow.claude.md) — Repeated micro-label: saffron horizontal rule (6px wide) + upper-cased mono label. Used above every section heading.
- [`LanguageSwitcher`](components/ui/language-switcher/language-switcher.claude.md) — Locale picker dropdown built on custom Dropdown. Switches language while preserving the current URL path.
- [`MediaReveal`](components/ui/media-reveal/media-reveal.claude.md) — GSAP scroll-reveal: image container unmasks with clip-path wipe + fade as it enters the viewport. Hidden initial state is inline (no flash o
- [`RevealImage`](components/ui/reveal-image/reveal-image.claude.md) — Lusion/Dribbble-style cinematic image reveal: clip-path wipe paired with a scale-down settle from 1.1→1 as the image enters viewport.
- [`Reveal`](components/ui/reveal/reveal.claude.md) — IntersectionObserver fade-up wrapper: element becomes visible and animates in as it scrolls into view. Honors reduced motion; CSS class 'bac
- [`Rich`](components/ui/rich/rich.claude.md) — Exported object of React components for next-intl t.rich() tag rendering. Allows translators to move styled spans (e.g., <em>…</em>) within
- [`ScrollFx`](components/ui/scroll-fx/scroll-fx.claude.md) — Home-only GSAP driver for scroll-triggered reveals and parallax. Targets [data-reveal] (clip-mask entrance) and [data-parallax] (subtle drif
- [`Skeleton`](components/ui/skeleton/skeleton.claude.md) — Animated placeholder block — used in all loading.tsx files while a Server Component streams. Matches bone/cream palette and pulses gently.
- [`WordmarkLetters`](components/ui/wordmark-letters/wordmark-letters.claude.md) — Per-letter media montage: each BACA letter is its own image/video window. Letters reveal in staggered wipe-up on scroll; still images drift
- [`WordmarkMedia`](components/ui/wordmark-media/wordmark-media.claude.md) — Full-width wordmark revealing a looping video (every.com-style media inside text). Responsive SVG viewBox; video in foreignObject clipped by
- [`WordmarkSlideshow`](components/ui/wordmark-slideshow/wordmark-slideshow.claude.md) — Image-based wordmark montage with cinematic stills revealed by GSAP-driven clip-path sweep (tide-wash effect). Each frame washes in left→rig

### Services (lib/server/services — business logic + prisma) (6)

- [`AdminUserService`](lib/server/services/admin-user-service/admin-user-service.claude.md) — Authenticates admin users by verifying email and password credentials. Returns a generic 401 for both unknown-email and wrong-password to pr
- [`BlogArticleService`](lib/server/services/blog-article-service/blog-article-service.claude.md) — CRUD operations for blog articles with admin (raw localized text) and public (resolved per-locale) read paths. Handles article images via Cl
- [`CategoryService`](lib/server/services/category-service/category-service.claude.md) — CRUD for product categories with localized names/descriptions, images, and sort order. Prevents deletion if category has products. Provides
- [`EnquiryService`](lib/server/services/enquiry-service/enquiry-service.claude.md) — Handles public contact-form submissions and admin enquiry inbox. Tracks enquiry status (NEW, READ, ARCHIVED) and localization context of sub
- [`GalleryService`](lib/server/services/gallery-service/gallery-service.claude.md) — Admin gallery (photos/videos) management with optional localized captions. Tracks media type and publication status. Provides admin list and
- [`ProductService`](lib/server/services/product-service/product-service.claude.md) — CRUD for products with localized names/summaries/descriptions, images, and category relationships. Provides admin list/detail and public pro

### Validation schemas (lib/server/validation — zod) (7)

- [`AuthSchema`](lib/server/validation/auth-schema/auth-schema.claude.md) — Zod schema for admin login credentials. Validates the email/password POST body.
- [`BlogArticleSchema`](lib/server/validation/blog-article-schema/blog-article-schema.claude.md) — Zod schema for blog article creation/update. Validates localized title/excerpt/body, metadata (status, featured), and image fields.
- [`CategorySchema`](lib/server/validation/category-schema/category-schema.claude.md) — Zod schema for product category creation/update. Validates localized name/description, image fields, and publication status.
- [`EnquirySchema`](lib/server/validation/enquiry-schema/enquiry-schema.claude.md) — Zod schema for contact-form submissions (public) and admin status updates. Validates contact info, message, and enquiry status.
- [`GallerySchema`](lib/server/validation/gallery-schema/gallery-schema.claude.md) — Zod schema for gallery item (photo/video) creation. Validates localized captions, image URLs, and media type.
- [`LocalizedTextSchema`](lib/server/validation/localized-text-schema/localized-text-schema.claude.md) — Zod schemas for JSONB localized fields. Defines requiredLocalizedText (en mandatory, others optional) and optionalLocalizedText (all optiona
- [`ProductSchema`](lib/server/validation/product-schema/product-schema.claude.md) — Zod schema for product creation/update. Validates localized name/summary/description, category relationship, image fields, and publication s

### Auth (lib/server/auth) (4)

- [`JwtAuth`](lib/server/auth/jwt/jwt.claude.md) — JWT token signing/verification for admin sessions. Uses HS256 (HMAC-SHA256) with a server-only secret. Tokens are 8 hours TTL, issued by 'ba
- [`PasswordAuth`](lib/server/auth/password/password.claude.md) — Argon2id password hashing and verification. Uses @node-rs/argon2 with OWASP-recommended defaults. Hashing is async and salted; verification
- [`RequireAdmin`](lib/server/auth/require-admin/require-admin.claude.md) — Route guard that ensures an admin is authenticated. Called at the start of every admin route handler. Throws HttpError(401) if no valid sess
- [`SessionAuth`](lib/server/auth/session/session.claude.md) — Session cookie management. Reads the httpOnly 'baca_admin_session' cookie, verifies the JWT inside, and returns the admin user from DB.

### HTTP helpers (lib/server/http) (4)

- [`HandleRoute`](lib/server/http/handle-route/handle-route.claude.md) — Universal error handler for route handlers. Catches HttpError and ZodError and converts them to consistent JSON error responses. Prevents st
- [`HttpError`](lib/server/http/http-error/http-error.claude.md) — Domain error class for all HTTP-level exceptions in services and route handlers. Carries status code, machine-readable code, user message, a
- [`PrismaErrorMapper`](lib/server/http/prisma-error/prisma-error.claude.md) — Translates Prisma-level errors to HttpError with appropriate status codes. Called in try/catch blocks of service write operations.
- [`HttpRespond`](lib/server/http/respond/respond.claude.md) — Thin helper functions for returning JSON responses from route handlers. Provides semantic status codes (200 ok, 201 created, 204 noContent).

### Cloudinary integration (lib/server/cloudinary) (2)

- [`CloudinaryClient`](lib/server/cloudinary/client/client.claude.md) — Singleton Cloudinary v2 client configured with server-side secrets. Used only by sign-upload.ts and seed.ts (image destruction/upload signin
- [`SignUpload`](lib/server/cloudinary/sign-upload/sign-upload.claude.md) — Server-side generation of short-lived Cloudinary upload signatures. The admin uploader gets a signature, then uploads directly to Cloudinary

### Localization helpers (lib/server/localization) (1)

- [`LocalizedValue`](lib/server/localization/localized-value/localized-value.claude.md) — Resolves a JSONB localized field to a plain string for the active locale, with English fallback. Pure helper function used by all public rea

### Env (lib/server/env) (1)

- [`ServerEnvironment`](lib/server/env/env.claude.md) — Centralized environment variable parsing and validation. Parsed once on import; fails fast at boot if a required secret is missing.

### Prisma client singleton (lib/server/prisma) (1)

- [`PrismaClient`](lib/server/prisma/prisma.claude.md) — Singleton PrismaClient reused across hot reloads in development to avoid exhausting the database connection pool.

### Axios client (lib/api-client/axios-instance) (1)

- [`AxiosInstance`](lib/api-client/axios-instance/axios-instance.claude.md) — Single global axios instance for all client-side API calls. Same-origin, sends httpOnly session cookie, handles 401 redirects, and normalize

### API endpoint wrappers (lib/api-client/endpoints) (7)

- [`AuthApi`](lib/api-client/endpoints/auth-api/auth-api.claude.md) — Typed axios wrappers for authentication endpoints. Used by admin login form and session checks.
- [`BlogArticlesApi`](lib/api-client/endpoints/blog-articles-api/blog-articles-api.claude.md) — Typed axios wrappers for blog article CRUD endpoints. Used by admin blog dashboard.
- [`CategoriesApi`](lib/api-client/endpoints/categories-api/categories-api.claude.md) — Typed axios wrappers for category CRUD endpoints. Used by admin categories dashboard.
- [`EnquiryApi`](lib/api-client/endpoints/enquiry-api/enquiry-api.claude.md) — Typed axios wrappers for enquiry endpoints. Public contact form submissions and admin enquiry inbox.
- [`GalleryApi`](lib/api-client/endpoints/gallery-api/gallery-api.claude.md) — Typed axios wrappers for gallery CRUD endpoints. Used by admin gallery dashboard.
- [`ProductsApi`](lib/api-client/endpoints/products-api/products-api.claude.md) — Typed axios wrappers for product CRUD endpoints. Used by admin products dashboard.
- [`UploadsApi`](lib/api-client/endpoints/uploads-api/uploads-api.claude.md) — Typed axios wrapper for Cloudinary upload signature generation. Returns a signed request object that allows the browser uploader to upload d

### Pages (app/.../page.tsx) (20)

- [`PageAppAdminAdminDashboardBlogArticlesId`](<app/(admin)/admin/(dashboard)/blog-articles/[id]/page.claude.md>) — Edit existing blog article. Fetches article (all locales), passes as initial data to BlogArticleForm. notFound() if not found.
- [`PageAppAdminAdminDashboardBlogArticlesNew`](<app/(admin)/admin/(dashboard)/blog-articles/new/page.claude.md>) — Create new blog article form. Renders BlogArticleForm client component with no initial data.
- [`PageAppAdminAdminDashboardBlogArticles`](<app/(admin)/admin/(dashboard)/blog-articles/page.claude.md>) — Admin list of all blog articles. Displays table with title (EN), slug, category, publish status (PUBLISHED/DRAFT), featured badge, and edit/
- [`PageAppAdminAdminDashboardCategoriesId`](<app/(admin)/admin/(dashboard)/categories/[id]/page.claude.md>) — Edit existing category. Fetches category (all locales), passes as initial data to CategoryForm. notFound() if not found.
- [`PageAppAdminAdminDashboardCategoriesNew`](<app/(admin)/admin/(dashboard)/categories/new/page.claude.md>) — Create new category form. Renders CategoryForm client component with no initial data.
- [`PageAppAdminAdminDashboardCategories`](<app/(admin)/admin/(dashboard)/categories/page.claude.md>) — Admin list of all categories. Displays table with name (EN), slug, product count, publish status, and edit/delete actions.
- [`PageAppAdminAdminDashboardEnquiries`](<app/(admin)/admin/(dashboard)/enquiries/page.claude.md>) — Admin enquiries inbox. Displays table of all contact form submissions with name, email, company, phone, message, locale, date, and status (w
- [`PageAppAdminAdminDashboardGallery`](<app/(admin)/admin/(dashboard)/gallery/page.claude.md>) — Admin gallery management. Shows GalleryUploaderForm at top (for adding images via signed Cloudinary upload), then grid of uploaded images wi
- [`PageAppAdminAdminDashboard`](<app/(admin)/admin/(dashboard)/page.claude.md>) — Dashboard overview with 4 count cards (Products, Blog articles, Gallery images, Enquiries). Fetches counts directly via prisma.
- [`PageAppAdminAdminDashboardProductsId`](<app/(admin)/admin/(dashboard)/products/[id]/page.claude.md>) — Edit existing product. Fetches product (all locales) and category list. Passes product as initial data to ProductForm. notFound() if product
- [`PageAppAdminAdminDashboardProductsNew`](<app/(admin)/admin/(dashboard)/products/new/page.claude.md>) — Create new product form. Fetches category list and passes dropdown options to ProductForm client component.
- [`PageAppAdminAdminDashboardProducts`](<app/(admin)/admin/(dashboard)/products/page.claude.md>) — Admin list of all products. Displays table with name (EN), slug, category, publish status, and edit/delete actions. New product button links
- [`PageAppAdminAdminLogin`](<app/(admin)/admin/login/page.claude.md>) — Admin login form. Client component with email/password fields. Submits to authApi.login() which POSTs to /api/auth/login. On success, redire
- [`PageAppSiteLocaleAbout`](<app/(site)/[locale]/_about/page.claude.md>) — About page showing company commitments and CTA to contact. Currently parked behind a `_about` private folder (not exposed as a route) — kept
- [`PageAppSiteLocaleBlogsArticleSlug`](<app/(site)/[locale]/blogs/[articleSlug]/page.claude.md>) — Single article detail page. Displays full article body, cover image, category, read time, and a related articles section. notFound() if arti
- [`PageAppSiteLocaleBlogs`](<app/(site)/[locale]/blogs/page.claude.md>) — List of published blog articles. Displays articles in a 3-column grid with cover images, category badges, read time, title, and excerpt. for
- [`PageAppSiteLocaleContact`](<app/(site)/[locale]/contact/page.claude.md>) — Contact page with company details and enquiry form. Left side displays address, email, phone; right side has EnquiryForm (client component p
- [`PageAppSiteLocaleGallery`](<app/(site)/[locale]/gallery/page.claude.md>) — Gallery of published images. Displays in a responsive grid (2 cols mobile, 3 cols tablet, 4 cols desktop) with captions. force-dynamic ensur
- [`PageAppSiteLocale`](<app/(site)/[locale]/page.claude.md>) — Marketing homepage. Composed of multiple hero and content sections (Hero, Manifesto, Stats, ProductPreview, Approach, Certifications, Global
- [`PageAppSiteLocaleProducts`](<app/(site)/[locale]/products/page.claude.md>) — Catalog of products grouped by category. force-dynamic ensures live updates when admins publish/edit products. Displays categories with loca

### Layouts (app/.../layout.tsx) (3)

- [`LayoutAppAdminAdminDashboard`](<app/(admin)/admin/(dashboard)/layout.claude.md>) — Gate-keeper for all admin dashboard routes. Server component that calls getCurrentAdmin(). If no admin, redirects to /admin/login. Renders A
- [`LayoutAppAdminAdmin`](<app/(admin)/admin/layout.claude.md>) — Root HTML document for the admin dashboard. English only (LTR), no next-intl provider. Loads Inter font and sets robots noindex.
- [`LayoutAppSiteLocale`](<app/(site)/[locale]/layout.claude.md>) — Root HTML document for the public site. Sets up localization via NextIntlClientProvider, loads 4 fonts (Inter, Fraunces, JetBrains Mono, Not

### Loading boundaries (app/.../loading.tsx) (5)

- [`LoadingAppAdminAdminDashboard`](<app/(admin)/admin/(dashboard)/loading.claude.md>) — Single shared loading boundary for every admin dashboard route — products,
- [`LoadingAppSiteLocaleBlogsArticleSlug`](<app/(site)/[locale]/blogs/[articleSlug]/loading.claude.md>) — Skeleton fallback for article detail page. Shows back link, metadata, cover image, and body paragraph placeholders.
- [`LoadingAppSiteLocaleBlogs`](<app/(site)/[locale]/blogs/loading.claude.md>) — Skeleton fallback for blogs list. Shows 6 article card placeholders in a 3-column grid.
- [`LoadingAppSiteLocaleGallery`](<app/(site)/[locale]/gallery/loading.claude.md>) — Skeleton fallback for gallery. Shows 12 square image placeholders in responsive grid.
- [`LoadingAppSiteLocaleProducts`](<app/(site)/[locale]/products/loading.claude.md>) — Skeleton fallback UI while products page data is loading. Shows header, intro skeletons, and 2 category sections with 6 products each.

### Error boundaries (app/.../error.tsx) (2)

- [`ErrorAppAdminAdminDashboard`](<app/(admin)/admin/(dashboard)/error.claude.md>) — Admin dashboard error boundary. Renders error message and retry button without disrupting admin shell.
- [`ErrorAppSiteLocale`](<app/(site)/[locale]/error.claude.md>) — Site-wide error boundary. Renders a self-contained error screen without SiteHeader (header fetches DB data that may have failed). Provides r

### API route handlers (app/api/.../route.ts) (14)

- [`RouteAppApiAuthLogin`](app/api/auth/login/route.claude.md) — Admin login endpoint. Validates email/password, authenticates admin user, signs JWT token, and sets httpOnly session cookie.
- [`RouteAppApiAuthLogout`](app/api/auth/logout/route.claude.md) — Admin logout endpoint. Deletes session cookie.
- [`RouteAppApiAuthMe`](app/api/auth/me/route.claude.md) — Get current admin session. Returns authenticated admin or 401 if no valid session.
- [`RouteAppApiBlogArticlesId`](app/api/blog-articles/[id]/route.claude.md) — Single blog article operations.
- [`RouteAppApiBlogArticles`](app/api/blog-articles/route.claude.md) — Blog article CRUD. GET lists all articles (admin). POST creates new article (admin).
- [`RouteAppApiCategoriesId`](app/api/categories/[id]/route.claude.md) — Single category operations.
- [`RouteAppApiCategories`](app/api/categories/route.claude.md) — Category CRUD. GET lists all categories (admin). POST creates new category (admin).
- [`RouteAppApiEnquiryId`](app/api/enquiry/[id]/route.claude.md) — Update enquiry status (admin only). Used by admin inbox to mark enquiries as read, replied, etc.
- [`RouteAppApiEnquiry`](app/api/enquiry/route.claude.md) — Contact form enquiries. POST is public (anyone can submit from contact page). GET is admin-only (fetch inbox).
- [`RouteAppApiGalleryId`](app/api/gallery/[id]/route.claude.md) — Delete a single gallery image (admin only).
- [`RouteAppApiGallery`](app/api/gallery/route.claude.md) — Gallery image management. GET lists all gallery images (admin). POST creates/adds new image (admin).
- [`RouteAppApiProductsId`](app/api/products/[id]/route.claude.md) — Single product operations. GET fetches product. PATCH updates. DELETE removes.
- [`RouteAppApiProducts`](app/api/products/route.claude.md) — Product CRUD. GET lists all products (admin). POST creates a new product (admin).
- [`RouteAppApiUploadsSign`](app/api/uploads/sign/route.claude.md) — Sign Cloudinary upload request. Admin calls this before direct upload to Cloudinary. Returns signature + other params needed for client-side
