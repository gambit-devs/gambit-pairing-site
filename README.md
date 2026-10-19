# Gambit Pairing site

The Gambit Pairing website is a Next.js 16 static export deployed as an
asset-only Cloudflare Worker. The current public routes are `/`, `/download`,
and the three generated post-download routes: `/download/windows`,
`/download/macos`, and `/download/linux`.

## Requirements

- Node.js 20.9 or newer
- npm
- Network access to the GitHub API for homepage data during a production build

Install dependencies with:

```bash
npm install
```

Set `GITHUB_TOKEN` locally when GitHub API rate limits would otherwise affect a
build. Keep the token in an ignored `.env.local` file or the shell environment;
never commit it.

## Development and verification

```bash
npm run dev
npm run verify
```

`verify` runs formatting, linting, Next route type generation, unit tests, and a
static production build. Browser route and visual tests run separately with:

```bash
npm run test:e2e
npm run test:e2e:update
```

The visual snapshots live under `tests/e2e/__screenshots__`. Update them only
when a deliberate rendering change has been reviewed.

## Build and deploy

`npm run build` writes the static site to `out/`. The checked-in
`wrangler.jsonc` points Wrangler at that directory:

```bash
npm run deploy:dry-run
npm run deploy
```

Authenticate Wrangler with `npx wrangler login` before the first deployment.
The deployment is intentionally configured as an asset-only Worker; no Pages
project or runtime API is required.

## Repository layout

- `app/` — Next route entrypoints, global styles, and local fonts
- `components/home/` — homepage sections
- `components/download/` — download-page sections
- `components/navigation/` and `components/ui/` — reusable presentation code
- `lib/site/` — shared site configuration and platform/FAQ data
- `lib/github/` — server-only build-time GitHub client and normalizers
- `tests/` — pure unit tests and browser route/visual tests
