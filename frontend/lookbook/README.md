# Lookbook

Shopify lookbook feature built with **metaobjects**, **Liquid**, and a **React** app that fetches product data at runtime via the **Storefront API**.

Product details (title, image, price, compare-at price) are never stored in the lookbook — only **product handles** are. React loads the rest from the API, which supports market-based pricing (e.g. AUD / JPY).

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
│  sections/lookbook-home.liquid      → home page             │
│  sections/lookbook-products.liquid  → product page          │
│  snippets/lookbook-mount.liquid     → mount point + config  │
│  layout/theme.liquid                → Storefront API token  │
└──────────────────────────┬──────────────────────────────────┘
                           │ data-lookbook-config (JSON)
                           │ #lookbook-credentials (token)
┌──────────────────────────▼──────────────────────────────────┐
│  React (assets/lookbook.js)                                 │
│  main.jsx → LookbookSection → Lookbook → ProductCard        │
│  fetchProductsByHandles.js → Storefront GraphQL             │
└─────────────────────────────────────────────────────────────┘
```

### Data flow

1. **Liquid** reads lookbook data from a metaobject (home) or matches lookbooks to the current product (PDP).
2. **`lookbook-mount.liquid`** outputs a `.lookbook-root` div with `data-lookbook-config`:

   ```json
   {
     "lookbooks": [{ "title": "...", "description": "...", "productHandles": ["handle-1"] }],
     "country": "AU",
     "currency": "AUD"
   }
   ```

3. **`theme.liquid`** injects the Storefront access token once:

   ```html
   <script id="lookbook-credentials" type="application/json">
     { "storefrontAccessToken": "..." }
   </script>
   ```

4. **`main.jsx`** reads credentials + config, mounts React into each `.lookbook-root`.
5. **`Lookbook.jsx`** calls the Storefront API with handles + country for market-aware prices.
6. **`ProductCard.jsx`** renders each product.

Credentials are **not** passed in `data-lookbook-config`. The shop domain comes from `window.Shopify.shop`.

---

## Metaobject setup (Admin)

Create a metaobject type with handle `lookbook`:

| Field key | Type | Purpose |
|-----------|------|---------|
| `title` | Single line text | Lookbook heading |
| `description` | Multi-line text | Optional description |
| `product_handles` | List → Single line text | Product URL handles only |
| `banner_image` | File → Image (optional) | Home page banner |

Requirements:

- Enable **Storefront API access** (public read) on the metaobject definition.
- Use real product handles (e.g. `the-complete-snowboard` from `/products/the-complete-snowboard`).

---

## Theme files

| File | Role |
|------|------|
| `sections/lookbook-home.liquid` | Home lookbook section (`enabled_on: index`). Merchant picks one lookbook. |
| `sections/lookbook-products.liquid` | Product page section (`templates: product`). Auto-shows lookbooks containing the current product (max 2). |
| `snippets/lookbook-mount.liquid` | Renders `.lookbook-root` + `data-lookbook-config`. |
| `layout/theme.liquid` | Injects `#lookbook-credentials` from theme settings. |
| `config/settings_schema.json` | Theme setting: `storefront_access_token`. |
| `assets/lookbook.js` | Built React bundle (do not edit by hand). |
| `assets/lookbook.css` | Built styles (do not edit by hand). |

---

## React app structure

```
frontend/lookbook/
├── index.html              # Local test page (mocks Shopify DOM)
├── src/
│   ├── main.jsx            # Entry: mounts on .lookbook-root
│   ├── api/
│   │   ├── lookbookCredentials.js   # Reads #lookbook-credentials
│   │   ├── storefrontClient.js      # GraphQL fetch wrapper
│   │   └── fetchProductsByHandles.js  # Products by handle query
│   ├── components/
│   │   ├── LookbookSection.jsx
│   │   ├── Lookbook.jsx
│   │   ├── ProductCard.jsx
│   │   └── ProductPrice.jsx
│   └── styles/
│       └── lookbook.css
└── vite.config.js          # Builds to ../../assets/
```

---

## Scripts

```bash
cd frontend/lookbook
npm install
```

| Command | Purpose |
|---------|---------|
| `npm run build` | One-off build → `assets/lookbook.js` + `assets/lookbook.css` |
| `npm run dev` | Watch build for Shopify (`vite build --watch`) |
| `npm run local` | Vite dev server for local browser testing |
| `npm run lint` | ESLint |

After changing React code, run **`npm run build`** (or keep `npm run dev` running) before testing in `shopify theme dev`.

---

## Local testing

`index.html` mocks what Shopify provides:

- `#lookbook-credentials` — Storefront API token
- `.lookbook-root[data-lookbook-config]` — lookbook JSON config
- `window.Shopify.shop` — your `.myshopify.com` domain (required for API calls)

```bash
npm run local
```

Open the URL Vite prints (usually `http://localhost:5173`).

Update `productHandles` in `index.html` to real handles from your store. Check DevTools → **Network** for `graphql.json` requests and **Console** for mount errors.

---

## Shopify testing

1. Set **Storefront access token** in Theme settings → Lookbook.
2. Run `shopify theme dev` from the theme root.
3. Add **Lookbook (Home)** to the index template.
4. Add **Lookbook (Products)** to the product template.
5. Open the storefront and verify products render with correct market currency.

---

## Markets & pricing

- `country` and `currency` come from Liquid (`localization.country.iso_code`, `cart.currency.iso_code`).
- GraphQL uses `@inContext(country: $country)` so prices reflect market overrides (AUD / JPY).