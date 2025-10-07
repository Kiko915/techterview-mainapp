# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Stack: Next.js 15 (App Router) with React 19 and Tailwind CSS v4 (via @tailwindcss/postcss). Uses Turbopack for dev/build.
- Entry points:
  - src/app/layout.js defines the RootLayout, global fonts, and metadata. Fonts are loaded with next/font/google (Geist and Geist_Mono) and exposed via CSS variables.
  - src/app/page.js is the default route (/) and demonstrates Next Image and Tailwind utility usage.
  - src/app/globals.css configures Tailwind v4 and theme tokens via CSS variables and @theme inline.
- Config:
  - next.config.mjs is currently default (empty config object).
  - postcss.config.mjs enables the @tailwindcss/postcss plugin required for Tailwind v4.
  - jsconfig.json defines a path alias @/* => ./src/* for cleaner imports.
- Assets: Static files live under public/ and are served from the site root (e.g., /next.svg).

Common commands
- Development server (Turbopack):
  - npm run dev
  - Opens http://localhost:3000 with hot reload. You can edit src/app/page.js and see changes instantly.
- Production build (Turbopack):
  - npm run build
- Run production server (after build):
  - npm run start
- Linting: not configured (no ESLint/dev lint script or config present).
- Tests: not configured (no test framework or scripts present).

Architecture and structure
- App Router (src/app):
  - Routing is filesystem-based. Folders under src/app map to route segments; each segment renders from a page.js (and can define its own layout.js if needed). The shared RootLayout in src/app/layout.js wraps all routes.
  - metadata in layout.js defines the global <title> and description.
- Styling and theming:
  - Tailwind v4 is enabled through PostCSS (postcss.config.mjs with "@tailwindcss/postcss").
  - src/app/globals.css imports Tailwind and defines CSS variables for background/foreground colors and font families. A dark mode variant is provided via prefers-color-scheme.
- Fonts:
  - next/font/google is used to load Geist and Geist_Mono. The returned variables are injected on <body> and referenced by Tailwind via CSS variables to keep the setup consistent and avoid layout shifts.
- Images and static assets:
  - next/image is used for optimized images in src/app/page.js. Static SVGs are read from public/ and referenced by absolute paths (e.g., /vercel.svg).
- Import aliasing:
  - jsconfig.json defines @/* => ./src/* for clean module paths when the codebase grows beyond the initial scaffold.

Notes from README
- You can edit src/app/page.js and changes will hot-reload on the dev server.
- The project was bootstrapped with create-next-app and follows the App Router conventions.
