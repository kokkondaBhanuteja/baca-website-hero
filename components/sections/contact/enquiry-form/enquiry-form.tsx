'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Check } from 'lucide-react'

import type { NormalizedApiError } from '@/lib/api-client/axios-instance'
import { enquiryApi } from '@/lib/api-client/endpoints/enquiry-api'

export function EnquiryForm() {
  const t = useTranslations('contactPage.form')
  const locale = useLocale()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
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
        className="flex items-start gap-4 rounded-2xl border border-forest/30 bg-forest/5 p-8"
      >
        <span
          aria-hidden
          className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest text-paper"
        >
          <Check className="h-4 w-4" />
        </span>
        <p className="text-[15px] leading-relaxed text-ink">{t('success')}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-line bg-paper p-6 sm:p-8"
    >
      {status === 'error' && error && (
        <p
          role="alert"
          className="mb-5 rounded-lg border border-clay/30 bg-clay/5 px-3 py-2 text-sm text-clay"
        >
          {error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
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
          label={`${t('company')} (${t('optional')})`}
          value={company}
          onChange={setCompany}
          maxLength={160}
          autoComplete="organization"
        />
        <Field
          label={`${t('phone')} (${t('optional')})`}
          type="tel"
          value={phone}
          onChange={setPhone}
          maxLength={40}
          autoComplete="tel"
        />
      </div>

      <MessageField
        label={t('message')}
        value={message}
        onChange={setMessage}
        placeholder={t('messagePlaceholder')}
        errors={fieldErrors.message}
      />

      <button
        type="submit"
        disabled={status === 'sending'}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-forest disabled:opacity-60"
      >
        {status === 'sending' ? t('submitting') : t('submit')}
      </button>
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
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
  maxLength?: number
  autoComplete?: string
  errors?: string[]
}) {
  const reactId = useId()
  const inputId = `${reactId}-input`
  const errorId = `${reactId}-error`
  const hasErrors = Boolean(errors?.length)

  return (
    <div>
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
        className="w-full rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink outline-none focus:border-ink focus-visible:ring-2 focus-visible:ring-ink/30"
      />
      {hasErrors && (
        <p id={errorId} className="mt-1 text-xs text-clay">
          {errors!.join(', ')}
        </p>
      )}
    </div>
  )
}

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

  return (
    <div className="mt-5">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-ink/80"
      >
        {label} <span className="text-clay">*</span>
      </label>
      <textarea
        id={inputId}
        required
        rows={5}
        maxLength={4000}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-invalid={hasErrors || undefined}
        aria-describedby={hasErrors ? errorId : undefined}
        className="w-full rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink outline-none focus:border-ink focus-visible:ring-2 focus-visible:ring-ink/30"
      />
      {hasErrors && (
        <p id={errorId} className="mt-1 text-xs text-clay">
          {errors!.join(', ')}
        </p>
      )}
    </div>
  )
}
