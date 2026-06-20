# Project Map for AI Agents (Cursor, Claude, Copilot, etc.)

BACA (Bharat Cargo) — Next.js 16 marketing site + admin CMS for an India-based spice/commodity export house.

## You are here

Cold-start reading order:

1. **`CLAUDE.md`** (root) — load-bearing project rules. Read first.
2. **`INDEX.md`** (root) — manifest of every per-file `.claude.md`, grouped by kind.
3. **This file** — agent-facing conventions and grep recipes.

## ⚠️ Hard rule before ANY code edit — READ + UPDATE the sibling .claude.md

This project has a per-file `.claude.md` next to every component, service, schema, page, layout,
loading, error, and API route. **Treat it as part of the file, not as separate documentation.**

**Before** editing `<path>/<name>.{ts,tsx}` → **read** `<path>/<name>.claude.md` first.
It tells you the file's `purpose`, `exports`, `imports_from`, `called_by`, business logic, and constraints.

**After** editing, if any of the following changed, **update the sibling `.claude.md` in the same change**:

| Code change                                         | Doc field to update                             |
| --------------------------------------------------- | ----------------------------------------------- |
| Exports added / removed / renamed                   | frontmatter `exports:` + Exports list in body   |
| New external dependency                             | frontmatter `imports_from:` + Dependencies list |
| Business logic changed (branch, check, side effect) | Business Logic bullets                          |
| New consumer / new caller of a service              | `called_by:` (lib/ files only)                  |
| Auth posture changed (e.g. requireAdmin added)      | `auth:` field                                   |
| Route / HTTP method / i18n namespace changed        | `route:` / `methods:` / `i18n_namespace:`       |

**A stale `.claude.md` misleads the next agent that reads it.** Always re-read first; update if anything
material changed. If the matching `.claude.md` is missing, **create it before merging the change** —
the convention is non-negotiable.

### Quick find: where is the sibling doc?

For a file at `<dir>/<name>.<ext>`, the sibling doc is `<dir>/<name>.claude.md`. Examples:

| Editing                                                    | Sibling doc                                                       |
| ---------------------------------------------------------- | ----------------------------------------------------------------- |
| `components/ui/dropdown/dropdown.tsx`                      | `components/ui/dropdown/dropdown.claude.md`                       |
| `lib/server/services/category-service/category-service.ts` | `lib/server/services/category-service/category-service.claude.md` |
| `app/(site)/[locale]/products/page.tsx`                    | `app/(site)/[locale]/products/page.claude.md`                     |
| `app/api/products/route.ts`                                | `app/api/products/route.claude.md`                                |

## How docs are organized

- **Every component, service, validation schema, API endpoint, auth helper, HTTP helper, page, layout, loading, error, and route handler has a sibling `<name>.claude.md`.**
- Each `.claude.md` starts with a YAML frontmatter block declaring `kind`, `name`, `exports`, `imports_from`, `called_by` (for lib/), and other structured fields.
- Folders also carry a folder-level `CLAUDE.md` map.

## Grep recipes

| What you want                                            | How to find it                                                                                 |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| All services                                             | `grep -rln "kind: service" --include='*.claude.md'`                                            |
| All validation schemas                                   | `grep -rln "kind: schema" --include='*.claude.md'`                                             |
| All admin-guarded API routes                             | `grep -rln "auth: \"requireAdmin\"" --include='*.claude.md'`                                   |
| Doc for a specific symbol (e.g. `createUploadSignature`) | `grep -rln "createUploadSignature" --include='*.claude.md'`                                    |
| Components that read a translation namespace             | `grep -rln "i18n_namespace: \"productPreview\"" --include='*.claude.md'`                       |
| Source file of a doc                                     | look at the doc's `file:` frontmatter field                                                    |
| Consumers of a service                                   | look at the service's `called_by:` field, or `grep -rln "from '@/lib/server/services/<name>'"` |

## Hard rules (from `CLAUDE.md`)

1. **Server/client boundary is compiler-enforced** (`import 'server-only'` / `'client-only'` at the top of every file in `lib/server` and `lib/api-client`).
2. **No `any`.** TypeScript strict; the build fails on type errors.
3. **No native `<select>`.** Use `@/components/ui/dropdown` everywhere.
4. **All user-visible text via next-intl** (`useTranslations` / `getTranslations`) — never inline English.
5. **All colors via `@theme` tokens** (`bg-paper`, `text-ink`, etc.) — no inline hex.
6. **All static layout dimensions via `@theme` tokens** (`pt-header-offset`, `max-w-content`, `ease-baca`, `duration-baca-fast/slow`) — no `pt-[88px]` style arbitrary values for shared values.
7. **Per-component folder + sibling `.claude.md`** is the documentation convention. Creating a new component requires creating the folder, the barrel `index.ts`, AND the `.claude.md`.
8. **`const t = useTranslations(ns)`** is the sanctioned single-letter exception (next-intl idiom).

## When making changes

- **Adding a component**: create `components/<area>/<name>/` with `<name>.tsx`, `<name>.claude.md` (filled out), and `index.ts` (`export * from './<name>'`).
- **Adding a service**: create `lib/server/services/<name>/` with the same triplet. Update `called_by` in the new doc with the consumer(s).
- **Adding a route**: place `page.tsx` / `layout.tsx` / `route.ts` per Next.js convention. Add a sibling `.claude.md`.
- **Editing existing code**: update the sibling `.claude.md` in the same PR. An outdated doc is worse than no doc.

## Tooling

- **Type-check**: `pnpm typecheck`
- **Lint**: `pnpm lint`
- **Local dev**: `pnpm dev -- -p 4010`
- **Build**: `pnpm build` (strict TS + full prerender of all locales)
- **DB**: `pnpm prisma migrate deploy` then `pnpm prisma db seed`
