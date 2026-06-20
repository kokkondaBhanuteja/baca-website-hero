'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface DropdownOption {
  value: string
  label: string
}

/**
 * Reusable custom dropdown — replaces native `<select>` everywhere. Closes on
 * outside click / Escape, keyboard-focusable, styled to match the design.
 */
export function Dropdown({
  value,
  options,
  onChange,
  placeholder = 'Select…',
  ariaLabel,
  disabled = false,
  className,
  buttonClassName,
  menuAlign = 'start',
}: {
  value: string
  options: DropdownOption[]
  onChange: (value: string) => void
  placeholder?: string
  ariaLabel?: string
  disabled?: boolean
  className?: string
  buttonClassName?: string
  menuAlign?: 'start' | 'end'
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const selected = options.find((option) => option.value === value)

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((previous) => !previous)}
        className={cn(
          'flex items-center justify-between gap-2 disabled:opacity-60',
          buttonClassName,
        )}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 opacity-60 transition-transform',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className={cn(
            'absolute top-full z-[70] mt-2 max-h-72 min-w-full overflow-auto rounded-xl border border-line bg-paper p-1 shadow-[0_18px_50px_-20px_rgba(20,24,26,0.35)]',
            menuAlign === 'end' ? 'end-0' : 'start-0',
          )}
        >
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
            >
              <button
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-start text-sm transition-colors',
                  option.value === value
                    ? 'bg-bone text-ink'
                    : 'text-ink/75 hover:bg-bone hover:text-ink',
                )}
              >
                <span className="truncate">{option.label}</span>
                {option.value === value && (
                  <Check
                    className="h-3.5 w-3.5 shrink-0 text-saffron"
                    aria-hidden
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
