import Image from 'next/image'

const PRINCIPLES = [
  {
    number: '01',
    title: 'The Farmer First.',
    body: 'We pay above-market rates and open global doors for the families who grow our produce. Their stability is the foundation of our consistency.',
  },
  {
    number: '02',
    title: 'No Shortcuts, Ever.',
    body: 'Every batch is tested, documented, and verified at the farm, at processing, and before dispatch. If it does not meet our standard, it does not leave.',
  },
  {
    number: '03',
    title: 'Built for the Long Run.',
    body: 'We build partnerships, not transactions — with farmers behind us and buyers who trust us. Your trust is something we earn every shipment, not just the first.',
  },
]

export function BacaPrinciples() {
  return (
    <section className="bg-white py-14 sm:py-20">
      <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
        {/* Eyebrow */}
        <p className="mb-10 font-mono text-[0.75rem] uppercase tracking-[0.35em] text-[#2E0F13]/75">
          Our Principles
        </p>

        {/* Two-column: principles left, sticky image right */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-14 xl:grid-cols-[1fr_460px]">
          {/* Left — principles */}
          <div className="divide-y divide-[#2E0F13]/12 border-t border-[#2E0F13]/12">
            {PRINCIPLES.map((item) => (
              <div
                key={item.number}
                className="group grid grid-cols-[4rem_1fr] gap-6 py-10 sm:gap-10"
              >
                {/* Number — large, decorative */}
                <div className="pt-1">
                  <span className="font-heading block text-[3.5rem] font-light leading-none text-[#2E0F13]/18 sm:text-[4rem]">
                    {item.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4">
                  <h3 className="font-heading text-[2rem] font-light leading-[1.1] text-[#2E0F13] sm:text-[2.4rem]">
                    {item.title}
                  </h3>
                  <div className="h-px w-8 bg-[#2E0F13]/30" />
                  <p className="text-[1rem] leading-[1.85] text-[#2E0F13]/85 sm:text-[1.05rem]">
                    {item.body}
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
                    alt="BACA — farmers and fields"
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1280px) 400px, 460px"
                  />
                  {/* Gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2E0F13]/50 via-transparent to-transparent" />
                  {/* Caption */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-white/70">
                      Direct from India&apos;s heartland
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
