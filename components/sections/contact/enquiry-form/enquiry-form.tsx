'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Check } from 'lucide-react'

import type { NormalizedApiError } from '@/lib/api-client/axios-instance'
import { enquiryApi } from '@/lib/api-client/endpoints/enquiry-api'

export function EnquiryForm() {
  const t = useTranslations('contactPage.form')
  const locale = useLocale()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState('')
  const [message, setMessage] = useState('')

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  // Guard against setState after unmount when the network call resolves late.
  const isMountedRef = useRef(true)
  useEffect(
    () => () => {
      isMountedRef.current = false
    },
    [],
  )

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setStatus('sending')
    setError(null)
    setFieldErrors({})
    try {
      await enquiryApi.submit({
        name,
        email,
        company: company || null,
        phone: phone || null,
        country,
        message,
        localeSent: locale,
      })
      if (!isMountedRef.current) return
      setStatus('sent')
    } catch (caught) {
      if (!isMountedRef.current) return
      const apiError = caught as NormalizedApiError
      setStatus('error')
      setError(apiError.message ?? t('error'))
      setFieldErrors(apiError.fieldErrors ?? {})
    }
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-start gap-4 rounded-xl border border-forest/30 bg-paper p-6"
      >
        <span
          aria-hidden
          className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest text-paper"
        >
          <Check className="h-4 w-4" />
        </span>
        <p className="text-sm leading-relaxed text-ink">{t('success')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full w-full flex-col">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 className="font-heading text-xl font-light tracking-[-0.01em] text-ink sm:text-[1.375rem]">
          {t('title')}
        </h2>
      </div>

      {status === 'error' && error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-clay/30 bg-clay/5 px-3 py-2 text-sm text-clay"
        >
          {error}
        </p>
      )}

      <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
        <Field
          label={t('name')}
          value={name}
          onChange={setName}
          required
          maxLength={120}
          autoComplete="name"
          errors={fieldErrors.name}
        />
        <Field
          label={t('email')}
          type="email"
          value={email}
          onChange={setEmail}
          required
          maxLength={200}
          autoComplete="email"
          errors={fieldErrors.email}
        />
        <Field
          label={t('country')}
          value={country}
          onChange={setCountry}
          required
          maxLength={80}
          autoComplete="country-name"
          errors={fieldErrors.country}
        />
        <Field
          label={t('company')}
          value={company}
          onChange={setCompany}
          maxLength={160}
          autoComplete="organization"
        />
        <Field
          label={t('phone')}
          type="tel"
          value={phone}
          onChange={setPhone}
          maxLength={40}
          autoComplete="tel"
          className="sm:col-span-2"
        />
      </div>

      <MessageField
        label={t('message')}
        value={message}
        onChange={setMessage}
        placeholder={t('messagePlaceholder')}
        errors={fieldErrors.message}
      />

      <div className="mt-auto flex justify-end pt-6">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest disabled:opacity-60"
        >
          {status === 'sending' ? t('submitting') : t('submit')}
          {status !== 'sending' && (
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          )}
        </button>
      </div>
    </form>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  maxLength,
  autoComplete,
  errors,
  className,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
  maxLength?: number
  autoComplete?: string
  errors?: string[]
  className?: string
}) {
  const reactId = useId()
  const inputId = `${reactId}-input`
  const errorId = `${reactId}-error`
  const hasErrors = Boolean(errors?.length)

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-ink/80"
      >
        {label}
        {required && <span className="text-clay"> *</span>}
      </label>
      <input
        id={inputId}
        type={type}
        required={required}
        maxLength={maxLength}
        autoComplete={autoComplete}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={hasErrors || undefined}
        aria-describedby={hasErrors ? errorId : undefined}
        className="w-full rounded-lg border border-line/80 bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink focus-visible:ring-2 focus-visible:ring-ink/20"
      />
      {hasErrors && (
        <p id={errorId} className="mt-1 text-xs text-clay">
          {errors!.join(', ')}
        </p>
      )}
    </div>
  )
}

const MESSAGE_MAX_LENGTH = 200

function MessageField({
  label,
  value,
  onChange,
  placeholder,
  errors,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  errors?: string[]
}) {
  const reactId = useId()
  const inputId = `${reactId}-message`
  const errorId = `${reactId}-message-error`
  const hasErrors = Boolean(errors?.length)
  const remaining = MESSAGE_MAX_LENGTH - value.length
  const isNearLimit = remaining <= 20

  return (
    <div className="mt-4 flex flex-1 flex-col">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-ink/80"
        >
          {label} <span className="text-clay">*</span>
        </label>
        <span
          aria-live="polite"
          className={`font-mono text-[0.65rem] tabular-nums ${isNearLimit ? 'text-clay' : 'text-ink-60'}`}
        >
          {value.length} / {MESSAGE_MAX_LENGTH}
        </span>
      </div>
      <textarea
        id={inputId}
        required
        rows={3}
        maxLength={MESSAGE_MAX_LENGTH}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={hasErrors || undefined}
        aria-describedby={hasErrors ? errorId : undefined}
        className="h-full min-h-32 w-full flex-1 resize-none rounded-lg border border-line/80 bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink focus-visible:ring-2 focus-visible:ring-ink/20"
      />
      {hasErrors && (
        <p id={errorId} className="mt-1 text-xs text-clay">
          {errors!.join(', ')}
        </p>
      )}
    </div>
  )
}
