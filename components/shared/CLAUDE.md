# components/shared/

Cross-page reusables that don't fit `ui/` (pure primitives, no page copy) or
`sections/` (page-specific slabs).

```
page-intro/             Inner-page header — Eyebrow + oversized H1 + optional intro.
                        Used by every non-home page.
```

Add new shared primitives here only when they're used by 2+ pages AND don't fit
elsewhere. Single-page primitives belong under that page's section folder.
