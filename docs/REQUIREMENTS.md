# Requirements: XuanVuAudio / tainghe.com.vn Rebuild

**Defined:** 2026-04-14
**Core Value:** Customers can confidently discover and buy the right audio product, while staff can reliably operate catalog, inventory, orders, and after-sales workflows in one coherent system.

## v1 Requirements

Requirements for the initial desktop-first release. Each requirement should map to exactly one roadmap phase.

### Platform and Access

- [x] **PLAT-01**: Staff and admin can sign in to the internal system using authenticated credentials.
- [x] **PLAT-02**: The system enforces at least two internal roles, `admin` and `staff`, with permission differences for user/role management.
- [x] **PLAT-03**: Admin can create, update, deactivate, and assign roles to internal users.

### Catalog Foundation

- [x] **CAT-01**: Staff can create, edit, publish, and unpublish brands with name, slug, and logo.
- [x] **CAT-02**: Staff can create, edit, publish, and unpublish product categories.
- [x] **CAT-03**: Staff can create and edit showroom records with name, address, and phone.
- [x] **CAT-04**: Staff can create and edit products with name, slug, brand, category, description, status, and image gallery.
- [x] **CAT-05**: Staff can assign structured technical specifications to each product.
- [x] **CAT-06**: Staff can set product selling price and optional compare price.
- [x] **CAT-07**: Staff can mark products as featured, new, or recommended for merchandising.

### Storefront Discovery

- [x] **SHOP-01**: Customers can browse a home page that includes featured brands, featured/new/best-selling products, article highlights, showroom links, and contact CTAs.
- [x] **SHOP-02**: Customers can browse category listing pages filtered by brand, price range, connection type, form factor, and key features.
- [x] **SHOP-03**: Customers can sort product listings by price, newest, and featured.
- [x] **SHOP-04**: Customers can search products by keyword.
- [x] **SHOP-05**: Customers can open product detail pages that show name, price, images, description, structured specs, related products, and stock status.
- [ ] **SHOP-06**: Product detail pages show showroom availability using storefront-safe availability messaging.
- [ ] **SHOP-07**: Customers can compare up to two products side by side by structured specifications.

### Cart, Checkout, and Payments

- [ ] **ORD-01**: Customers can add products to cart, update quantities, and remove items.
- [ ] **ORD-02**: Customers can submit checkout with a short form where phone number is required.
- [ ] **ORD-03**: Customers can use a quick-buy flow from product detail with minimal required information.
- [ ] **ORD-04**: Customers can choose COD as a payment method during checkout.
- [ ] **ORD-05**: Customers can choose dynamic QR banking payment during checkout and receive an order-specific QR payment instruction.
- [ ] **ORD-06**: The system can require a deposit for high-value COD orders and show the required deposit amount before order submission.
- [ ] **ORD-07**: Each order stores separate order status, payment status, and verification status.
- [ ] **ORD-08**: New storefront orders enter a staff-verification workflow before fulfillment processing.
- [ ] **ORD-09**: Staff can assign themselves or another staff member to an order and update operational order statuses.

### Showroom Inventory Operations

- [x] **INV-01**: Staff can record inventory quantity per product per showroom.
- [x] **INV-02**: Staff can update showroom inventory with an auditable adjustment history.
- [x] **INV-03**: Storefront stock messaging derives from showroom inventory rules rather than a single global quantity.
- [x] **INV-04**: Staff can view showroom inventory details while confirming or processing orders.

### CRM and Warranty

- [ ] **CRM-01**: Staff can create and update customer records with name, phone, email, address, and notes.
- [ ] **CRM-02**: Staff can create and manage leads linked to a customer, with `chat` supported as a lead source.
- [ ] **CRM-03**: Staff can create and manage support tickets linked to a customer.
- [ ] **CRM-04**: Staff can create and manage warranty cases linked to customer, product, showroom, and serial number.
- [ ] **CRM-05**: Leads, tickets, and warranty cases support status tracking and staff ownership.
- [ ] **CRM-06**: Warranty cases maintain a visible handling history/timeline of updates.

### CMS and Trust Content

- [x] **CMS-01**: Staff and admin can create, edit, draft, and publish articles.
- [x] **CMS-02**: Staff can create and manage article categories.
- [x] **CMS-03**: Articles support slug, excerpt, cover image, author, publish status, and publish timestamp.
- [ ] **CMS-04**: The storefront exposes policy pages for delivery, returns, warranty, and contact.
- [ ] **CMS-05**: The content model preserves a clean extension point for a future AI-assisted article workflow without requiring it in v1.

