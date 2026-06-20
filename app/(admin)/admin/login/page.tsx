'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import type { NormalizedApiError } from '@/lib/api-client/axios-instance'
import { authApi } from '@/lib/api-client/endpoints/auth-api'
import { PasswordInput } from '@/components/ui/password-input'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await authApi.login({ email, password })
      router.replace('/admin/categories')
      router.refresh()
    } catch (caught) {
      setError((caught as NormalizedApiError).message ?? 'Login failed')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-bone px-4 py-10 sm:px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-line bg-paper p-6 shadow-[0_18px_50px_-24px_rgba(20,24,26,0.3)] sm:p-8"
      >
        <div className="mb-6">
          <span className="font-heading text-2xl font-medium text-ink">
            BACA
          </span>
          <span className="ms-2 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-ink-60">
            Admin
          </span>
        </div>
        <h1 className="mb-6 font-heading text-xl font-light text-ink">
          Sign in
        </h1>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg border border-clay/30 bg-clay/5 px-3 py-2 text-sm text-clay"
          >
            {error}
          </p>
        )}

        <label className="mb-1 block text-sm text-ink/80" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mb-4 w-full rounded-lg border border-line bg-bone px-3 py-2 text-sm text-ink outline-none focus:border-ink"
        />

        <label className="mb-1 block text-sm text-ink/80" htmlFor="password">
          Password
        </label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-6"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-forest disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
