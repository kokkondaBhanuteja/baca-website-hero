# lib/shared/ — Both-sides-safe

Type-only DTOs and pure helpers usable from **both** server and client. Nothing here may import
`prisma`, `env`, secrets, or carry `'server-only'`/`'client-only'` — keep it pure so either layer can use it.

```
types/
  localized-text.ts   LocalizedText = { en: string } & Partial<Record<Exclude<Locale,'en'>, string>>
  admin-user-dto.ts   AdminUserDto, AdminRole
  catalogue-dto.ts    ProductCategoryAdminDto / ProductAdminDto (raw LocalizedText, incl. origin/specifications/seasonality)
                      + …PublicDto + ProductDetailPublicDto (resolved strings for the detail page)
  blog-dto.ts         BlogArticleAdminDto / SummaryDto / DetailDto (incl. author name/role/avatar), BlogCategoryValue, BLOG_CATEGORY_KEY
  gallery-dto.ts      GalleryImageAdminDto / GalleryImagePublicDto
  paginated-list.ts   PaginatedList<T> = { items, total, page, pageSize } + AdminListQuery shape +
                      ADMIN_LIST_DEFAULT_PAGE_SIZE constant. Used by every admin paginated list endpoint.
  upload-dto.ts       UploadSignature, UploadFolder, UploadedImage
cloudinary-url.ts     optimizedImageUrl(url): inserts Cloudinary `f_auto,q_auto`; leaves local/non-Cloudinary URLs as-is.
format-date.ts        formatPublishedDate(iso, locale): locale-aware long date via Intl (no dep); '' for null/invalid.
```

Convention: **Admin DTOs** carry raw all-locale `LocalizedText` objects (for edit forms); **Public DTOs** carry
strings already resolved for one locale. Import these with `import type`. (`cn()` lives at `lib/utils.ts`.)
