---
kind: 'component'
name: 'Dropdown'
file: 'components/ui/dropdown/dropdown.tsx'
exports:
  - 'Dropdown'
  - 'DropdownOption'
imports_from:
  - 'lucide-react'
  - '@/lib/utils'
---

# Dropdown

Purpose:
Custom replacement for native `<select>`. Full keyboard support (Arrow/Home/End/Enter/Space/Tab), roving active-descendant pattern, outside-click/Escape close.

Used In:

- LanguageSwitcher (locale picker)
- BlogArticleForm (category select)
- ProductForm (category select)
- EnquiryStatusControl (status select)
- Admin forms (any dropdown select)

Props:

- value: string — currently selected option.value
- options: DropdownOption[] — array of {value, label}
- onChange: (value: string) => void — fires when selection changes
- placeholder?: string — shown when no value matches (default: 'Select…')
- ariaLabel?: string — aria-label for the trigger button
- disabled?: boolean — disables the trigger (default: false)
- className?: string — outer container class
- buttonClassName?: string — trigger button class
- menuAlign?: 'start' | 'end' — menu position relative to trigger (default: 'start')

Business Logic:

- isOpen state toggles on trigger click; closes on outside mousedown, Escape, Tab
- listboxId + optionId(index) generated with useId() for ARIA IDs
- activeIndex synced to selectedIndex on open; Arrow keys cycle within bounds; Home/End jump
- Enter/Space commits the activeIndex; listRef.focus() on open, scrollIntoView on activeIndex change
- SelectedIndex computed with useMemo; re-computes when options or value changes
- Menu list role='listbox' aria-activedescendant, items role='option' aria-selected
- Check icon (Lucide) shown for selected item; active item has lighter background
- ChevronDown rotates 180° when open

Dependencies:

- React hooks: useCallback, useEffect, useId, useMemo, useRef, useState
- lucide-react — Check, ChevronDown icons
- @/lib/utils — cn() for class merging

i18n:
None — all text (options labels, placeholder) passed via props

Accessibility:
Full WCAG: aria-haspopup=listbox, aria-expanded, aria-controls, aria-activedescendant, role=option aria-selected. Keyboard nav (Arrow/Home/End/Enter/Space/Escape/Tab) all wired.

Notes:
Uses CSS.escape() on ID to handle special chars. menuAlign='end' positions the menu to the right of the trigger. Outside-click listener is added only while open (useEffect dependency: [isOpen]). requestAnimationFrame used for focus return to avoid focus-before-DOM-update race.
