# Sonu Sharma — Portfolio

A single-page, responsive portfolio built from Sonu's résumé.

## View locally

Just open `index.html` in a browser. No build step, no dependencies.

Or serve it locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Files

| File | Purpose |
| --- | --- |
| `index.html` | All page content and structure |
| `styles.css` | Theme, layout, responsive rules |
| `script.js` | Nav, scroll reveals, counters, copy-email |
| `assets/sonu-sharma.jpg` | Hero portrait — cropped to 4:5, watermark removed, colour graded |
| Résumé | Hosted on Google Drive (linked from the nav + contact) — https://drive.google.com/file/d/17pmXRP5spcm43bnVnKOOTLDPsQDLHftF/view |
| `assets/favicon.svg` | Favicon |

## Dark & light mode

- A sun/moon toggle sits in the nav (and in the mobile menu).
- The choice is saved in `localStorage`; on a first visit the site follows the OS setting.
- Every colour is a token in `:root`, with the light palette under `[data-theme="light"]`.
  Change those two blocks to re-skin the whole site.
- An inline script sets the theme before first paint, so there's no flash.

## Sections

Hero → About → Experience → Skills & competitive programming → Awards & education → Contact

## Editing notes

- **Colors, fonts, spacing** live in the `:root` block at the top of `styles.css`.
- **Contact details** are in the contact section of `index.html` (email appears twice:
  the `mailto:` link and the `data-email` attribute on the copy button).
- **Résumé**: hosted on Google Drive — update the three links in `index.html`
  (nav, header button, contact list) if you replace the file.

## Deploying

It's fully static, so any host works. A few easy options:

- **GitHub Pages** — push the folder to a repo, then Settings → Pages → deploy from branch.
- **Netlify / Vercel** — drag the folder in, or connect the repo (no build command, publish directory `/`).
- **Cloudflare Pages** — same: no build step.

## Accessibility

- Lighthouse: Accessibility 100, Best Practices 100.
- Works without JavaScript (content stays visible).
- Respects `prefers-reduced-motion`, keyboard focus styles, and semantic landmarks.
