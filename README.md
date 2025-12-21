# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Localization

Translations are managed in `composables/i18n.ts`.

- Usage: `const { t } = useI18n()` then `t('some.key')`
- Supported languages: `fr`, `en`, `it`
- Adding a translation: add the same key under each language in `dict`

Admin settings menu + general tab keys are under the `admin.settings.*` namespace (for example `admin.settings.menuGeneral`). A development-time validation runs in `pages/admin/settings/index.vue` to warn if any menu keys are missing for any supported language.

## Sitemap

The app serves a Google-compatible sitemap at `GET /sitemap.xml` (implemented in `server/routes/sitemap.xml.ts`).

- Entries include `loc`, `lastmod`, `changefreq`, `priority`
- The sitemap is generated dynamically from the database, so it updates automatically when new stores/products are created and visible
- The server validates the generated XML before returning it; invalid output returns HTTP 500

### Manual regeneration

There is no separate build step: request the endpoint to regenerate on-demand.

- Local dev: open `http://localhost:3000/sitemap.xml`
- CLI: `curl -i http://localhost:3000/sitemap.xml`

### Google Search Console submission

- Ensure your production site is reachable and `https://<your-domain>/sitemap.xml` returns HTTP 200
- In Google Search Console: Sitemaps → Add a new sitemap → enter `sitemap.xml` → Submit
