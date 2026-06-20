'use client'

import { useId, useState, forwardRef, type InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'className'
> & {
  /** Applied to the outer wrapper — use for layout (e.g. `mb-6`). */
  className?: string
  /** Applied to the inner input — use only if you need to override input chrome. */
  inputClassName?: string
  showLabel?: string
  hideLabel?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      className,
      inputClassName,
      showLabel = 'Show password',
      hideLabel = 'Hide password',
      id,
      ...inputProps
    },
    ref,
  ) {
    const [isVisible, setIsVisible] = useState(false)
    const fallbackId = useId()
    const inputId = id ?? fallbackId

    const ToggleIcon = isVisible ? EyeOff : Eye
    const toggleLabel = isVisible ? hideLabel : showLabel

    return (
      <div className={cn('relative', className)}>
        <input
          {...inputProps}
          id={inputId}
          ref={ref}
          type={isVisible ? 'text' : 'password'}
          className={cn(
            'block w-full rounded-lg border border-line bg-bone px-3 py-2 pe-10 text-sm text-ink outline-none focus:border-ink',
            inputClassName,
          )}
        />
        <button
          type="button"
          onClick={() => setIsVisible((current) => !current)}
          aria-label={toggleLabel}
          aria-pressed={isVisible}
          aria-controls={inputId}
          tabIndex={-1}
          className="absolute end-2 inset-y-0 my-auto inline-flex h-7 w-7 items-center justify-center rounded text-ink-60 transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
        >
          <ToggleIcon className="h-4 w-4" aria-hidden />
        </button>
      </div>
    )
  },
)
