# Better You Home Care — new site

Rebuild of betteryouhomecare.com with Next.js 14 (App Router), TypeScript, Tailwind CSS and Framer Motion.
All copy, phone numbers, address and photos come from the current site (see `lib/site.ts`).

## Run locally

```bash
npm install
npm run dev   # http://localhost:3000
```

## Deploy to Vercel

1. Push this folder to a GitHub repo (or run `npx vercel` inside it).
2. Import it at vercel.com/new. The defaults for Next.js work as is.
3. Contact forms: set `NEXT_PUBLIC_FORM_ENDPOINT` in Vercel (Settings → Environment Variables) to a form service URL
   such as Formspree, then redeploy. Without it the forms do not send anywhere.
4. Point the domain betteryouhomecare.com to the Vercel project when ready.

The URLs match the old site (`/a1/`, `/l-a/`, `/who-we-are/`…), so existing links and Google results keep working.
