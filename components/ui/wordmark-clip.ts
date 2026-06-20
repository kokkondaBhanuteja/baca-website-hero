/**
 * Shared placement helpers for the wordmark showpiece components
 * (`WordmarkMedia` video fill + `WordmarkSlideshow` image montage). Both render
 * the brand word as an SVG `<text>` clip over media; these map the `align` prop to
 * the SVG text-anchor and x position. The wordmark viewBox is 1000 units wide.
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

/** x in viewBox units; small inset so glyphs never clip the edge. */
export const WORDMARK_ALIGN_X: Record<WordmarkAlign, number> = {
  left: 8,
  center: 500,
  right: 992,
}
