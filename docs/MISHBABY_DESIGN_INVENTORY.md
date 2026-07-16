# MishBaby Design Inventory

## Brand summary

The current recognizable visual language is cyan/sky blue on white with cool gray text and occasional rose/pink sale accents. It feels friendly and lightweight, but tokens are scattered through Tailwind class strings rather than expressed as a deliberate MishBaby design system. The future redesign should preserve this cyan/sky identity while reducing inconsistent gradients, radii, shadows, and one-off component treatments.

## Exact configured tokens

### Tailwind

- Custom named color: `lama: #F35C7A`.
- Semantic colors map to CSS HSL variables: `background`, `foreground`, `card`, `popover`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, and five chart colors.
- Radius mapping: `lg = var(--radius)`, `md = var(--radius) - 2px`, `sm = var(--radius) - 4px`.
- Custom breakpoint override/additions: `sm 720px`, `md 768px`, `lg 1024px`, `xl 1280px`, `2xl 1536px`.
- Custom animations: accordion up/down, marquee (20s), marquee2 (25s), horizontal gradient (10s), and shimmer (2s).

### Light CSS variables

| Variable | Value |
| --- | --- |
| `--background` | `0 0% 100%` |
| `--foreground` | `222.2 84% 4.9%` |
| `--card` / `--card-foreground` | `0 0% 100%` / `222.2 84% 4.9%` |
| `--popover` / `--popover-foreground` | `0 0% 100%` / `222.2 84% 4.9%` |
| `--primary` / `--primary-foreground` | `222.2 47.4% 11.2%` / `210 40% 98%` |
| `--secondary` / `--secondary-foreground` | `210 40% 96.1%` / `222.2 47.4% 11.2%` |
| `--muted` / `--muted-foreground` | `210 40% 96.1%` / `215.4 16.3% 46.9%` |
| `--accent` / `--accent-foreground` | `210 40% 96.1%` / `222.2 47.4% 11.2%` |
| `--destructive` / `--destructive-foreground` | `0 84.2% 60.2%` / `210 40% 98%` |
| `--border` / `--input` | `214.3 31.8% 91.4%` |
| `--ring` | `222.2 84% 4.9%` |
| `--radius` | `0.5rem` (8px at the default root size) |

A dark variable set exists in `globals.css`, but no sitewide dark-mode experience was found.

## Colors used directly in components

The dominant brand-facing utilities are:

- Cyan: `cyan-50`, `cyan-100`, `cyan-200`, `cyan-300`, `cyan-400`, `cyan-500`, `cyan-600`, `cyan-700`, `cyan-800`, `cyan-900`.
- Sky: `sky-50`, `sky-100`, `sky-200`, `sky-500`, `sky-600`, `sky-700`.
- Neutral structure: white, black overlays, and broad `gray-50` through `gray-900` usage, with some slate and neutral utilities.
- Commerce/status accents: rose/pink/red for discounts/errors, yellow/amber for ratings and highlights, and green for success states.
- Common gradients include cyan-to-blue, sky/cyan/slate, cyan-to-cyan, and rose-to-pink.

Most prominent current brand treatments are the cyan-600 promo bar, cyan hover/active navigation, cyan/sky category and homepage sections, and sky-100 footer. `lama` (`#F35C7A`) does not appear to be the dominant live brand color.

## Typography, spacing, radius, and shadows

- Typography: Google Inter through `next/font/google`; Tailwind's default font sizing/weights. Headings commonly use bold/extrabold with gray-800/900.
- Layout: Tailwind `container mx-auto` plus multiple page-specific max widths and horizontal paddings (`px-4`, `md:px-8`, then `lg:px-16 xl:px-32 2xl:px-64`). There is no centralized page-shell spacing primitive.
- Section rhythm: commonly `mt-6`, `mt-8`, `mt-12`, `py-8`, and `py-10`; cards generally use `p-3` to `p-6`.
- Radius: the repository uses `rounded-full` and `rounded-lg` most heavily, followed by `rounded-md`, with `rounded-xl`, `2xl`, and `3xl` mixed in.
- Shadows: `shadow-sm`, `shadow-md`, and `shadow-lg` are all common; product/detail and modal surfaces sometimes use `shadow-xl`/`2xl` and hover elevation.

