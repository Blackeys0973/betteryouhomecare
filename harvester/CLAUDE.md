# Harvester by Arkkhe — Site Rebuild Workflow

Instructions for the coding agent operating this project. Read before acting.

This project contains an agent (`harvest.py`) that prepares outdated websites for a
rebuild: it scores whether the site is worth the effort, downloads every asset, and
extracts the business data.

---

## When the user says "rebuild <URL>", "redo <URL>" or similar:

Run this flow start to finish, without stopping to ask — except at step 4.

### 1. Prepare (run the tool)

```bash
python harvest.py <URL> --crawl
```

If you get a module-not-found error, run this first:

```bash
pip install -r requirements.txt
```

### 2. Read what was generated

The command creates `output/<domain>/`. Read this file:

```
output/<domain>/REBUILD_BRIEF.md
```

It contains: business name, phones, emails, address, opening hours, social links,
colour palette, fonts, the original copy, and an inventory of the downloaded assets.

#### If the brief comes back empty (site behind a JS challenge — Sucuri / Cloudflare)

If `harvest.py` returns an empty brief, or one containing "You are being
redirected..." (plain `requests` cannot pass a JavaScript challenge), **do not give
up**:

- Use a browser-rendering scraper (Firecrawl with stealth proxy and a `waitFor`, or
  equivalent) to render the JS and get the real content: name, phones, address,
  hours, copy, asset URLs.
- Download the **assets directly from the server** — images and PDFs are usually
  **not** protected by the challenge, only the HTML is. Save them into
  `output/<domain>/assets/`.
- Update `REBUILD_BRIEF.md` with what you recovered.
- Only then continue to step 3.

### 3. Check eligibility

Open `output/<domain>/report.json`. If the verdict is **"SKIP"**, the site is already
modern and responsive — tell the user and ask whether to continue anyway. If it is
"GOOD TARGET" or "MAYBE", proceed.

### 4. Confirm the essentials (the only pause)

Confirm with the user, in one line: the business name and the main phone number you
extracted, so you know they are right. Then build.

### 5. Build the new site

Create it in `new-sites/<domain>/` using the standard stack (below).

Rules:

- Use **only** the real data from the brief — name, phones, emails, address, hours,
  copy. **Never invent contact details.**
- Preserve 100% of the original copy — see the COPY RULE below.
- Reuse the assets from `output/<domain>/assets/` — copy the relevant ones (logo,
  photos) into the new project's `public/` folder.
- Keep the palette and identity where it makes sense, but **modernise** the layout.
- Minimum sections: Hero with a clear contact CTA · About · Services or Menu ·
  Social proof (reviews, testimonials) · Contact with address, map and hours ·
  Footer with social links.
- **Mobile-first**, fast, with meta tags and Open Graph filled in.

#### RULE — COPY

- Preserve **100% of the original text** from the brief. **NEVER** rewrite,
  summarise, shorten, translate or invent copy.
- This is a **visual redesign, not a content rewrite.** Use exactly the text,
  headings, tagline, description, hours, address and phone number that are in
  `REBUILD_BRIEF.md`.
- If something is missing from the brief, leave a **placeholder** and **tell the
  user** — do not fill it in yourself.

#### RULE — ASSETS

- **Always** use the files already downloaded in `output/<domain>/assets/` — logos,
  photos, awards, PDFs. Copy the relevant ones into the new project's `public/`.
- **Never** generate new images or use stock placeholders when the real asset was
  already downloaded.
- Convert menus and documents from **PDF into native, navigable HTML pages** — no
  embedded PDFs in the new site.

#### RULE — MOTION (premium standard)

- Use **Framer Motion** with **varied** timings — never everything at once.
- Reveal on scroll with **stagger**, subtle **parallax** on large photos, a
  **cinematic entrance** on the hero, **spring** micro-interactions on buttons and
  cards, **custom easing** (cubic-bezier).
- The finish should feel **expensive and hand-built**, not templated.

### 6. Hand it over

When you are done, explain in a few lines:

- How to run it locally: `npm install && npm run dev`
- How to deploy to **Vercel** (the default deploy target).

---

## Standard stack

**Next.js 14 (App Router) + TypeScript + Tailwind CSS.**
If the user asks for a different stack (Vite, plain React, static HTML), switch.
Deploy target is always **Vercel**.

## Never do this

- Never invent a phone number, email or address — only what is in the brief.
- Never ship a non-responsive site.
- Never delete the `output/` folder — it is the source material.
