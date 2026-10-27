# aureliomilan.com

Portfolio site for Aurelio Milan. Next.js (App Router), GSAP, Lenis and three.js.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

Node 20.9 or newer.

## Deploy (Vercel)

1. Push the repo to GitHub.
2. In Vercel: **Add New → Project**, import the repo. No settings to change; the framework is detected.
3. Add the domain `aureliomilan.com` under **Settings → Domains** (and `www`, redirecting to the apex).

`originals` is excluded from deploys (`.vercelignore`); only the optimised photos in `public/photos` are served.

## Editing content

All text and photo choices are in `lib/content.js`:

- `site` — name, domain, booking email, Instagram, default SEO title/description
- `seo` — title and description for each page
- `home`, `about`, `fashion`, `press`, `blog`, `gallery` — page content
- `map.places` — pins on the map (Home and Gallery)
- `person` — details used in the search-engine profile (schema.org)

Press articles go in `press.items` as `{ publication, title, date, url }`. While the list is empty the page shows a press-kit note instead.

The booking form opens the visitor's mail app with the enquiry filled in. To receive submissions through a form service instead (Formspree, Basin …), set `site.formEndpoint`.

## Photos

Originals live in `originals/<folder>/`. After adding or replacing one:

```bash
npm run images
```

This writes 800 px and 1600 px WebP versions to `public/photos` and updates `lib/photos.js`. Refer to a photo in `content.js` by its file name without extension, e.g. `'general-37'`.

## Map

`lib/map-data.js` is generated from Natural Earth data. To change the visible area, edit `BBOX` in `scripts/build-map.mjs` and run `npm run map`.

## SEO

- Per-page titles, descriptions, canonical URLs, Open Graph and Twitter cards (`lib/seo.js`)
- Structured data: Person, WebSite, ProfilePage (About), ImageGallery (Gallery), ContactPage, breadcrumbs
- `/sitemap.xml` with image entries, `/robots.txt`, web manifest, icons, share image (`public/og.jpg`)

After launch: add the site to Google Search Console and Bing Webmaster Tools, submit `https://aureliomilan.com/sitemap.xml`, and link the site from the Instagram bio.

## Structure

```
app/              routes, layout, metadata, sitemap, robots
components/       server-rendered markup (Media, MapSection, JsonLd …)
lib/content.js    site content
lib/seo.js        metadata and structured data helpers
lib/motion/       client-side motion: smooth scroll, WebGL layer, transitions, lightbox
scripts/          image and map generators
```