### Operations Visibility

- [ ] **OPS-01**: Internal users can access a basic dashboard showing operational summary information for catalog, orders, CRM, or content.
- [ ] **OPS-02**: Staff can work from explicit queues or filtered views for pending verification orders and active service records.

## v2 Requirements

Deferred to a future release and not part of the initial roadmap.

### Customer Experience

- **CX-01**: Customers can create and use full customer accounts with saved history and self-service order lookup.
- **CX-02**: Customers receive personalized product recommendations based on brand/category behavior.
- **CX-03**: Customers can access deeper mobile-optimized or mobile-first shopping experiences.

### Operations and Governance

- **GOV-01**: Admin can configure fine-grained permissions beyond the initial admin/staff split.
- **GOV-02**: The system provides advanced analytics and BI dashboards across commerce and service operations.
- **GOV-03**: The system integrates deeply with external channels such as Facebook, Zalo, or marketplaces.

### Content and Marketing

- **MKT-01**: Editors can use AI-assisted article draft generation and review workflows inside CMS.
- **MKT-02**: The system supports marketing automation journeys based on customer and lead behavior.
- **MKT-03**: The platform supports brand/category-aware content suggestions and richer merchandising automation.

## Out of Scope

Explicitly excluded from v1 to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Native mobile app | Web-first MVP; adds separate delivery and support surface too early |
| Loyalty points or membership | Not required to validate storefront + operations core value |
| AI shopping assistant / chatbot | High complexity and not necessary for initial conversion flow |
| Fully automated article publishing pipeline | Editorial control matters more than automation in v1 |
| Deep third-party marketplace/social commerce integrations | Would expand operational surface before core workflows are stable |
| Advanced marketing automation | CRM in v1 is operational, not lifecycle marketing-focused |
| Fine-grained enterprise RBAC | Basic admin/staff model is sufficient for the initial release |
| Complex real-time inventory reservation across all browsing states | MVP only needs reliable showroom-aware stock operations, not full reservation sophistication |

## Traceability

Roadmap-aligned phase mappings for the fine-grained v1 delivery sequence. Each v1 requirement maps to exactly one roadmap phase.

| Requirement | Phase | Status |
|-------------|-------|--------|
| PLAT-01 | Phase 1 | Complete |
| PLAT-02 | Phase 2 | Complete |
| PLAT-03 | Phase 3 | Complete |
| CAT-01 | Phase 4 | Complete |
| CAT-02 | Phase 4 | Complete |
| CAT-03 | Phase 5 | Complete |
| CAT-04 | Phase 6 | Complete |
| CAT-05 | Phase 7 | Pending |
| CAT-06 | Phase 8 | Pending |
| CAT-07 | Phase 8 | Pending |
| CMS-02 | Phase 9 | Complete |
| CMS-01 | Phase 10 | Complete |
| CMS-03 | Phase 10 | Complete |
| CMS-04 | Phase 11 | Pending |
| CMS-05 | Phase 11 | Pending |
| SHOP-01 | Phase 12 | Complete |
| SHOP-02 | Phase 13 | Complete |
| SHOP-03 | Phase 14 | Complete |
| SHOP-04 | Phase 14 | Complete |
| INV-01 | Phase 15 | Complete |
| INV-02 | Phase 16 | Complete |
| INV-03 | Phase 17 | Complete |
| INV-04 | Phase 18 | Complete |
| SHOP-05 | Phase 19 | Pending |
| SHOP-06 | Phase 20 | Pending |
| SHOP-07 | Phase 21 | Pending |
| ORD-01 | Phase 22 | Pending |
| ORD-02 | Phase 23 | Pending |
| ORD-03 | Phase 24 | Pending |
| ORD-04 | Phase 25 | Pending |
| ORD-05 | Phase 26 | Pending |
| ORD-06 | Phase 27 | Pending |
| ORD-07 | Phase 28 | Pending |
| ORD-08 | Phase 29 | Pending |
| ORD-09 | Phase 30 | Pending |
| CRM-01 | Phase 31 | Pending |
| CRM-02 | Phase 32 | Pending |
| CRM-03 | Phase 33 | Pending |
| CRM-04 | Phase 34 | Pending |
| CRM-05 | Phase 35 | Pending |
| CRM-06 | Phase 35 | Pending |
| OPS-01 | Phase 36 | Pending |
| OPS-02 | Phase 36 | Pending |

**Coverage:**
- v1 requirements: 43 total
- Mapped to phases: 43
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-14*
*Last updated: 2026-04-14 after roadmap decomposition to 36 phases*