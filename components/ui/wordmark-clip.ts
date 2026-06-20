/**
 * Shared placement helpers for the wordmark family (WordmarkMedia,
 * WordmarkSlideshow). Maps the `align` prop to SVG text-anchor and x-position
 * within the 1000-unit viewBox the wordmark SVGs share.
 *
 * The 8 / 992 insets (instead of 0 / 1000) prevent the leftmost / rightmost letter
 * stroke from being clipped at the viewBox edge.
 */

export type WordmarkAlign = 'left' | 'center' | 'right'

export const WORDMARK_ALIGN_ANCHOR: Record<
  WordmarkAlign,
  'start' | 'middle' | 'end'
> = {
  left: 'start',
  center: 'middle',
  right: 'end',
}

export const WORDMARK_ALIGN_X: Record<WordmarkAlign, number> = {
  left: 8,
  center: 500,
  right: 992,
}
