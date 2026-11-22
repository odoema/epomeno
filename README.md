# Epomeno Investment Ltd: website

A static website with five pages (Home, About, Services, Projects, Contact, plus a 404 page). It has no build step or dependencies and is ready for GitHub Pages.

## Publish on GitHub Pages

1. Create a new public repository on GitHub, named `epomeno` (the site address is already set to https://odoema.github.io/epomeno).
2. Upload **everything inside this folder** to the root of the repository, including the hidden `.nojekyll` file. You can drag and drop on GitHub's "Add file → Upload files" page.
3. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then click **Save**.
4. After a minute or two the site is live at `https://odoema.github.io/epomeno/`.

All links are relative, so the site works from a repository sub-path and from a custom domain.

### Custom domain (optional, e.g. `www.epomenoinvestment.co.ug`)
1. In **Settings → Pages → Custom domain**, enter the domain and save. GitHub creates a `CNAME` file for you.
2. With your domain registrar, add a `CNAME` record pointing `www` to `<your-username>.github.io`.
3. Tick **Enforce HTTPS** once it becomes available.
4. Replace `https://odoema.github.io/epomeno` with the final address in every `.html` file, in `sitemap.xml` and in `robots.txt` (use find-and-replace). This keeps search-engine and social-share links correct.

## What's inside

```
index.html        Home: hero slider, divisions, process, featured work, clients
about.html        Story, mission and vision, values, team, credentials
services.html     Civil works, current gutter contract, supplies, terms
projects.html     Track record table, filterable photo gallery with lightbox
contact.html      Contact details, quote form (email or WhatsApp), map
404.html          Not-found page
assets/css/styles.css
assets/js/main.js
assets/img/       Site photos (optimised) and icons
brand/            Logo files and brand colour swatch
```

## Brand

| Name   | Hex       | Use                                   |
|--------|-----------|---------------------------------------|
| Navy   | `#01307E` | Backgrounds, headings (from flyer)    |
| Royal  | `#0047AF` | Logo blue, links, accents             |
| Orange | `#F28A1E` | Logo arrow, buttons, highlights       |
| Gold   | `#FBB505` | Secondary highlight (flyer panel)     |
| Paper  | `#F4F7FC` | Page background                       |

Typeface: **Archivo** (Google Fonts), all text. Headlines use its wide width; small labels use its narrow width.

`brand/logo-mark.svg` and `brand/logo-full.svg` are vector redraws of the logo, made so it stays sharp on high-resolution screens. `brand/logo-extracted.png` is the logo cut directly from the company flyer. If the designer's original vector logo (AI, EPS, PDF or SVG) is available, replace `assets/img/logo-mark.svg` with it.

## Editing content

- **Text:** open the `.html` file in any editor and change the words.
- **Photos:** put new JPGs in `assets/img/` (keep them under about 1600 px wide and 250 KB) and update the `src` and `alt` attributes.
- **Hero slides:** in `index.html`, each `<article class="slide">` is one slide. The chainage labels (CH 0+000 …) and locations are in the `<ol class="ruler">` below the slides. Keep the number of slides and ruler items the same.
- **Phone numbers and email:** use find-and-replace across all files.

## Contact form

GitHub Pages can't run server code, so the form opens the visitor's email app or WhatsApp with the message already filled in. To receive submissions directly in an inbox instead, connect a form service such as Formspree or Web3Forms: set the form's `action` to their endpoint and remove the `submit` handler in `assets/js/main.js`.

## Features

- Hero slider with a diagonal wipe that follows the logo's arrow, slow image zoom and staggered headline text. Its progress ruler uses road chainage marks. It autoplays, pauses on hover or focus, and supports arrow keys, swipe and clickable markers.
- Header that becomes solid when you scroll, a reading-progress bar, and a full-screen mobile menu.
- Number counters, scroll reveals and a client marquee.
- Filterable masonry photo gallery with a keyboard-accessible lightbox.
- Smooth page-to-page transitions in supporting browsers (View Transitions API).
- Respects reduced-motion settings, keyboard focus styles, skip link and descriptive alt text.
- SEO: page titles and descriptions, Open Graph tags, schema.org `GeneralContractor` data, sitemap and robots file.
