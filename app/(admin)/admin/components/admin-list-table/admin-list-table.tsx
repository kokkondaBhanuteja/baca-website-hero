'use client'

import { type ReactNode } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface AdminListTableProps<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  searchValue: string
  onSearchChange: (next: string) => void
  onPageChange: (next: number) => void
  searchPlaceholder: string
  header: ReactNode
  renderRow: (item: T) => ReactNode
  renderCard?: (item: T) => ReactNode
  columnCount: number
  emptyMessage: string
  emptyFilteredMessage?: string
  minWidth?: number
  isPending?: boolean
}

export function AdminListTable<T>({
  items,
  total,
  page,
  pageSize,
  searchValue,
  onSearchChange,
  onPageChange,
  searchPlaceholder,
  header,
  renderRow,
  renderCard,
  columnCount,
  emptyMessage,
  emptyFilteredMessage,
  minWidth = 640,
  isPending = false,
}: AdminListTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const clampedPage = Math.min(Math.max(1, page), totalPages)
  const start = (clampedPage - 1) * pageSize
  const showingFrom = total === 0 ? 0 : start + 1
  const showingTo = Math.min(start + pageSize, total)

  const isAtFirstPage = clampedPage === 1
  const isAtLastPage = clampedPage === totalPages
  const isFiltering = searchValue.trim().length > 0
  const noResultsMessage =
    isFiltering && emptyFilteredMessage ? emptyFilteredMessage : emptyMessage
  const hasCardView = Boolean(renderCard)

  return (
    <div
      className={cn(
        'space-y-4 transition-opacity duration-150',
        isPending && 'opacity-60',
      )}
    >
      <div className="relative max-w-md">
        <Search
          className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-60"
          aria-hidden
        />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 ps-10 text-sm text-ink outline-none focus:border-ink"
        />
      </div>

      {/* TABLE — md+ only when card view is provided, otherwise always */}
      <div
        className={cn(
          'overflow-x-auto rounded-2xl border border-line bg-paper',
          hasCardView && 'hidden md:block',
        )}
      >
        <table className="w-full text-sm" style={{ minWidth }}>
          <thead className="border-b border-line text-left font-mono text-[0.6rem] uppercase tracking-wider text-ink-60">
            {header}
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-5 py-12 text-center text-sm text-ink-60"
                >
                  {noResultsMessage}
                </td>
              </tr>
            ) : (
              items.map((item) => renderRow(item))
            )}
          </tbody>
        </table>
      </div>

      {/* CARDS — mobile only, when caller provides renderCard */}
      {hasCardView && (
        <div className="space-y-3 md:hidden">
          {items.length === 0 ? (
            <div className="rounded-2xl border border-line bg-paper p-8 text-center text-sm text-ink-60">
              {noResultsMessage}
            </div>
          ) : (
            items.map((item) => renderCard!(item))
          )}
        </div>
      )}

      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <p className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-60">
          {total === 0
            ? 'No results'
            : `Showing ${showingFrom}–${showingTo} of ${total}`}
        </p>
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onPageChange(clampedPage - 1)}
            disabled={isAtFirstPage}
            aria-label="Previous page"
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink/70 transition-colors',
              isAtFirstPage
                ? 'cursor-not-allowed opacity-40'
                : 'hover:bg-bone hover:text-ink',
            )}
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
          </button>
          <span
            aria-live="polite"
            className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-60"
          >
            Page {clampedPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => onPageChange(clampedPage + 1)}
            disabled={isAtLastPage}
            aria-label="Next page"
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink/70 transition-colors',
              isAtLastPage
                ? 'cursor-not-allowed opacity-40'
                : 'hover:bg-bone hover:text-ink',
            )}
          >
            <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}
