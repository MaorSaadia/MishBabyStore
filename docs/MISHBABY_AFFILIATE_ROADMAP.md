# MishBaby Affiliate Roadmap

## Target operating model

MishBaby should become the canonical discovery and comparison layer. Retailers remain the sellers of record and handle checkout, payment, fulfillment, returns, and order support. Every outbound purchase path should resolve a current retailer offer, apply the correct network/retailer tracking rules, record a privacy-conscious click event, and leave MishBaby with an affiliate disclosure and `rel="sponsored"` support.

MishBabyGuide remains a separate Amazon-focused site. It may be linked as an external editorial property, but its architecture and inventory should not be merged into MishBaby.

## Required domain separation

The future source of truth must represent these independently:

1. **Canonical product**: MishBaby's normalized product identity, editorial content, taxonomy, media, safety/age attributes, and SEO slug.
2. **Retailer**: the merchant customers visit to purchase, such as Amazon, Target, iHerb, AliExpress, or an approved direct baby brand.
3. **Affiliate network**: the tracking/commission platform, such as Amazon Associates or Impact.com. A direct program may use a dedicated `DIRECT` network record.
4. **Retailer offer**: a retailer's purchasable listing for one canonical product, including destination, identifiers, optional price/availability, priority, timestamps, and network relationship.
5. **Imported source record**: immutable/raw-ish import lineage used for mapping, validation, duplicate detection, review, and reprocessing.
6. **Affiliate click event**: an append-only outbound event tied to the resolved offer and tracking context, without storing unnecessary personal data.

Do not create “Impact products.” Impact.com is a network; Target or another advertiser is the retailer.

## Suggested relational model

| Entity | Important fields/relationships |
| --- | --- |
| `canonical_product` | id, slug, title, description, brand, model/MPN, GTIN/UPC/EAN where available, age range, status (`draft/review/published/archived`), metadata, timestamps |
| `category` | id, slug, title, parent ID, metadata; many-to-many with products |
| `need` | id, slug, title, description; many-to-many with products |
| `retailer` | id, slug, name, domain, logo, status, country/market, disclosure/support metadata |
| `affiliate_network` | id, code, name, status, configuration reference (never secret values in ordinary records/docs) |
| `retailer_program` | retailer ID, network ID, advertiser/program ID, market, status, tracking policy, effective dates |
| `retailer_offer` | product ID, retailer ID, program ID, external product ID, merchant URL, resolved affiliate URL or link template reference, currency, optional price, availability, priority, last checked, active/status |
| `import_batch` | source, filename/object reference, checksum, schema version, submitted by, status, counts, timestamps |
| `imported_source_record` | batch ID, source row key, normalized payload, parse/validation state, duplicate candidates, chosen product/offer mapping, review notes |
| `affiliate_click_event` | event ID, offer ID, product ID, retailer/program IDs, timestamp, placement, campaign/sub-ID, referrer/UTM fields, coarse device/country where lawful, redirect result |
| `redirect` | old path, destination path, status code, source/reason, active dates |

Affiliate credentials and signing secrets belong in a secrets manager/environment configuration, not in retailer, network, offer, import, or click tables.

## Current gaps

| Capability | Current state | Required change |
| --- | --- | --- |
| Canonical products | Wix product is the product identity | Add a source-independent canonical product and map Wix/imported records to it. |
| Multiple offers | One Wix listing/price per page | Add zero-to-many retailer offers per canonical product. |
| Retailers/networks | No normalized records | Add separate retailer, network, and retailer-program entities. |
| External IDs | Wix IDs only | Store retailer/SKU/ASIN/advertiser identifiers with source and market uniqueness rules. |
| Affiliate links | No outbound offer resolver | Add server-side resolution/validation, network-specific tracking, and safe redirect behavior. |
| Sponsored links/disclosure | Ordinary ecommerce links | Render `rel="sponsored"` (usually with `nofollow` as policy dictates) and clear disclosures near CTAs/sitewide. |
| Click tracking | Umami page analytics only | Add first-party offer-click events and preserve network sub-ID attribution without sensitive payloads. |
| Store comparison/pages | None | Add ranked offer modules and retailer pages without presenting a dense technical comparison UI. |
| Shop by need | None | Add a curated need taxonomy independent of categories. |
| Price/availability | Wix current values | Treat retailer price as optional, timestamped, currency-specific, and stale-able; never imply freshness without evidence. |
| Offer health | No last-checked/unavailable policy | Add active/unavailable/unknown states, check timestamps, failure reason, fallback ranking, and no-offer UX. |
| CSV import/review | XLSX/CSV packages exist, but no product import workflow | Add staged batch import, validation, mapping, duplicate detection, preview, approval, publish, and audit history. |
| Metadata/structured data | Store metadata and `OnlineStore` JSON-LD | Generate canonical product/editorial/store metadata and valid product/offer structured data only when facts are current. |
| Redirects | Wix redirect client only for checkout | Create an explicit legacy URL redirect registry and test root-slug collisions. |
| Sitemap | Wix product URLs plus selected query URLs | Emit canonical published routes; exclude affiliate redirect and internal workflow URLs. |

## Offer behavior rules

