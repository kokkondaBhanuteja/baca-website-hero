import { MessageCircle } from 'lucide-react'

export function WhatsAppFab() {
  return (
    <a
      href="https://wa.me/914841234567"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with BACA on WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-forest shadow-[0_12px_30px_-12px_rgba(20,24,26,0.5)] transition-transform hover:-translate-y-0.5"
    >
      <MessageCircle className="h-5 w-5" />
    </a>
  )
}
