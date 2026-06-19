import { listEnquiries } from '@/lib/server/services/enquiry-service'
import { EnquiryStatusControl } from '../../components/enquiry-status-control'

export const dynamic = 'force-dynamic'

export default async function EnquiriesPage() {
  const enquiries = await listEnquiries()

  return (
    <div>
      <h1 className="mb-8 font-heading text-3xl font-light text-ink">Enquiries</h1>

      {enquiries.length === 0 ? (
        <p className="text-sm text-ink-60">No enquiries yet.</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line bg-paper">
          <table className="w-full text-sm">
            <thead className="border-b border-line text-left font-mono text-[0.6rem] uppercase tracking-wider text-ink-60">
              <tr>
                <th className="px-5 py-3">From</th>
                <th className="px-5 py-3">Message</th>
                <th className="px-5 py-3">Locale</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="border-b border-line align-top last:border-0">
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink">{enquiry.name}</p>
                    <a
                      href={`mailto:${enquiry.email}`}
                      className="text-xs text-ink-60 hover:text-clay"
                    >
                      {enquiry.email}
                    </a>
                    {enquiry.company && (
                      <p className="text-xs text-ink-60">{enquiry.company}</p>
                    )}
                    {enquiry.phone && (
                      <p className="text-xs text-ink-60">{enquiry.phone}</p>
                    )}
                  </td>
                  <td className="max-w-md px-5 py-4 text-ink/80">{enquiry.message}</td>
                  <td className="px-5 py-4 font-mono text-xs uppercase text-ink-60">
                    {enquiry.localeSent}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-ink-60">
                    {enquiry.createdAt.slice(0, 10)}
                  </td>
                  <td className="px-5 py-4">
                    <EnquiryStatusControl id={enquiry.id} status={enquiry.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
