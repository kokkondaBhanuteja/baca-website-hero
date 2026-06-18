"use client"

import { useEffect, useState } from "react"

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Blogs", href: "#blogs" },
  { label: "Gallery", href: "#gallery" },
  { label: "contact us", href: "#contact" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-ivory/10 bg-espresso/90 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      {/* Top utility line */}
      <div className="hidden border-b border-ivory/10 sm:block">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-1.5 sm:px-10">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-ivory/55">
            India &rarr; 23 countries
          </span>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.25em] text-ivory/55">
            EN · ₹/$
          </span>
        </div>
      </div>

      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 sm:px-10">
        <a
          href="#"
          className="font-display text-2xl font-semibold tracking-tight text-ivory"
          style={{ textShadow: "0 1px 12px rgba(36,23,18,0.5)" }}
          aria-label="BACA home"
        >
          BACA
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm text-ivory/85 transition-colors hover:text-ivory"
                style={{ textShadow: "0 1px 10px rgba(36,23,18,0.55)" }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="text-sm font-medium text-ivory md:hidden"
          style={{ textShadow: "0 1px 10px rgba(36,23,18,0.55)" }}
        >
          Menu
        </a>
      </nav>
    </header>
  )
}
