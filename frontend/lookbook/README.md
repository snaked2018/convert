# Lookbook

Shopify lookbook feature built with **metaobjects**, **Liquid**, and a **React** app that fetches product data at runtime via the **Storefront API**.

Product details (title, image, price, compare-at price) are never stored in the lookbook — only **product handles** are. React loads product data from the API, which supports market-based pricing (e.g. AUD / JPY).

**Title and description** are rendered in **Liquid** from the metaobject. React only renders the **product grid**.

---

## How it works

```
┌─────────────────────────────────────────────────────────────┐
│  Shopify Admin                                              │
│  Metaobject "lookbook" → title, description, product_handles│
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│  Theme (Liquid)                                             │
│  lookbook-header.liquid         → title + description       │
│  lookbook-product-panel.liquid  → header + mount (PDP)      │
│  lookbook-products.liquid       → tabs + panels (max 2)     │
│  lookbook-mount.liquid          → .lookbook-root + config     │
│  layout/theme.liquid            → token + theme card config │
└──────────────────────────┬──────────────────────────────────┘
                           │ data-lookbook-config (handles only)
                           │ #lookbook-credentials (token)
                           │ #lookbook-theme-config (card styles)
┌──────────────────────────▼──────────────────────────────────┐
│  React (assets/lookbook.js)                                 │
│  main.jsx → LookbookSection → Lookbook → ProductCard        │
│  initLookbookCarousels.js → tab switching (PDP, 2 lookbooks)│
│  fetchProductsByHandles.js → Storefront GraphQL             │
└─────────────────────────────────────────────────────────────┘
```

### Responsibilities

| Layer | Renders |
|-------|---------|
| **Liquid** | Title, description, carousel tabs (PDP), section padding |
| **React** | Product grid, prices, cards (Storefront API) |
| **Vanilla JS** | Show/hide panels when switching tabs |

### Data flow

1. **Liquid** reads lookbook data from a metaobject (home) or matches lookbooks to the current product (PDP, max 2).
2. **`lookbook-header.liquid`** renders title and rich-text description via `metafield_tag`.
3. **`lookbook-mount.liquid`** outputs a `.lookbook-root` div with a minimal `data-lookbook-config`:

   ```json
   {
     "lookbooks": [{ "productHandles": ["handle-1", "handle-2"] }],
     "country": "JP",
     "sectionId": "template--...__lookbook_products",
     "columnsDesktop": 4,
     "columnsMobile": "2",
     "imageRatio": "portrait",
     "showSecondaryImage": true,
     "showVendor": false
   }
   ```

4. **`theme.liquid`** injects shared config once (not repeated per mount):

   ```html
   <script id="lookbook-credentials" type="application/json">
     { "storefrontAccessToken": "..." }
   </script>
   <script id="lookbook-theme-config" type="application/json">
     {
       "cardStyle": "standard",
       "cardColorScheme": "background-2",
       "badgePosition": "bottom left",
       "soldOutBadgeColorScheme": "inverse",
       "saleBadgeColorScheme": "accent-2"
     }
   </script>
   ```

5. **`main.jsx`** merges mount config + theme config, mounts React into each `.lookbook-root`, then runs **`initLookbookCarousels()`**.
6. **`Lookbook.jsx`** fetches products by handle with `@inContext(country:)` for market-aware prices.
7. **`ProductCard.jsx`** renders Dawn-compatible product cards.

Credentials are **not** passed in `data-lookbook-config`. The shop domain comes from `window.Shopify.shop`.

### Product page (2 lookbooks)

```
[ Tab 1 ] [ Tab 2 ]              ← Liquid tabs
Winter Collection                ← Liquid header (panel 1)
Description...                   ← Liquid
[product] [product] ...          ← React grid (panel 1)

( panel 2 hidden until tab click )
```

Each panel has its own Liquid header + React mount. Tab clicks toggle `.lookbook-carousel__panel--hidden` via `initLookbookCarousels.js`.

---

## Metaobject setup (Admin)

Create a metaobject type with handle `lookbook`:

| Field key | Type | Purpose |
|-----------|------|---------|
| `title` | Single line text | Lookbook heading |
| `description` | Rich text | Optional description |
| `product_handles` | List → Single line text | Product URL handles only |
| `banner_image` | File → Image (optional) | Not yet wired in Liquid |

Requirements:

- Enable **Storefront API access** (public read) on the metaobject definition.
- Use real product handles (e.g. `the-complete-snowboard` from `/products/the-complete-snowboard`).

---

## Theme files