## Branding assets

- Primary logo assets: `public/mb-logo.png` and `public/mb-logo.jpeg`.
- Social/metadata branding: `public/og-image.png`, `src/app/opengraph-image.png`, and `src/app/favicon.ico`.
- The PNG logo is used in desktop navigation (60x60 display), mobile navigation (45x45), and footer (60x60).
- Additional promotional imagery includes announcement, giveaway, book/masterclass, bundle, guide, and slider assets.
- Payment logos and ecommerce-specific imagery remain present and must not be removed in this phase.

Before a visual implementation, confirm which logo file is the master, obtain a vector source if available, and define safe-area/minimum-size rules. Do not combine MishBabyGuide branding with MishBaby.

## Navigation inventory

### Desktop

Sticky white 80px navigation with logo, a hover/click category dropdown backed by a hard-coded category list, Bundle Deals, external MishBabyGuide Parenting Guides, Order Tracking, Contact, search, account, and cart icons. Active and hover states are cyan with an animated underline.

### Mobile/tablet

A 64–80px sticky header shows logo, search, account/cart icons, and a menu trigger. The menu is a full-height slide-over with shop links, expandable categories, operational links, social links, and payment icons. Body scrolling is locked while open.

Both variants are structurally reusable, but their ecommerce destinations and payment/cart content require conversion.

## Page and component inventory

| Surface/component | Current characteristics | Recommendation |
| --- | --- | --- |
| Local `ui/*` primitives | shadcn/Radix buttons, dialogs, tabs, forms, cards, badges, alerts, etc. | Reuse with modification: retokenize centrally and retain accessible primitives. |
| `WixImage`, loaders, skeletons, pagination, toast provider | Utility/infrastructure components | Reuse with modification where not Wix-specific; replace `WixImage` after media migration. |
| `Navbar`, `MobileMenu`, `Footer`, `SearchBar` | Responsive and recognizable, but tightly ecommerce-oriented and visually inconsistent | Reuse structure with modification; replace information architecture, cart/payment content, and token usage. |
| `PromoBanner`, shipping/security/payment banners | Strong commerce language and cyan treatment | Replace content/behavior for disclosure or editorial promotion; do not reuse sales/shipping claims after cutover. |
| `ProductList` card | Image-led card with sale/new badge, single price, hover lift | Replace with canonical-product discovery card supporting retailer count, price qualification, and disclosure-safe CTA. |
| `BestSellers` card/carousel | Separate card implementation, ratings fetched per product | Replace/merge into a shared product-card system to avoid divergent behavior and N+1 review calls. |
| `BundleProductCard`, `SuggestedProducts` | Ecommerce-specific discounts/cart behavior | Replace during affiliate conversion. |
| `CategoryList` | Image-overlay category cards with responsive grid | Reuse with modification; retokenize and point to stable category taxonomy. |
| `Filter`, `Pagination` | Wix price/ribbon/sort query controls | Reuse interaction ideas with modification; back with normalized categories, needs, stores, and offer data. |
| Product page (`/[slug]`) | Two-column media/details, variants, price, add-to-cart, policy, reviews, recommendations | Replace page composition for canonical product details and retailer offer comparison. Reuse image/review/share concepts selectively. |
| Cart/modal/add/customization/price | Direct Wix commerce and variant selection | Remove later after cutover; not reusable for outbound affiliate purchases. |
| Account/order components and auth modals | Wix members/orders | Investigate; reuse only if accounts remain a product requirement. |
| Homepage slider and sections | Multiple bespoke gradients/card styles | Replace section composition while preserving brand identity and useful content concepts. |
| Blog/guide components | Local editorial content and product linking | Reuse with modification; update product relationships to canonical IDs. |
| Review components | Rich UI, but data provenance/storage is split | Reuse with modification only after review policy and canonical-product mapping are settled. |

## Direction for the future system

Preserve cyan/sky as the principal identity, white space, friendly rounded forms, Inter initially, and the existing logo pending brand-asset confirmation. Consolidate these into semantic tokens before page redesign: brand, brand-soft, ink, muted, surface, border, positive, warning, critical, sale, focus, radius scale, elevation scale, content widths, and section spacing. Avoid imitating Amazon, overloading cards with comparison data, or allowing each page to invent gradients and shadows.

