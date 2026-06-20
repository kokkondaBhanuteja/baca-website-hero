'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { enquiryApi } from '@/lib/api-client/endpoints/enquiry-api'
import type { EnquiryStatusValue } from '@/lib/shared/types/enquiry-dto'
import { Dropdown } from '@/components/ui/dropdown'

const STATUSES: EnquiryStatusValue[] = ['NEW', 'READ', 'ARCHIVED']

export function EnquiryStatusControl({
  id,
  status,
}: {
  id: string
  status: EnquiryStatusValue
}) {
  const router = useRouter()
  const [value, setValue] = useState<EnquiryStatusValue>(status)
  const [busy, setBusy] = useState(false)

  async function handleChange(next: EnquiryStatusValue) {
    setBusy(true)
    setValue(next)
    try {
      await enquiryApi.updateStatus(id, next)
      router.refresh()
    } catch {
      setValue(status)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dropdown
      value={value}
      options={STATUSES.map((option) => ({ value: option, label: option }))}
      onChange={(next) => handleChange(next as EnquiryStatusValue)}
      ariaLabel="Enquiry status"
      disabled={busy}
      menuAlign="end"
      buttonClassName="min-w-[7.5rem] rounded-md border border-line bg-paper px-2 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-ink"
    />
  )
}