| File | Role |
|------|------|
| `sections/lookbook-home.liquid` | Home section (`enabled_on: index`). Merchant picks one lookbook. |
| `sections/lookbook-products.liquid` | Product section (`templates: product`). Auto-matches lookbooks (max 2). |
| `snippets/lookbook-header.liquid` | Title + description from metaobject. |
| `snippets/lookbook-product-panel.liquid` | One panel: header + mount point. |
| `snippets/lookbook-mount.liquid` | `.lookbook-root` + slim `data-lookbook-config`. |
| `layout/theme.liquid` | Loads assets, `#lookbook-credentials`, `#lookbook-theme-config`. |
| `config/settings_schema.json` | Theme setting: `storefront_access_token`. |
| `assets/lookbook.js` | Built React bundle (do not edit by hand). |
| `assets/lookbook.css` | Built styles (do not edit by hand). |

---

## React app structure

```
frontend/lookbook/
├── index.html                    # Local test page (mocks Shopify DOM)
├── src/
│   ├── main.jsx                  # Entry: mounts on .lookbook-root
│   ├── initLookbookCarousels.js  # Tab switching for PDP carousel
│   ├── api/
│   │   ├── lookbookCredentials.js   # Reads #lookbook-credentials
│   │   ├── lookbookThemeConfig.js   # Reads #lookbook-theme-config
│   │   ├── storefrontClient.js      # GraphQL fetch wrapper
│   │   └── fetchProductsByHandles.js
│   ├── components/
│   │   ├── LookbookSection.jsx
│   │   ├── Lookbook.jsx             # Product grid fetch + render only
│   │   ├── LookbookProductGrid.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProductPrice.jsx
│   └── styles/
│       └── lookbook.css
└── vite.config.js                # Builds to ../../assets/
```

---

## Scripts

```bash
cd frontend/lookbook
npm install
```

| Command | Purpose |
|---------|---------|
| `npm run build` | Lint + build → `assets/lookbook.js` + `assets/lookbook.css` |
| `npm run dev` | Watch build for Shopify (`vite build --watch`) |
| `npm run local` | Vite dev server for local browser testing |
| `npm run lint` | ESLint |

After changing React code, run **`npm run build`** (or keep `npm run dev` running) before testing in `shopify theme dev`.

---

## Local testing

`index.html` should mock what Shopify provides:

- `#lookbook-credentials` — Storefront API token (use a placeholder, not a real token in git)
- `#lookbook-theme-config` — card style settings (same shape as `theme.liquid`)
- Static title/description above the mount (mirrors `lookbook-header.liquid`)
- `.lookbook-root[data-lookbook-config]` — handles + grid settings only
- `window.Shopify.shop` — your `.myshopify.com` domain

```bash
npm run local
```

Open the URL Vite prints (usually `http://localhost:5173`).

Update `productHandles` in `index.html` to real handles from your store. Check DevTools → **Network** for `graphql.json` requests and **Console** for mount errors.

---

## Shopify testing

1. Set **Storefront access token** in Theme settings → Lookbook.
2. Run `shopify theme dev` from the theme root.
3. Add **Lookbook (Home)** to the index template and pick a lookbook metaobject.
4. Add **Lookbook (Products)** to the product template.
5. Verify:
   - **Home** — Liquid title/description + React product grid
   - **PDP (1 lookbook)** — header + grid on load
   - **PDP (2 lookbooks)** — tabs, first panel visible on load, tab switching works

---

## Markets & pricing

- `country` comes from Liquid (`localization.country.iso_code`) and is passed in `data-lookbook-config`.
- GraphQL uses `@inContext(country: $country)` so prices reflect market overrides (AUD / JPY).
- Currency on product cards comes from the Storefront API response, not from the mount config.

---

## Security note

Do not commit real Storefront access tokens. Use theme settings in production. The mount config is public HTML — it should only contain handles and UI settings, never secrets.

---

## GraphQL testing (Postman / Insomnia / Shopify GraphiQL)

Use the **Storefront API** (not Admin API).

### Request setup

| Setting | Value |
|---------|-------|
| **Method** | `POST` |
| **URL** | `https://YOUR-STORE.myshopify.com/api/2026-10/graphql.json` |
| **Header** | `Content-Type: application/json` |
| **Header** | `X-Shopify-Storefront-Access-Token: YOUR_TOKEN` |
| **Body** | `{ "query": "...", "variables": { ... } }` |

### Products by handles (same as React app)

See `src/api/fetchProductsByHandles.js` for the exact query. Variables example:

```json
{
  "country": "AU",
  "handles": ["the-complete-snowboard"]
}
```

### Smoke test

```graphql
query { shop { name } }
```
