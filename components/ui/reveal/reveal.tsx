'use client'

/* eslint-disable react-hooks/refs -- the polymorphic createElement forwards the ref; it is not read during render */
import {
  createElement,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  /** delay in ms before the reveal animation starts */
  delay?: number
  as?: 'div' | 'section' | 'li' | 'span' | 'figure'
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  as = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return createElement(
    as,
    {
      ref,
      className: `baca-reveal ${visible ? 'is-visible' : ''} ${className}`,
      style: { animationDelay: `${delay}ms` },
    },
    children,
  )
}
