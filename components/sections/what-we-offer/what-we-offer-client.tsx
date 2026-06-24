'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import Image from 'next/image'

import { Route } from '@/constants/routes'
import { Link } from '@/i18n/navigation'
import type { ProductSpec } from '@/lib/shared/types/catalogue-dto'

export type CarouselProduct = {
  id: string
  slug: string
  name: string
  summary: string
  imageUrl: string | null
  region?: string
  keySpecs?: ProductSpec[]
}

function ProductCard({ product }: { product: CarouselProduct }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-[#2E0F13]/8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(26,11,7,0.14),0_32px_80px_rgba(26,11,7,0.08)]">
      {/* Square image */}
      <Link
        href={`${Route.Products}/${product.slug}`}
        className="relative block shrink-0"
      >
        <div className="relative aspect-square overflow-hidden rounded-t-3xl bg-cream">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-heading text-[6rem] font-light text-[#2E0F13]/10">
                {product.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col px-7 pb-7 pt-3">
        <Link href={`${Route.Products}/${product.slug}`}>
          <h3 className="font-heading mb-2 text-[2rem] font-light leading-[1.08] text-[#1A0B07] transition-opacity hover:opacity-65 sm:text-[2.2rem]">
            {product.name}
          </h3>
        </Link>

        {product.region && (
          <div className="mb-4 flex items-center gap-1.5">
            <MapPin className="h-3 w-3 shrink-0 text-[#8B3A1A]" />
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.22em] text-[#8B3A1A]">
              {product.region}
            </span>
          </div>
        )}

        {product.summary && (
          <p className="mb-5 text-[0.85rem] leading-[1.8] text-[#1A0B07]/50">
            {product.summary}
          </p>
        )}

        {product.keySpecs && product.keySpecs.length > 0 && (
          <div className="mb-6 flex flex-col divide-y divide-[#2E0F13]/[0.07] border-y border-[#2E0F13]/[0.07]">
            {product.keySpecs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center justify-between py-3"
              >
                <span className="text-[0.78rem] text-[#1A0B07]/45">
                  {spec.label}
                </span>
                <span className="font-mono text-[0.76rem] font-bold text-[#1A0B07]">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1" />

        <div className="flex gap-3">
          <Link
            href={`${Route.Products}/${product.slug}`}
            className="flex-1 rounded-xl bg-[#1A0B07] py-3.5 text-center font-mono text-[0.58rem] uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-80"
          >
            Info
          </Link>
          <Link
            href={Route.Contact}
            className="flex-1 rounded-xl border border-[#1A0B07]/20 py-3.5 text-center font-mono text-[0.58rem] uppercase tracking-[0.15em] text-[#1A0B07]/60 transition-all hover:border-[#1A0B07]/45 hover:text-[#1A0B07]"
          >
            Request quote
          </Link>
        </div>
      </div>
    </div>
  )
}

export function WhatWeOfferClient({
  products,
}: {
  products: CarouselProduct[]
}) {
  const [page, setPage] = useState(0)
  const [fading, setFading] = useState(false)

  const PER_PAGE = 3
  const totalPages = Math.ceil(products.length / PER_PAGE)
  const visible = products.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  function goTo(next: number) {
    if (next === page) return
    setFading(true)
    setTimeout(() => {
      setPage(next)
      setFading(false)
    }, 180)
  }

  return (
    <div>
      {/* Cards */}
      <div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 transition-opacity duration-[180ms] ${
          fading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {visible.map((product, i) => (
          <ProductCard key={`${product.id}-${page}-${i}`} product={product} />
        ))}
      </div>

      {/* Navigation */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          {/* Prev */}
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#2E0F13]/20 text-[#1A0B07]/50 transition-all hover:border-[#2E0F13]/50 hover:bg-white hover:text-[#1A0B07] disabled:cursor-not-allowed disabled:opacity-25"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2.5">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === page
                    ? 'w-6 bg-[#1A0B07]'
                    : 'w-1.5 bg-[#1A0B07]/22 hover:bg-[#1A0B07]/45'
                }`}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages - 1}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#2E0F13]/20 text-[#1A0B07]/50 transition-all hover:border-[#2E0F13]/50 hover:bg-white hover:text-[#1A0B07] disabled:cursor-not-allowed disabled:opacity-25"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Page counter */}
      {totalPages > 1 && (
        <p className="mt-4 text-center font-mono text-[0.55rem] uppercase tracking-[0.2em] text-[#1A0B07]/30">
          {page + 1} / {totalPages}
        </p>
      )}
    </div>
  )
}
