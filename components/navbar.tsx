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
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line transition-colors duration-300 ${
        scrolled ? "bg-bg-base/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-6 py-4 sm:px-8">
        <a
          href="#"
          className="font-display text-2xl font-semibold tracking-tight text-ink"
          aria-label="BACA home"
        >
          BACA
        </a>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="text-sm text-ink-soft transition-colors hover:text-ink md:hidden"
        >
          Menu
        </a>
      </nav>
    </header>
  )
}
