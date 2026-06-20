import { SITE } from '@/constants/site'
import { WordmarkSlideshow } from '@/components/ui/wordmark-slideshow'

const FOOTER_WORDMARK_IMAGES = [
  '/images/footer/ocean-1.jpg',
  '/images/footer/ocean-2.jpg',
  '/images/footer/ocean-3.jpg',
  '/images/footer/ocean-4.jpg',
]

/**
 * Oversized ocean wordmark + tagline at the bottom of the footer. Visible
 * immediately; the cross-fading stills inside are driven by `WordmarkSlideshow`'s
 * own intersection observer + GSAP timeline.
 */
export function FooterWordmark() {
  return (
    <div className="border-t border-paper/12 pt-10">
      <WordmarkSlideshow
        text={SITE.brand}
        images={FOOTER_WORDMARK_IMAGES}
        align="left"
        className="w-full"
      />
      <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-paper/45">
        {SITE.sub} · Est. {SITE.founded}
      </p>
    </div>
  )
}
