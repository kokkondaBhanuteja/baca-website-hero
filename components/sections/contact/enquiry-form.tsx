'use client'

import { useState, type FormEvent } from 'react'
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

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

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
      setStatus('sent')
    } catch (caught) {
      const apiError = caught as NormalizedApiError
      setStatus('error')
      setError(apiError.message ?? t('error'))
      setFieldErrors(apiError.fieldErrors ?? {})
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex items-start gap-4 rounded-2xl border border-forest/30 bg-forest/5 p-8">
        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest text-paper">
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
        <p className="mb-5 rounded-lg border border-clay/30 bg-clay/5 px-3 py-2 text-sm text-clay">
          {error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t('name')}
          value={name}
          onChange={setName}
          required
          errors={fieldErrors.name}
        />
        <Field
          label={t('email')}
          type="email"
          value={email}
          onChange={setEmail}
          required
          errors={fieldErrors.email}
        />
        <Field
          label={`${t('company')} (${t('optional')})`}
          value={company}
          onChange={setCompany}
        />
        <Field
          label={`${t('phone')} (${t('optional')})`}
          type="tel"
          value={phone}
          onChange={setPhone}
        />
      </div>

      <div className="mt-5">
        <label className="mb-1.5 block text-sm font-medium text-ink/80" htmlFor="message">
          {t('message')} <span className="text-clay">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={t('messagePlaceholder')}
          className="w-full rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        />
        {fieldErrors.message && (
          <p className="mt-1 text-xs text-clay">{fieldErrors.message.join(', ')}</p>
        )}
      </div>

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
  errors,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
  errors?: string[]
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink/80">
        {label}
        {required && <span className="text-clay"> *</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink outline-none focus:border-ink"
      />
      {errors && <p className="mt-1 text-xs text-clay">{errors.join(', ')}</p>}
    </div>
  )
}
