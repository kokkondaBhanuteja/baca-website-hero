import { redirect } from 'next/navigation'

import { getCurrentAdmin } from '@/lib/server/auth/session'
import { AdminShell } from '../components/admin-shell'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getCurrentAdmin()
  if (!admin) redirect('/admin/login')

  return <AdminShell admin={admin}>{children}</AdminShell>
}
