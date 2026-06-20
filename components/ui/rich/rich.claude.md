---
kind: 'component'
name: 'richTags'
file: 'components/ui/rich/rich.tsx'
exports:
  - 'richTags'
imports_from: []
---

# richTags

Purpose:
Exported object of React components for next-intl t.rich() tag rendering. Allows translators to move styled spans (e.g., <em>…</em>) within sentences without breaking formatting.

Used In:

- CtaBand (t.rich('heading', richTags))
- GlobalPresence (t.rich('heading', richTags))
- Manifesto (t.rich('headline', richTags))

Props:

- Not a component — an object export of tag renderers: {em: (chunks) => <span>…</span>}

Business Logic:

- em tag: renders chunks inside <span className='italic text-saffron'>

Dependencies:

- React — for ReactNode type and JSX

i18n:
Enables next-intl rich-text mode: t.rich('key', richTags) replaces <em>…</em> with the renderer function.

Accessibility:
No a11y — semantic text is preserved; styling is added via classNames.

Notes:
This is a minimal shared constants file, not a component. Expand richTags here if other styled spans (bold, strong, etc.) are needed in translations. The em renderer always outputs saffron italic text.
