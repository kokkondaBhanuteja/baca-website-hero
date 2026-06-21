import { getTranslations } from 'next-intl/server'

import { CONTACT } from '@/constants/contact'
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon'

export async function WhatsAppFab() {
  const t = await getTranslations('whatsapp')

  return (
    <a
      href={CONTACT.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('ariaLabel')}
      data-cursor="fill"
      className="fixed bottom-5 end-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-line bg-paper text-forest shadow-[0_12px_30px_-12px_rgba(20,24,26,0.5)] transition-transform hover:-translate-y-0.5 hover:text-saffron focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-saffron"
    >
      <WhatsAppIcon className="h-5 w-5" aria-hidden />
    </a>
  )
}
