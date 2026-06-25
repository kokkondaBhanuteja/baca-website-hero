import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

const PRINCIPLE_KEYS = ['farmer', 'quality', 'partnership'] as const

export async function BacaPrinciples() {
  const t = await getTranslations('bacaPrinciples')

  return (
    <section className="bg-[#d9d9d8] py-14 sm:py-20">
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
        {/* Eyebrow */}
        <p className="mb-10 font-mono text-[0.75rem] uppercase tracking-[0.35em] text-ink/75">
          {t('eyebrow')}
        </p>

        {/* Two-column: principles left, sticky image right */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-14 xl:grid-cols-[1fr_460px]">
          {/* Left — principles */}
          <div className="divide-y divide-ink/12 border-t border-ink/12">
            {PRINCIPLE_KEYS.map((principleKey, index) => (
              <div
                key={principleKey}
                className="group grid grid-cols-[4rem_1fr] gap-6 py-10 sm:gap-10"
              >
                {/* Number — large, decorative */}
                <div className="pt-1">
                  <span className="font-heading block text-[3.5rem] font-light leading-none text-ink/20 sm:text-[4rem]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-heading text-[2rem] font-light leading-[1.1] text-ink sm:text-[2.4rem]">
                    {t(
                      `items.${principleKey}.title` as Parameters<typeof t>[0],
                    )}
                  </h3>
                  <div className="h-px w-8 bg-ink/30" />
                  <p className="text-[1rem] leading-[1.85] text-ink/85 sm:text-[1.05rem]">
                    {t(`items.${principleKey}.body` as Parameters<typeof t>[0])}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — sticky image */}
          <div className="hidden lg:block">
            <div className="sticky top-[calc(var(--spacing-header-base)+2rem)]">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="relative h-[520px] w-full xl:h-[580px]">
                  <Image
                    src="/images/who-we-are.jpg"
                    alt={t('imageAlt')}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1280px) 400px, 460px"
                  />
                  {/* Gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
                  {/* Caption */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-white/70">
                      {t('imageCaption')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
