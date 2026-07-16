# MishBaby Current Architecture

## Executive summary

MishBaby is currently a TypeScript Next.js ecommerce storefront backed primarily by Wix. The UI reads products and collections from Wix Stores, manages visitor/member authentication through Wix OAuth, manages the cart and checkout through Wix Ecom, and redirects customers to Wix-hosted checkout. This coupling reaches middleware, layouts, navigation, product/category pages, cart state, account pages, orders, sitemap generation, and image rendering.

## Platform and dependencies

| Area | Current implementation |
| --- | --- |
| Framework | Next.js `14.2.35` |
| React | React and React DOM `^18` |
| Router | App Router only (`src/app`); no `src/pages` routes found |
| Language | TypeScript/TSX, strict mode; `allowJs` is enabled |
| Package manager | npm (`package-lock.json`, lockfile version 3) |
| Styling | Tailwind CSS `3.4.11`, PostCSS, global CSS variables, `tailwindcss-animate` |
| Component primitives | shadcn-style local components backed by Radix UI; Lucide and React Icons |
| Animation | Framer Motion plus custom Tailwind keyframes |
| State | Zustand for cart; React context for the Wix client; local React state elsewhere |
| Forms/validation | React Hook Form is installed; no schema-validation library such as Zod/Yup found |
| Data fetching | Wix SDK calls in async server components and client-side Wix SDK calls; SWR and Axios are installed, with ordinary `fetch` also used |
| Product/CMS source | Wix Stores products and collections |
| Editorial source | Repository MDX files with Gray Matter and `next-mdx-remote` |
| Reviews | Repository CSV files for reads; additional AWS-backed review/upload routes also exist and require investigation |
| Analytics | Umami cloud script is active in the root layout; `@vercel/analytics` is installed but its component is commented out |
| Email | Nodemailer, Resend, and React Email routes/templates |
| Media/storage | Wix Media; AWS S3 SDK; Vercel Blob is installed |
| SEO | Next metadata, dynamic `sitemap.ts`, `robots.ts`, JSON-LD, plus a `next-sitemap` config |
| Deployment | Vercel is implied by dependencies and `.vercel` ignore rules; no tracked `vercel.json`, CI workflow, or Docker configuration was found |

## Wix and payment coupling

Direct Wix packages are `@wix/sdk`, `@wix/stores`, `@wix/ecom`, `@wix/members`, `@wix/redirects`, and `@wix/media`.

- `src/middleware.ts` creates Wix visitor tokens and stores a refresh token cookie.
- `src/lib/wixClientServer.ts` exposes server-side products, collections, orders, and members modules.
- `src/context/wixContext.tsx` exposes client-side products, collections, current cart, redirects, and members modules.
- `src/hooks/useCartStore.ts` uses Zustand around Wix `currentCart` calls.
- `src/app/cart/page.tsx` creates a Wix checkout, creates a Wix redirect session, and navigates to the returned checkout URL.
- Product selection and add-to-cart behavior depend on Wix product IDs, variant IDs, app ID, inventory, and price data.
- Account/profile/order routes depend on Wix Members and Wix Orders.

No direct Stripe, PayPal SDK, or other payment-processor code was found. Payment-brand images are present, but actual checkout processing is delegated to Wix.

## Product data flow

```text
Wix Stores products/collections
        |
        +--> server Wix client (visitor/member refresh-token cookie)
        |       +--> homepage product sections
        |       +--> /list category/search/filter/sort results
        |       +--> /[slug] product page and metadata
        |       +--> related products and sitemap
        |
        +--> client Wix context
                +--> variant/product lookups
                +--> Zustand current cart
                +--> Wix checkout and redirect session
```

### Source and fetching

- Products and collections are fetched directly from Wix Stores query APIs.
- Category discovery uses Wix collections. A separate hard-coded category list supplies navbar/mobile-menu labels and thumbnails.
- `/list` gets a collection by slug, then queries products by collection ID.
- Search is not a separate route: the navbar writes `name` to `/list`, and the Wix query uses `contains("name", value)`.
- Filters use minimum/maximum Wix price, ribbon equality (`New Arrival` or `Sale`), and price sorting.
- Pagination uses Wix query `limit` and `skip`; the page query is treated as zero-based.
- The product route queries by Wix slug. `generateStaticParams` fetches only the first 100 products, which is a scaling risk.

