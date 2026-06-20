'use client'

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { Check, ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface DropdownOption {
  value: string
  label: string
}

/**
 * Reusable custom dropdown — replaces native `<select>` everywhere. Closes on
 * outside click / Escape. Full keyboard support (Arrow/Home/End/Enter/Space/Tab)
 * with roving active-descendant pattern for screen readers.
 */
export function Dropdown({
  value,
  options,
  onChange,
  placeholder = 'Select…',
  ariaLabel,
  ariaLabelledBy,
  id,
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
  ariaLabelledBy?: string
  /** Optional id on the trigger button so a sibling `<label htmlFor>` can target it. */
  id?: string
  disabled?: boolean
  className?: string
  buttonClassName?: string
  menuAlign?: 'start' | 'end'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const reactId = useId()
  const listboxId = `${reactId}-listbox`
  const optionId = useCallback(
    (index: number) => `${reactId}-option-${index}`,
    [reactId],
  )

  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === value),
    [options, value],
  )
  const [activeIndex, setActiveIndex] = useState(
    selectedIndex >= 0 ? selectedIndex : 0,
  )

  const openMenu = useCallback(
    (startIndex?: number) => {
      setIsOpen(true)
      setActiveIndex(startIndex ?? (selectedIndex >= 0 ? selectedIndex : 0))
    },
    [selectedIndex],
  )

  useEffect(() => {
    if (!isOpen) return
    const onPointer = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !listRef.current) return
    listRef.current.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !listRef.current) return
    const active = listRef.current.querySelector<HTMLElement>(
      `#${CSS.escape(optionId(activeIndex))}`,
    )
    active?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, isOpen, optionId])

  const selected = options[selectedIndex >= 0 ? selectedIndex : -1]

  const commit = useCallback(
    (index: number) => {
      const option = options[index]
      if (!option) return
      onChange(option.value)
      setIsOpen(false)
      requestAnimationFrame(() => triggerRef.current?.focus())
    },
    [onChange, options],
  )

  const closeAndReturnFocus = useCallback(() => {
    setIsOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'Enter':
      case ' ':
        event.preventDefault()
        openMenu()
        break
      case 'ArrowUp':
        event.preventDefault()
        openMenu(options.length - 1)
        break
      case 'Home':
        event.preventDefault()
        openMenu(0)
        break
      case 'End':
        event.preventDefault()
        openMenu(options.length - 1)
        break
    }
  }

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((previous) => (previous + 1) % options.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex(
          (previous) => (previous - 1 + options.length) % options.length,
        )
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(options.length - 1)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        commit(activeIndex)
        break
      case 'Escape':
        event.preventDefault()
        closeAndReturnFocus()
        break
      case 'Tab':
        setIsOpen(false)
        break
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
        onKeyDown={onTriggerKeyDown}
        className={cn(
          'flex items-center justify-between gap-2 disabled:opacity-60',
          buttonClassName,
        )}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 opacity-60 transition-transform',
            isOpen && 'rotate-180',
          )}
          aria-hidden
        />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={optionId(activeIndex)}
          onKeyDown={onListKeyDown}
          className={cn(
            'absolute top-full z-[70] mt-2 max-h-72 min-w-full overflow-auto rounded-xl border border-line bg-paper p-1 shadow-[0_18px_50px_-20px_rgba(20,24,26,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40',
            menuAlign === 'end' ? 'end-0' : 'start-0',
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value
            const isActive = index === activeIndex
            return (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={isSelected}
              >
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => commit(index)}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-start text-sm transition-colors',
                    isSelected
                      ? 'bg-bone text-ink'
                      : isActive
                        ? 'bg-bone/60 text-ink'
                        : 'text-ink/75 hover:bg-bone hover:text-ink',
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <Check
                      className="h-3.5 w-3.5 shrink-0 text-saffron"
                      aria-hidden
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
