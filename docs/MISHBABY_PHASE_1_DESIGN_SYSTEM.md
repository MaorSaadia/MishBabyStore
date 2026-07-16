# MishBaby Phase 1 Design System

## Status and direction

Phase 1 was implemented on `feature/mishbaby-affiliate-redesign` on 2026-07-16. It establishes a calm, premium, spacious, editorial, family-oriented, mobile-first discovery experience while Wix products, accounts, cart, checkout, orders, payments, shipping, and existing routes remain operational.

The design uses white and soft-cyan surfaces, restrained borders/elevation, clear hierarchy, and limited motion. It avoids marketplace density, urgent sale language, retailer branding, artificial reviews/social proof, and technical comparison styling. The retained logo is `public/mb-logo.png`; the repository-owned `public/about-us.png` illustration is the hero visual.

No dependency, environment variable, Wix product, deployment setting, or production branch was changed.

## Preserved brand and semantic colors

| Token | CSS value | Hex / existing color | Purpose |
| --- | --- | --- | --- |
| `--brand` | `188 86% 43%` | Cyan 600, `#0891B2` | Recognizable MishBaby accent and focus |
| `--brand-hover` | `188 78% 33%` | Cyan 700, `#0E7490` | Accessible primary action and strong surfaces |
| `--brand-secondary` | `199 89% 48%` | Sky 600, `#0284C7` | Secondary accent |
| `--brand-soft` | `183 100% 96%` | Cyan 50, `#ECFEFF` | Soft brand backgrounds |
| `lama` | Hex | `#F35C7A` | Retained legacy accent; not promoted to primary |
| `--page` | `210 40% 98%` | `#F8FAFC` | Alternating page background |
| `--surface` | `0 0% 100%` | `#FFFFFF` | Cards and primary surfaces |
| `--ink` | `215 28% 17%` | approximately `#1F2937` | Primary text |
| `--ink-secondary` | `215 19% 35%` | approximately `#475569` | Body text |
| `--ink-muted` | `215 16% 47%` | approximately `#64748B` | Supporting metadata |
| `--line` | `214 32% 91%` | approximately `#E2E8F0` | Borders/dividers |
| `--positive` | `160 84% 39%` | `#10B981` | Success |
| `--warning` | `38 92% 50%` | `#F59E0B` | Warning |
| `--critical` | `0 72% 51%` | `#DC2626` | Error |
| `--focus` | `188 86% 43%` | `#0891B2` | Visible focus outline |

Tailwind exposes semantic `brand`, `page`, `surface`, `ink`, `line`, and status utilities. Existing shadcn variables remain supported; primary and ring now align with the MishBaby hierarchy.

## Typography, spacing, radius, and elevation

Inter remains the only typeface through `next/font/google`.

- Display: mobile `text-4xl`, tablet `text-5xl`, desktop `text-6xl`, extra-bold with tight tracking.
- Section title: `text-3xl`, `sm:text-4xl`, approximately 44px at large desktop.
- Card title: `text-base` through `text-2xl` according to card purpose.
- Primary body: `text-base`/`text-lg` with 28–32px line height.
- Supporting copy: `text-sm` with 24px line height.
- Labels: `text-xs`/`text-sm`, bold uppercase with controlled tracking.
- Buttons: `text-sm`/`text-base`, semibold, minimum 44px height.

Layout tokens:

- Page container: `80rem` with 16/24/32px responsive gutters.
- Reading width: `46rem`.
- Standard section spacing: `clamp(4rem, 8vw, 7rem)`.
- Compact section spacing: `clamp(3rem, 6vw, 5rem)`.
- Control radius: 12px; card radius: 16px; feature-panel radius: 24px.
- `shadow-card` is the subtle resting elevation; `shadow-elevated` is reserved for hovered/featured surfaces.

## Reusable components created

Foundations:

- `src/components/ui/Container.tsx`
- `src/components/ui/SectionHeading.tsx`
- Brand and outline variants plus 44px minimum sizing in `src/components/ui/button.tsx`

Product discovery:

- `src/components/products/ProductDiscoveryCard.tsx` accepts image, name, optional brand, category, best-for label, badge, retailer count, and future comparison action.
- Without `retailerCount`, it truthfully renders “View product.” Phase 1 supplies no fabricated retailer count, price, review, rating, or social proof.
- `src/components/home/FeaturedProducts.tsx` reads up to eight current Wix products and maps them into the new card without mutation.

Homepage sections:

- `HomeHero`
- `CategoryGrid`
- `NeedGrid`
- `FeaturedProducts`
- `RetailerSection`
- `HowItWorks`
- `BuyingGuides`
- `TrustSection`
- `NewsletterSection`

Shared category labels remain in `src/lib/getCatgeories.ts`. Need, shopping-option, and footer data live in `src/data/homeDiscovery.ts` rather than being duplicated.

## Homepage sections implemented

