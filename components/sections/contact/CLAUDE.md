# components/sections/contact/

Public contact-page section group.

```
enquiry-form/           The contact-page enquiry form. Client component → POST /api/enquiry.
                        See enquiry-form/enquiry-form.claude.md for flow detail.
location-map/           Google Maps iframe embed of the SITE.address. Server component;
                        no API key required (uses the public maps.google.com embed).
contact-strip/          Pre-footer global "Get in touch" section — channels + address +
                        CTA. Rendered by SiteFooter so it ships on every public page.
                        Client component (consumer SiteFooter is already client).
```

Admin forms (product / category / blog-article / gallery) live with the admin app
under `app/(admin)/admin/components/`, not here — those are admin-only and English-only.