- Do not require price. If a network does not permit price display or freshness cannot be guaranteed, use “Check price at retailer.”
- Store `price`, `currency`, and `last_checked_at` together. Apply a source-specific staleness window.
- Distinguish `available`, `unavailable`, `unknown`, `paused`, and `invalid_link`.
- Rank only eligible active offers. Use explicit priority plus health/freshness; do not silently send users to a different retailer.
- If the preferred offer is unavailable, show the next eligible offer and explain availability conservatively.
- If no offer is eligible, keep the canonical product page useful and suppress the purchase CTA rather than returning a broken link.
- Generate affiliate destinations server-side or from protected templates. Validate schemes/domains and prevent open redirects.
- Record the chosen offer before redirecting. The outbound anchor/redirect must support `rel="sponsored"` and an accessible retailer-specific label.

## Recommended CMS and database approach

### Recommendation

Use managed PostgreSQL as the authoritative structured store, with a typed migration/query layer selected during implementation (Prisma or Drizzle are both compatible options; choose one after a small repository proof). Keep the current MDX blog initially. Build a small protected review/admin workflow in the Next.js application for CSV imports, canonical matching, offer review, and publishing. Consider a separate editorial CMS such as Sanity only when non-developer editorial workflow is a confirmed need; if adopted, keep product identity, retailer offers, imports, and click events in PostgreSQL and reference canonical product IDs from CMS content.

### Evidence and rationale

- The required product/retailer/network/offer/import/click relationships, uniqueness constraints, deduplication, and transactional publishing are relational.
- The current TypeScript Next.js/Vercel application can integrate with managed PostgreSQL without a platform rewrite.
- The repository's MDX blog already provides versioned editorial content, so a CMS migration is not a launch prerequisite.
- Wix is optimized around a store catalog and checkout, not this cross-retailer normalized domain.
- Import review and link health are operational workflows; treating CSV as the final database would be fragile.

During transition, use Wix as a read-only legacy source through an adapter. Do not remove it until canonical mappings, redirects, historical order access, and parity checks are complete.

## Five highest migration risks

1. **Identity and duplicate mapping:** Wix listings and future retailer feeds may represent the same product with inconsistent titles, variants, packs, sizes, and identifiers. Incorrect merges create misleading comparisons; incorrect splits damage SEO and discovery.
2. **Affiliate compliance and link correctness:** Each program has different disclosure, price-display, attribution, link-format, and trademark rules. A generic URL field alone is insufficient.
3. **SEO and root-route collisions:** Existing product pages occupy `/<slug>`, metadata says `OnlineStore`, sitemap includes query URLs, and a structured-data search target does not exist. Unplanned route changes can lose rankings or shadow static pages.
4. **Wix cross-cutting dependencies:** Products, collections, auth, cart, checkout, orders, redirects, images, middleware, and sitemap all depend on Wix. Removing it prematurely would break both shoppers and historical customers.
5. **Price/availability freshness and trust:** Multi-store data becomes stale at different rates. Missing timestamps, unavailable-offer rules, or unsupported price claims would undermine user trust and may violate program terms.

## Phased roadmap

### Phase 1 — design foundation and homepage (completed 2026-07-16)

Phase 1 was re-scoped and completed as the public design-foundation phase. It delivered:

- Central semantic color, typography, spacing, radius, shadow, focus, and container tokens based on the existing cyan/sky identity.
- A redesigned mobile-first homepage explaining the future multi-store discovery model.
- Reusable category, shop-by-need, product-discovery, retailer-option, process, editorial, trust/disclosure, and newsletter-preview components.
- A modernized announcement bar, header, accessible mobile navigation, search presentation, and footer.
- Read-only Wix products mapped into a card API that can accept future retailer counts without a rewrite.
- Truthful homepage metadata, visible affiliate disclosure, real destinations, and no fabricated partnerships, counts, prices, ratings, or social proof.
- Preserved Wix, cart, checkout, account, order, payment, shipping, and route behavior.

Details and validation are recorded in `docs/MISHBABY_PHASE_1_DESIGN_SYSTEM.md`.

### Phase 2 — parallel affiliate data foundation

- Add PostgreSQL schema and migrations behind feature flags.
- Implement read-only Wix extraction into imported source records.
- Implement CSV batch staging, validation, duplicate candidates, approval, and audit history.
- Add retailer, network, program, and offer administration without public exposure.
- Implement link health/freshness jobs and privacy-conscious click tracking in a non-production or preview environment.

### Phase 3 — discovery experience in preview

- Build canonical product, category, need, store, search, and offer-comparison experiences using the approved design system.
- Add affiliate disclosures, sponsored-link behavior, structured data, and accessibility tests.
- Verify analytics and attribution against each approved program.
- Generate and test the complete redirect map and sitemap in preview.

### Phase 4 — controlled cutover

- Freeze and reconcile source mappings.
- Preserve historical cart/order/customer support paths for the agreed period.
- Switch public discovery routes only after parity, compliance, SEO, link, and rollback reviews.
- Retire cart, checkout, and Wix integrations incrementally after monitoring and explicit approval.

## Recommended Phase 2 implementation scope

The next implementation phase should remain on an explicitly named feature branch and avoid removing public ecommerce behavior: approve the relational model and status vocabulary; add PostgreSQL schema and migrations; introduce source adapters without removing Wix; create an authenticated CSV import preview/review workflow; add approved retailer, affiliate-network, and retailer-program records as separate concepts; define redirect and root-slug collision tests; and establish compliance, link-health, privacy, and attribution rules. Do not activate public outbound affiliate links until review criteria pass.
