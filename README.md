# Branded Genius homepage

A redesign sample of the brandedgenius.de homepage. All copy, photos and the hero film come from the current site.

Built with Next.js 16, React 19, Tailwind CSS 4 and Motion, with components from 21st.dev, Magic UI, Motion Primitives and Aceternity, and WebGL backgrounds from Paper Shaders.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy

Import the repository on Vercel. It detects Next.js and needs no environment variables or extra settings.

## Where things live

- `src/content/home.ts`: every piece of copy on the page
- `src/components/site/`: one file per section, in page order in `src/app/page.tsx`
- `src/app/globals.css`: brand colours, the headline accent style (`.accent-serif`) and the CSS animations
- `public/`: logo, photos and the hero film
