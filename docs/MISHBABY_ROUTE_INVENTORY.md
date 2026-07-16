# MishBaby Route Inventory

## Classification key

- **Preserve**: retain purpose and route through the migration.
- **Redesign**: retain purpose but modernize its presentation.
- **Convert**: change the route from ecommerce behavior to affiliate discovery behavior.
- **Redirect later**: keep during transition, then redirect when a replacement is ready.
- **Remove later**: retain for production safety now, then retire after dependencies and historical access are handled.
- **Investigate**: intent, security, ownership, or replacement behavior must be confirmed first.

No route is changed in this audit.

## Customer-facing pages

| Route | Current purpose | Classification | Migration note |
| --- | --- | --- | --- |
| `/` | Store homepage with slider, best sellers, featured Wix products, categories, and MishBabyGuide banner | Redesign | Become the affiliate discovery homepage in an implementation phase. |
| `/list?cat=<slug>` | Wix collection/category, search (`name`), filters, sorting, and pagination | Convert | Split stable category/search URLs and map results to canonical products. Preserve query URLs with redirects/canonicals. |
| `/<slug>` | Root-level Wix product detail page | Convert | Become canonical product + retailer-offer comparison; plan namespace collisions and redirects before changing. |
| `/bundle-deals` | Wix bundle collection and ecommerce messaging | Convert | Reframe only if bundles/deals remain a curated affiliate concept; otherwise redirect later. |
| `/cart` | Wix current-cart UI and checkout launch | Remove later | Keep until affiliate cutover; then retire with a deliberate user/SEO transition. |
| `/success` | Wix checkout return; forwards to order detail | Remove later | Retain while historical Wix checkout remains active. |
| `/orders` | Authenticated Wix order history | Remove later | Historical-order access/retention plan is required first. |
| `/orders/[id]` | Wix order detail | Remove later | Preserve historical customer access during a defined sunset period. |
| `/profile` | Wix member profile and order summary | Investigate | Decide whether accounts provide future value (saved products/preferences) before converting or retiring. |
| `/order-tracking` | Order tracking information/UI | Remove later | Retain for historical orders, then redirect to support/history guidance. |
| `/abandoned-cart-alert` | Internal-looking abandoned-cart email form | Investigate | Confirm access controls and operational owner; robots currently disallow it. |
| `/affiliate-program` | Existing affiliate-program page | Investigate | This appears aimed at affiliates promoting MishBaby, not retailer affiliate disclosure; review content and naming. |
| `/blog` | Local MDX blog index | Preserve | MishBabyGuide remains separate; confirm which editorial content belongs on MishBaby. |
| `/blog/[slug]` | Local MDX article | Preserve | Preserve URLs and metadata unless a content decision says otherwise. |
| `/blog/category/[category]` | Local MDX category archive | Preserve | Retain taxonomy or map with redirects. |
| `/about-us` | Brand/about page | Redesign | Update business model and trust language during affiliate cutover. |
| `/customer-service` | Contact form/support page | Redesign | Clarify MishBaby versus retailer responsibilities. |
| `/faq` | Ecommerce FAQ | Convert | Replace shipping/payment answers with discovery, price, availability, and retailer-purchase guidance. |
| `/shipping-restrictions` | Store shipping policy | Redirect later | Retailers control shipping after cutover; redirect to an explanatory buying guide/support page. |
| `/return-policy` | Store return policy | Redirect later | Explain that retailer policies govern purchases, while preserving historical-order guidance. |
| `/privacy-policy` | Privacy policy | Preserve | Amend for affiliate networks, outbound clicks, analytics, cookies, imports, and retention before launch. |
| `/terms-of-service` | Store terms | Convert | Replace merchant-of-record terms with affiliate discovery terms and disclosures. |

There is no dedicated `/search`, `/collections/...`, or `/checkout` application route. Search uses `/list?name=...`; collections use `/list?cat=...`; checkout is hosted by Wix after creation from `/cart`.

## Metadata and feed routes

| Route | Current purpose | Classification | Migration note |
| --- | --- | --- | --- |
| `/sitemap.xml` | Next.js sitemap built from static URLs and all Wix products | Convert | Generate canonical product, category, store, need, and editorial URLs; exclude tracking URLs. |
| `/robots.txt` | Allows all except abandoned-cart page | Preserve | Revisit exclusions as admin/import/tracking routes are introduced. |
| `/blog/rss.xml` | RSS feed from local MDX | Preserve | Keep stable if the MishBaby blog remains. |

The root layout also emits `OnlineStore` JSON-LD and a search action pointing at `/search`, although `/search` does not exist. Convert this structured data during implementation.

## API routes

| Route | Method | Current purpose | Classification | Migration note |
| --- | --- | --- | --- | --- |
| `/api/reviews/[slug]` | GET | Reads and paginates repository CSV reviews | Investigate | Confirm provenance, moderation, and whether reviews can legally/accurately transfer to canonical products. |
| `/api/reviews/aws/[slug]` | GET, POST | AWS-backed review read/write path | Investigate | Reconcile with the local CSV implementation and add an explicit moderation/security model. |
| `/api/addReview` | POST | Adds review content through AWS-backed code | Investigate | Audit validation, authentication, abuse prevention, and storage duplication. |
| `/api/generateUploadUrl` | GET | Generates a Wix Media upload URL | Remove later | Replace only if review image uploads remain in scope after Wix migration. |
| `/api/emails/welcome` | POST | Sends a welcome email with Resend | Investigate | Confirm subscriber consent and future account/newsletter strategy. |
| `/api/emails/customer-service` | POST | Sends customer-service email | Preserve | Add abuse protection and update support expectations during cutover. |
| `/api/emails/abandoned-cart` | POST | Sends abandoned-cart email | Remove later | Retire after Wix cart sunset and confirm campaign/data retention. |

No webhook routes were found. Future affiliate imports, price/availability updates, and click processing should use authenticated routes/jobs rather than overloading these APIs.

## Future routes to plan, not implement in this phase

- Stable category routes, for example `/categories/[slug]`
- Shop-by-need routes, for example `/needs/[slug]`
- Canonical product routes under a protected namespace, for example `/products/[slug]`
- Retailer/store pages, for example `/stores/[slug]`
- An internal import/review workflow isolated from public routes
- A first-party outbound click endpoint that records an event and redirects to the resolved affiliate URL
- Affiliate disclosure content linked near offer calls to action and sitewide where appropriate