### Caching and rendering

- Product pages export `revalidate = 43200` (12 hours).
- Product lookup is wrapped in React `cache()` to deduplicate calls during a render/request.
- Other Wix queries do not declare an explicit application cache policy.
- The server Wix client reads cookies, which can make rendering request-dependent.
- Reviews and recommendations on product pages are dynamically imported with server-side rendering disabled.

### Current product shape

There is no repository-owned canonical product type. Components consume `products.Product` from `@wix/stores` and fields including:

- Wix `_id`, `slug`, `name`, and HTML `description`
- media/main image and media items
- collection IDs and ribbon
- `priceData.price` and `priceData.discountedPrice`
- stock quantity/in-stock state
- product options, choices, variants, variant IDs, variant image, variant price, and variant stock

The UI assumes USD in many places. Product descriptions are sanitized with DOMPurify before rendering.

## Cart and checkout flow

1. Middleware establishes a Wix visitor refresh token.
2. Client components load the current Wix cart through Zustand.
3. Add-to-cart sends Wix catalog item ID, optional variant ID, quantity, and Wix app ID.
4. Cart and cart modal can update quantities and remove items.
5. Checkout creates a Wix Ecom checkout from the current cart.
6. Wix Redirects creates the hosted checkout URL, and the browser leaves the application.
7. `/success` reads the returned order ID and redirects to `/orders/[id]`.

## Other content and services

- Blog posts live in `src/content/blog/*.mdx`, are read synchronously from disk, and feed blog, category, detail, and RSS routes.
- Review CSVs live below `src/data/reviews/<product-slug>/reviews.csv`. A parallel AWS review API path and upload flow exist; the coexistence of local CSV and AWS implementations should be resolved before migration.
- Review images/uploads use AWS and Wix Media routes. `@vercel/blob` is installed and referenced elsewhere in the codebase, but it is not the primary product store.
- Email endpoints handle welcome, customer-service, and abandoned-cart messages.
- No webhook route was found.

## Environment variable names

Values were not read or recorded. Names referenced by code or present in the local environment file are:

- `NEXT_PUBLIC_WIX_CLIENT_ID`
- `NEXT_PUBLIC_WIX_SITE_ID`
- `NEXT_PUBLIC_WIX_APP_ID`
- `WIX_API_KEY`
- `FEATURED_PRODUCTS_FEATURED_ALL_CATEGORY_ID`
- `FEATURED_PRODUCTS_FEATURED_CATEGORY_ID`
- `NEXT_PUBLIC_BASE_URL`
- `SITE_URL`
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_BUCKET_NAME`
- `EMAIL`
- `EMAIL_PASS`
- `RESEND_API_KEY` (referenced by code; not listed in the inspected local file)

## Architecture concerns to carry forward

1. Wix product, identity, cart, checkout, order, redirects, and sitemap concerns are tightly coupled; Wix cannot be removed as a single isolated change.
2. There is no canonical product abstraction independent of a merchant/source record.
3. Product pages use the root `/<slug>` namespace, creating collisions with current and future static/store/need routes.
4. Static generation covers only 100 Wix products, and sitemap generation independently pages through all products.
5. Search/filter behavior is bound to Wix fields and lacks a reusable search index or normalized taxonomy.
6. SEO metadata and structured data still describe an `OnlineStore`, which must change when commerce responsibility changes.

## Validation snapshot (2026-07-16)

No application files or dependencies were changed before or during validation.

| Command | Result | Notes |
| --- | --- | --- |
| `npm run lint` | Passed | `next lint` reported no warnings or errors. |
| `npx tsc --noEmit` | Passed | Completed with no TypeScript diagnostics. |
| Tests | Not available | `package.json` has no test script; no test command was invented or dependency installed. |
| `npm run build` | Failed after compilation | Next compiled successfully and ran its lint/type stage, then page-data collection failed for `/api/emails/welcome` because `RESEND_API_KEY` is not available in the local environment. Browserslist also warned that `caniuse-lite` is outdated. No dependency was updated. |

An initial `npm run build` invocation was terminated by the command runner after approximately five seconds because its timeout was too short; the command was rerun with adequate time and produced the result above. The missing-key failure predates this documentation-only audit: `src/app/api/emails/welcome/route.ts` constructs the Resend client at module scope, and this audit did not change that file or any environment configuration.