1. Compact discovery/trust bar without urgency or discounts.
2. Header with Shop, Categories, Shop by Need, Buying Guides, and About.
3. Required hero message and calls to action.
4. Seven real current Wix categories plus a valid all-products card.
5. Eight shop-by-need cards routed to the closest existing collection.
6. Eight read-only current Wix products in future-ready discovery cards.
7. Neutral shopping-option cards with an explicit availability/non-partnership note.
8. Three-step process explaining retailer checkout and fulfillment.
9. Three real repository MDX articles in reusable editorial cards.
10. Trust/transparency section with visible affiliate disclosure.
11. Honest newsletter preview. No provider exists, so no fake/nonfunctional form was introduced.
12. Footer with shop, categories, guides, about, disclosure, legal, contact, tracking, and social links.

## Existing systems reused

- Wix server client and Wix Stores product queries, read-only.
- Current product and collection routes.
- Existing search behavior through `/list?name=...`.
- `NavIcons`, Wix member/account menu, cart modal, and cart count.
- Current legal, contact, account, tracking, blog, and product routes.
- Inter, Next.js Image, Lucide, Tailwind, shadcn/Radix, and logo/social assets.
- Local MDX articles through `getAllPosts()`.

The old `Slider`, `BestSellers`, `ProductList`, `CategoryList`, and promotional components remain available but are no longer composed on the homepage. They were not deleted.

## Responsive and accessibility decisions

- Single-column mobile hero; two columns at `lg`.
- Category grid: two mobile, three tablet, four desktop columns.
- Need grid: one mobile, two tablet, four desktop columns.
- Products: contained horizontal mobile rail, then two/four-column grid.
- Explicit image aspect ratios and `sizes`; only the hero is priority-loaded.
- Constrained/minimum-zero layouts and document overflow protection.
- One homepage `h1`, followed by identified `h2` section headings and `h3` card titles.
- Shared skip link, landmarks, descriptive navigation labels, links for navigation, buttons for actions, and global visible focus styles.
- Mobile dialog supports focus trapping, Escape, backdrop/close controls, background scroll lock, and 44px targets.
- Desktop categories and mobile search support Escape close behavior.
- Meaningful image alt text; decorative/logo/social images use empty alt when surrounding text provides the name.
- Reduced-motion rules disable smooth scrolling and minimize transitions/animations.
- Dark cyan is used under white text for sufficient action contrast; lighter cyan is a background/accent.

Local headless Chrome renders were inspected at desktop, laptop, and tablet widths. Desktop Chrome enforces a 500px minimum CSS viewport when asked for 375/430 screenshots; the injected layout audit reported viewport/document `500/500` with no overflow. Manual device-emulation review at true 375px and 430px remains recommended.

## Validation

| Check | Result |
| --- | --- |
| `npm run lint` | Passed after implementation with no warnings or errors. |
| `npx tsc --noEmit` | Passed after implementation with no diagnostics. |
| Tests | No test script exists. |
| Homepage/internal routes | Homepage and every rendered internal destination returned HTTP 200. |
| Anchors | `categories`, `shop-by-need`, `how-it-works`, and `affiliate-disclosure` found. |
| Images | No image-request 404/500 logged; local and Wix images rendered in screenshots. |
| Claims scan | No prohibited partnership claims, prohibited retailers, fake counts, or live-price claims in the Phase 1 UI. |
| Visual checks | Desktop/tablet/laptop screenshots reviewed; no overlap or missing image was observed. |

`npm run build` compiled successfully and completed its lint/type stage, then failed while collecting page data for `/api/emails/welcome` because `RESEND_API_KEY` is not available in the local environment. This is the same pre-existing baseline failure documented before Phase 1; Phase 1 did not change that route or any environment value. Non-blocking build warnings reported outdated `caniuse-lite` data and one transient webpack cache-pack rename miss. No dependency was updated. An initial build invocation was stopped by a short command-runner timeout and was rerun with adequate time to obtain this result.

## Known temporary ecommerce elements

- Account and cart controls remain in the header with reduced emphasis.
- Wix middleware and current ecommerce product pages remain unchanged.
- Order, tracking, success, shipping, return, and payment behavior remains intact.
- Wix reports `OWNED_CART_NOT_FOUND` for a visitor before their first cart exists. Navigation now catches the promise to avoid an unhandled rejection, but the existing cart store still logs this pre-existing condition; cart logic was not rewritten.
- Root structured data/global social metadata retain direct-store-era language. Homepage metadata is updated; global schema migration is deferred to avoid broad SEO behavior changes.

## Deferred to Phase 2

- Canonical products, retailers, affiliate networks, programs, offers, imports, and click-event schema.
- Real retailer availability/count data and compare-store actions.
- Affiliate link resolution, sponsored-link handling, tracking, and approved integrations.
- Stable category/need/product/store routes and redirects.
- Normalized search/filter behavior and offer freshness rules.
- Newsletter provider, consent workflow, and subscription endpoint.
- Account/cart/order retirement and historical access plan.
- Global structured data, sitemap, and direct-store metadata conversion.
- Editorial CMS decision and publishing workflow.
