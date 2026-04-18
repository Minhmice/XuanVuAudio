# Roadmap: XuanVuAudio / tainghe.com.vn Rebuild

## Overview

This roadmap delivers the same desktop-first ecommerce MVP in a more granular order so each phase is smaller, easier to plan, and dependency-aware. The sequence still follows the same business logic: secure internal access first, then catalog and showroom foundations, then editorial trust content needed by the storefront, then storefront discovery, inventory truth, product evaluation, checkout and payment handling, staff-operated order workflows, CRM and warranty operations, and finally launch-day visibility and queues.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Internal Authentication Entry** - Establish authenticated sign-in for internal users.
 (completed 2026-04-16)
- [x] **Phase 2: Internal Roles & Permission Boundaries** - Enforce the initial `admin` and `staff` permission model.
 (completed 2026-04-16)
- [x] **Phase 3: Internal User Administration** - Give admin users control over internal user lifecycle and role assignment.
 (completed 2026-04-16)
- [x] **Phase 4: Brand & Category Management** - Create and manage the core merchandising taxonomies.
 (completed 2026-04-16)
- [x] **Phase 5: Showroom Directory Setup** - Establish showroom records used by inventory and operations.
 (completed 2026-04-18)
- [x] **Phase 6: Product Core Records** - Create the canonical product records with core descriptive data and media.
 (completed 2026-04-18)
- [x] **Phase 7: Product Specification Modeling** - Add structured technical specifications for spec-heavy products.
 (completed 2026-04-18)
- [x] **Phase 8: Pricing & Merchandising Controls** - Add pricing fields and merchandising flags that power conversion surfaces.
 (completed 2026-04-18)
- [x] **Phase 9: Article Category Management** - Create editorial categories for trust and SEO content organization.
 (completed 2026-04-16)
- [x] **Phase 10: Article Authoring & Publishing** - Enable article drafting, editing, publishing, and metadata management.
 (completed 2026-04-16)
- [x] **Phase 11: Policy Pages & AI-Ready Content Model** - Publish trust policy pages and preserve clean future AI-content extension points.
 (completed 2026-04-16)
- [x] **Phase 12: Storefront Home Merchandising** - Launch the homepage with featured brands, products, article highlights, and contact/showroom CTAs.
 (completed 2026-04-18)
- [x] **Phase 13: Category Listings & Faceted Filtering** - Deliver catalog browsing with desktop-first filtering controls.
 (completed 2026-04-18)
- [x] **Phase 14: Listing Sorting & Product Search** - Add listing sort modes and keyword product search.
 (completed 2026-04-18)
- [x] **Phase 15: Showroom Inventory Ledger** - Record per-product inventory by showroom.
 (completed 2026-04-18)
- [x] **Phase 16: Inventory Adjustment Audit Trail** - Track inventory changes with auditable history.
 (completed 2026-04-18)
- [x] **Phase 17: Availability Rules & Storefront Stock Messaging** - Derive customer-facing availability from showroom inventory rules.
 (completed 2026-04-18)
- [x] **Phase 18: Inventory Visibility in Order Operations** - Expose showroom inventory context inside staff order workflows.
 (completed 2026-04-18)
- [ ] **Phase 19: Product Detail Experience** - Deliver product detail pages with rich product information and related items.
- [ ] **Phase 20: Showroom Availability on PDP** - Surface storefront-safe showroom availability on product detail pages.
- [ ] **Phase 21: Product Comparison Flow** - Enable side-by-side comparison for up to two products.
- [ ] **Phase 22: Cart Management** - Let customers add, update, and remove products in cart.
- [ ] **Phase 23: Checkout Contact Capture** - Enable short-form checkout submission with required phone capture.
- [ ] **Phase 24: Quick Buy Submission** - Add reduced-friction quick-buy ordering from product detail.
- [ ] **Phase 25: Checkout Payment Method Selection** - Support COD selection during checkout.
- [ ] **Phase 26: Dynamic QR Banking Instructions** - Generate order-specific QR banking payment instructions.
- [ ] **Phase 27: High-Value COD Deposit Rules** - Require and disclose deposits for high-value COD orders.
- [ ] **Phase 28: Order State Modeling** - Store distinct order, payment, and verification states.
- [ ] **Phase 29: Verification Intake Queue** - Route new storefront orders into staff verification before fulfillment.
- [ ] **Phase 30: Order Assignment & Processing Actions** - Let staff assign operational ownership and progress orders.
- [ ] **Phase 31: Customer Records Workspace** - Create and maintain customer records used across commerce and service operations.
- [ ] **Phase 32: Lead Capture & Management** - Manage leads linked to customers, including chat-origin leads.
- [ ] **Phase 33: Support Ticket Handling** - Manage service/support tickets linked to customers.
- [ ] **Phase 34: Warranty Case Creation** - Create serial-based warranty cases linked to customer, product, and showroom.
- [ ] **Phase 35: Service Ownership & Warranty History** - Add ownership/status handling for service records and visible warranty timelines.
- [ ] **Phase 36: Operations Dashboard & Work Queues** - Provide a launch-ready dashboard and actionable operational queues.

## Phase Details

### Phase 1: Internal Authentication Entry
**Goal**: Internal users can sign in to the system with authenticated credentials.
**Depends on**: Nothing (first phase)
**Requirements**: PLAT-01
**Success Criteria** (what must be TRUE):
  1. Staff and admin can access the internal system through an authenticated sign-in flow.
  2. Unauthenticated access to internal surfaces is blocked.
**Plans**: 6 plans

Plans:
- [x] 01-01-PLAN.md — Scaffold Next.js app + Tailwind theme tokens + buildable baseline (no `npm test` required yet)
- [x] 01-02-PLAN.md — Add Vitest/RTL + Playwright harness; make `npm test` and `npm run test:full` runnable/green
- [x] 01-03-PLAN.md — Wire Supabase SSR/browser/admin clients + define long-lived session & remember-me policy (D-04/D-05) + auth action contract
- [x] 01-04-PLAN.md — Implement D-06 primitive: revoke other sessions while preserving current session (SQL + server helper + unit tests)
- [x] 01-05-PLAN.md — Implement username/email identifier resolution + locked/deactivated enforcement with exact UI-SPEC messaging (and tests)
- [x] 01-06-PLAN.md — Build `/login` + protected `/dashboard` + middleware gating + meaningful Playwright smoke with automated provisioning

### Phase 2: Internal Roles & Permission Boundaries
**Goal**: The system enforces the initial `admin` and `staff` role split for internal access.
**Depends on**: Phase 1
**Requirements**: PLAT-02
**Success Criteria** (what must be TRUE):
  1. Internal users are assigned at least `admin` or `staff` roles.
  2. Permission differences exist for user and role management operations.
**Plans**: TBD

Plans:
- [x] 02-01: Define role boundary matrix for v1 internal operations
- [x] 02-02: Enforce role-aware access on protected internal surfaces

### Phase 3: Internal User Administration
**Goal**: Admin users can manage internal users and assign roles without direct database intervention.
**Depends on**: Phase 2
**Requirements**: PLAT-03
**Success Criteria** (what must be TRUE):
  1. Admin can create, update, deactivate, and role-assign internal users.
  2. Staff users cannot perform admin-only user lifecycle actions.
**Plans**: TBD

Plans:
- [x] 03-01: Build admin user management workflow
- [x] 03-02: Validate user lifecycle and role assignment safeguards

### Phase 4: Brand & Category Management
**Goal**: Staff can manage the brand and category taxonomies used by catalog and storefront discovery.
**Depends on**: Phase 3
**Requirements**: CAT-01, CAT-02
**Success Criteria** (what must be TRUE):
  1. Staff can create, edit, publish, and unpublish brands with name, slug, and logo.
  2. Staff can create, edit, publish, and unpublish product categories.
**Plans**: TBD

Plans:
- [x] 04-01: Model brand and category entities with publish controls
- [x] 04-02: Build internal taxonomy management workflows
**UI hint**: yes

### Phase 5: Showroom Directory Setup
**Goal**: Staff can maintain showroom records that downstream inventory and operations rely on.
**Depends on**: Phase 3
**Requirements**: CAT-03
**Success Criteria** (what must be TRUE):
  1. Staff can create and edit showroom records with name, address, and phone.
  2. Showroom records are available for inventory and service linking.
**Plans**: TBD

Plans:
- [x] 05-01: Model showroom records and operational references
- [x] 05-02: Build showroom management workflow for staff
**UI hint**: yes

### Phase 6: Product Core Records
**Goal**: Staff can create the canonical product records that all commerce surfaces depend on.
**Depends on**: Phase 4, Phase 5
**Requirements**: CAT-04
**Success Criteria** (what must be TRUE):
  1. Staff can create and edit products with name, slug, brand, category, description, status, and image gallery.
  2. Product records are publishable and ready to feed storefront read models.
**Plans**: TBD

Plans:
- [x] 06-01: Define product core schema and media handling boundaries
- [x] 06-02: Build staff product CRUD workflow
**UI hint**: yes

### Phase 7: Product Specification Modeling
**Goal**: Products carry structured technical specifications suitable for storefront display and comparison.
**Depends on**: Phase 6
**Requirements**: CAT-05
**Success Criteria** (what must be TRUE):
  1. Staff can assign structured technical specifications to each product.
  2. Specification data is stored in a form reusable by storefront and comparison views.
**Plans**: TBD

Plans:
- [x] 07-01: Define structured specification schema and validation rules
- [x] 07-02: Add specification editing to product management
**UI hint**: yes

### Phase 8: Pricing & Merchandising Controls
**Goal**: Staff can maintain pricing and merchandising signals that power discovery and conversion.
**Depends on**: Phase 6, Phase 7
**Requirements**: CAT-06, CAT-07
**Success Criteria** (what must be TRUE):
  1. Staff can set product selling price and optional compare price.
  2. Staff can mark products as featured, new, or recommended.
**Plans**: `.planning/phases/08-pricing-merchandising-controls/08-01-PLAN.md`, `08-02-PLAN.md`

Plans:
- [x] 08-01: Add pricing controls and validation to product workflows
- [x] 08-02: Add merchandising flags for storefront placements
**UI hint**: yes

### Phase 9: Article Category Management
**Goal**: Staff can manage article taxonomies for editorial organization.
**Depends on**: Phase 3
**Requirements**: CMS-02
**Success Criteria** (what must be TRUE):
  1. Staff can create and manage article categories.
  2. Editorial categories are available for article organization and storefront content grouping.
**Plans**: `.planning/phases/09-article-category-management/09-01-PLAN.md`, `09-02-PLAN.md`

Plans:
- [x] 09-01: Model article categories and editorial taxonomy boundaries
- [x] 09-02: Build article category management workflow
**UI hint**: yes

### Phase 10: Article Authoring & Publishing
**Goal**: Staff and admin can create and publish editorial content with the metadata needed by storefront surfaces.
**Depends on**: Phase 9
**Requirements**: CMS-01, CMS-03
**Success Criteria** (what must be TRUE):
  1. Staff and admin can create, edit, draft, and publish articles.
  2. Articles support slug, excerpt, cover image, author, publish status, and publish timestamp.
**Plans**: `.planning/phases/10-article-authoring-publishing/10-01-PLAN.md`, `10-02-PLAN.md`

Plans:
- [x] 10-01: Configure article content model and publishing workflow
- [x] 10-02: Implement article authoring and metadata management surfaces
**UI hint**: yes

### Phase 11: Policy Pages & AI-Ready Content Model
**Goal**: The storefront can publish trust policy content while keeping editorial models extensible for future AI assistance.
**Depends on**: Phase 10
**Requirements**: CMS-04, CMS-05
**Success Criteria** (what must be TRUE):
  1. The storefront exposes policy pages for delivery, returns, warranty, and contact.
  2. The content model preserves a clean extension point for a future AI-assisted article workflow without requiring it in v1.
**Plans**: TBD

Plans:
- [x] 11-01: Implement policy content types and storefront rendering
- [x] 11-02: Preserve clean editorial extension boundaries for future AI-assisted workflows
**UI hint**: yes

### Phase 12: Storefront Home Merchandising
**Goal**: Customers land on a homepage that showcases the business's core discovery and trust entry points.
**Depends on**: Phase 8, Phase 10, Phase 11
**Requirements**: SHOP-01
**Success Criteria** (what must be TRUE):
  1. Customers can browse a home page with featured brands, featured/new/best-selling products, article highlights, showroom links, and contact CTAs.
  2. Homepage content pulls from catalog merchandising and published content rather than hardcoded copy.
**Plans**: `.planning/phases/12-storefront-home-merchandising/12-01-PLAN.md`, `12-02-PLAN.md`

Plans:
- [x] 12-01: Define homepage data slots and merchandising inputs
- [x] 12-02: Build desktop-first storefront homepage experience
**UI hint**: yes

### Phase 13: Category Listings & Faceted Filtering
**Goal**: Customers can browse category listing pages and narrow choices using business-relevant filters.
**Depends on**: Phase 8
**Requirements**: SHOP-02
**Success Criteria** (what must be TRUE):
  1. Customers can browse category listing pages.
  2. Customers can filter by brand, price range, connection type, form factor, and key features.
**Plans**: `.planning/phases/13-category-listings-faceted-filtering/13-01-PLAN.md`, `13-02-PLAN.md`

Plans:
- [x] 13-01: Build category listing read model and faceted filter logic
- [x] 13-02: Implement desktop-first listing and filter interface
**UI hint**: yes

### Phase 14: Listing Sorting & Product Search
**Goal**: Customers can quickly refine category exploration by sort mode or keyword search.
**Depends on**: Phase 13
**Requirements**: SHOP-03, SHOP-04
**Success Criteria** (what must be TRUE):
  1. Customers can sort listings by price, newest, and featured.
  2. Customers can search products by keyword.
**Plans**: `.planning/phases/14-listing-sorting-product-search/14-01-PLAN.md`, `14-02-PLAN.md`

Plans:
- [x] 14-01: Add listing sort behaviors aligned with catalog data
- [x] 14-02: Implement product keyword search and result handling
**UI hint**: yes

### Phase 15: Showroom Inventory Ledger
**Goal**: Inventory quantity is tracked per product per showroom as the base operational stock model.
**Depends on**: Phase 5, Phase 6
**Requirements**: INV-01
**Success Criteria** (what must be TRUE):
  1. Staff can record inventory quantity per product per showroom.
  2. Inventory records are available for later availability and order workflows.
**Plans**: `.planning/phases/15-showroom-inventory-ledger/15-01-PLAN.md`, `15-02-PLAN.md`

Plans:
- [x] 15-01: Model showroom inventory ledger and baseline constraints
- [x] 15-02: Build staff workflow to record per-showroom stock

### Phase 16: Inventory Adjustment Audit Trail
**Goal**: Inventory updates are traceable through a visible adjustment history.
**Depends on**: Phase 15
**Requirements**: INV-02
**Success Criteria** (what must be TRUE):
  1. Staff can update showroom inventory with an auditable adjustment history.
  2. Inventory change history can be reviewed for operational accountability.
**Plans**: `.planning/phases/16-inventory-adjustment-audit/16-01-PLAN.md`, `16-02-PLAN.md`

Plans:
- [x] 16-01: Design inventory adjustment event model
- [x] 16-02: Expose inventory history in staff workflows

### Phase 17: Availability Rules & Storefront Stock Messaging
**Goal**: Customer-facing stock messaging reflects showroom-aware inventory logic instead of a single quantity field.
**Depends on**: Phase 16
**Requirements**: INV-03
**Success Criteria** (what must be TRUE):
  1. Storefront stock messaging derives from showroom inventory rules rather than a single global quantity.
  2. Availability messaging remains storefront-safe and operationally consistent.
**Plans**: `.planning/phases/17-availability-rules-storefront-stock-messaging/17-01-PLAN.md`, `17-02-PLAN.md`

Plans:
- [x] 17-01: Define showroom-aware availability rules and storefront-safe messages
- [x] 17-02: Implement availability derivation for storefront read models

### Phase 18: Inventory Visibility in Order Operations
**Goal**: Staff can inspect showroom inventory context while reviewing or processing orders.
**Depends on**: Phase 17
**Requirements**: INV-04
**Success Criteria** (what must be TRUE):
  1. Staff can view showroom inventory details while confirming or processing orders.
  2. Inventory context is available in the operational order workspace, not only in catalog tools.
**Plans**: `.planning/phases/18-inventory-visibility-in-order-operations/18-01-PLAN.md`, `18-02-PLAN.md`

Plans:
- [x] 18-01: Define inventory views needed by order operations
- [x] 18-02: Integrate showroom stock context into internal order workflows

### Phase 19: Product Detail Experience
**Goal**: Customers can evaluate an individual product through a rich detail page.
**Depends on**: Phase 8, Phase 17
**Requirements**: SHOP-05
**Success Criteria** (what must be TRUE):
  1. Product detail pages show name, price, images, description, structured specs, related products, and stock status.
  2. PDP content is grounded in the catalog and inventory source of truth.
**Plans**: `.planning/phases/19-product-detail-experience/` (19-01, 19-02)

Plans:
- [x] 19-01: Build product detail read model from catalog and inventory data
- [x] 19-02: Implement desktop-first PDP layout and related product module
**UI hint**: yes

### Phase 20: Showroom Availability on PDP
**Goal**: Product detail pages communicate showroom availability using customer-safe wording.
**Depends on**: Phase 19
**Requirements**: SHOP-06
**Success Criteria** (what must be TRUE):
  1. PDPs show showroom availability using storefront-safe availability messaging.
  2. Availability presentation remains consistent with the inventory rules defined for storefront.
**Plans**: `.planning/phases/20-showroom-availability-on-pdp/` (20-01, 20-02)

Plans:
- [ ] 20-01: Add showroom availability module to PDP
- [ ] 20-02: Validate customer-safe availability communication
**UI hint**: yes

### Phase 21: Product Comparison Flow
**Goal**: Customers can compare two products side by side by their structured specifications.
**Depends on**: Phase 19
**Requirements**: SHOP-07
**Success Criteria** (what must be TRUE):
  1. Customers can compare up to two products side by side.
  2. Comparison uses structured specifications clearly enough to support buying decisions.
**Plans**: `.planning/phases/21-product-comparison-flow/` (21-01, 21-02)

Plans:
- [ ] 21-01: Build comparison data model from structured specs
- [ ] 21-02: Implement side-by-side comparison experience for two products
**UI hint**: yes

### Phase 22: Cart Management
**Goal**: Customers can assemble and maintain a cart before order submission.
**Depends on**: Phase 19
**Requirements**: ORD-01
**Success Criteria** (what must be TRUE):
  1. Customers can add products to cart.
  2. Customers can update quantities and remove items.
**Plans**: `.planning/phases/22-cart-management/` (22-01, 22-02)

Plans:
- [ ] 22-01: Implement cart state and line-item lifecycle
- [ ] 22-02: Build cart UI for quantity updates and removals
**UI hint**: yes

### Phase 23: Checkout Contact Capture
**Goal**: Customers can submit a short-form checkout with the required contact information.
**Depends on**: Phase 22
**Requirements**: ORD-02
**Success Criteria** (what must be TRUE):
  1. Customers can submit checkout with a short form.
  2. Phone number is required before order submission.
**Plans**: `.planning/phases/23-checkout-contact-capture/` (23-01, 23-02)

Plans:
- [ ] 23-01: Define minimal checkout submission payload and validation
- [ ] 23-02: Build short-form checkout flow with required phone capture
**UI hint**: yes

### Phase 24: Quick Buy Submission
**Goal**: Customers can submit an order directly from product detail with minimal friction.
**Depends on**: Phase 23
**Requirements**: ORD-03
**Success Criteria** (what must be TRUE):
  1. Customers can use a quick-buy flow from product detail.
  2. Quick buy captures the minimum information required for staff follow-up.
**Plans**: `.planning/phases/24-quick-buy-submission/` (24-01, 24-02)

Plans:
- [ ] 24-01: Define quick-buy submission path and reuse boundaries
- [ ] 24-02: Implement reduced-friction quick-buy UX on PDP
**UI hint**: yes

### Phase 25: Checkout Payment Method Selection
**Goal**: Checkout supports COD selection as a first-class Vietnam-fit payment method.
**Depends on**: Phase 23
**Requirements**: ORD-04
**Success Criteria** (what must be TRUE):
  1. Customers can choose COD during checkout.
  2. COD selection is stored correctly for downstream order operations.
**Plans**: `.planning/phases/25-checkout-payment-method-selection/` (25-01, 25-02)

Plans:
- [ ] 25-01: Add payment method selection to checkout data model
- [ ] 25-02: Implement COD path in checkout UI and order creation
**UI hint**: yes

### Phase 26: Dynamic QR Banking Instructions
**Goal**: Customers can choose QR banking and receive order-specific payment instructions.
**Depends on**: Phase 25
**Requirements**: ORD-05
**Success Criteria** (what must be TRUE):
  1. Customers can choose dynamic QR banking payment during checkout.
  2. Each QR order receives order-specific QR payment instruction.
**Plans**: `.planning/phases/26-dynamic-qr-banking-instructions/` (26-01, 26-02)

Plans:
- [ ] 26-01: Define QR payment instruction generation and storage
- [ ] 26-02: Implement order-specific QR payment experience
**UI hint**: yes

### Phase 27: High-Value COD Deposit Rules
**Goal**: High-value COD orders apply and disclose the required deposit before submission.
**Depends on**: Phase 25
**Requirements**: ORD-06
**Success Criteria** (what must be TRUE):
  1. The system can require a deposit for high-value COD orders.
  2. The required deposit amount is shown before order submission.
**Plans**: `.planning/phases/27-high-value-cod-deposit-rules/` (27-01, 27-02)

Plans:
- [ ] 27-01: Model high-value COD deposit rule inputs and thresholds
- [ ] 27-02: Expose deposit-required behavior in checkout and order capture
**UI hint**: yes

### Phase 28: Order State Modeling
**Goal**: Orders persist distinct business states for order progress, payment, and verification.
**Depends on**: Phase 25, Phase 26, Phase 27
**Requirements**: ORD-07
**Success Criteria** (what must be TRUE):
  1. Each order stores separate order status, payment status, and verification status.
  2. State separation supports COD, QR, and deposit-required flows without ambiguity.
**Plans**: `.planning/phases/28-order-state-modeling/` (28-01, 28-02)

Plans:
- [ ] 28-01: Define order, payment, and verification state model
- [ ] 28-02: Integrate separated states into order persistence and views

### Phase 29: Verification Intake Queue
**Goal**: New storefront orders enter an explicit staff verification workflow before fulfillment.
**Depends on**: Phase 28
**Requirements**: ORD-08
**Success Criteria** (what must be TRUE):
  1. New storefront orders enter a staff-verification workflow before fulfillment processing.
  2. Verification-needed orders are clearly distinguishable from later operational states.
**Plans**: `.planning/phases/29-verification-intake-queue/` (29-01, 29-02)

Plans:
- [ ] 29-01: Define verification intake workflow and queue criteria
- [ ] 29-02: Route new orders into verification-first operational handling

### Phase 30: Order Assignment & Processing Actions
**Goal**: Staff can own and progress orders once they enter operational handling.
**Depends on**: Phase 29, Phase 18
**Requirements**: ORD-09
**Success Criteria** (what must be TRUE):
  1. Staff can assign themselves or another staff member to an order.
  2. Staff can update operational order statuses during processing.
**Plans**: `.planning/phases/30-order-assignment-processing-actions/` (30-01, 30-02)

Plans:
- [ ] 30-01: Build order ownership assignment workflow
- [ ] 30-02: Add operational status actions for staff processing
**UI hint**: yes

### Phase 31: Customer Records Workspace
**Goal**: Staff can manage reusable customer records that connect orders and service workflows.
**Depends on**: Phase 30
**Requirements**: CRM-01
**Success Criteria** (what must be TRUE):
  1. Staff can create and update customer records with name, phone, email, address, and notes.
  2. Customer records can be referenced by downstream CRM and warranty workflows.
**Plans**: `.planning/phases/31-customer-records-workspace/` (31-01, 31-02)

Plans:
- [ ] 31-01: Define customer master record shape and linkage rules
- [ ] 31-02: Build customer record management workflow
**UI hint**: yes

### Phase 32: Lead Capture & Management
**Goal**: Staff can manage sales leads linked to customer records.
**Depends on**: Phase 31
**Requirements**: CRM-02
**Success Criteria** (what must be TRUE):
  1. Staff can create and manage leads linked to a customer.
  2. `chat` is supported as a lead source.
**Plans**: `.planning/phases/32-lead-capture-management/` (32-01, 32-02)

Plans:
- [ ] 32-01: Model lead records and supported source taxonomy
- [ ] 32-02: Build lead management workflow linked to customers
**UI hint**: yes

### Phase 33: Support Ticket Handling
**Goal**: Staff can manage customer support tickets in the internal system.
**Depends on**: Phase 31
**Requirements**: CRM-03
**Success Criteria** (what must be TRUE):
  1. Staff can create and manage support tickets linked to a customer.
  2. Tickets are available for service workflow tracking.
**Plans**: `.planning/phases/33-support-ticket-handling/` (33-01, 33-02)

Plans:
- [ ] 33-01: Define support ticket model and customer linkage
- [ ] 33-02: Build ticket management workflow for staff
**UI hint**: yes

### Phase 34: Warranty Case Creation
**Goal**: Staff can open serial-based warranty cases tied to the real operational entities involved.
**Depends on**: Phase 31, Phase 5, Phase 6
**Requirements**: CRM-04
**Success Criteria** (what must be TRUE):
  1. Staff can create and manage warranty cases linked to customer, product, showroom, and serial number.
  2. Warranty cases are structured for later ownership and timeline tracking.
**Plans**: TBD

Plans:
- [ ] 34-01: Define warranty case model with serial and entity links
- [ ] 34-02: Build warranty case intake workflow
**UI hint**: yes

### Phase 35: Service Ownership & Warranty History
**Goal**: Service records support ownership, status tracking, and visible warranty handling history.
**Depends on**: Phase 32, Phase 33, Phase 34
**Requirements**: CRM-05, CRM-06
**Success Criteria** (what must be TRUE):
  1. Leads, tickets, and warranty cases support status tracking and staff ownership.
  2. Warranty cases maintain a visible handling history or timeline of updates.
**Plans**: `.planning/phases/35-service-ownership-warranty-history/` (35-01, 35-02)

Plans:
- [ ] 35-01: Add ownership and status workflows across service records
- [ ] 35-02: Implement warranty timeline and visible handling history
**UI hint**: yes

### Phase 36: Operations Dashboard & Work Queues
**Goal**: Internal users can monitor launch-critical work through a basic dashboard and explicit queues.
**Depends on**: Phase 30, Phase 35, Phase 12
**Requirements**: OPS-01, OPS-02
**Success Criteria** (what must be TRUE):
  1. Internal users can access a basic dashboard showing operational summary information for catalog, orders, CRM, or content.
  2. Staff can work from explicit queues or filtered views for pending verification orders and active service records.
**Plans**: `.planning/phases/36-operations-dashboard-work-queues/` (36-01, 36-02)

Plans:
- [ ] 36-01: Define dashboard summary metrics and queue criteria
- [ ] 36-02: Build dashboard widgets and actionable filtered views
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → ... → 36. Decimal insertion phases, if any, execute between their surrounding integers.

|| Phase | Plans Complete | Status | Completed |
||-------|----------------|--------|-----------|
|| 1. Internal Authentication Entry | 0/2 | Not started | - |
|| 2. Internal Roles & Permission Boundaries | 2/2 | Complete | 2026-04-16 |
|| 3. Internal User Administration | 0/2 | Not started | - |
|| 4. Brand & Category Management | 2/2 | Complete | 2026-04-16 |
|| 5. Showroom Directory Setup | 0/2 | Not started | - |
|| 6. Product Core Records | 0/2 | Not started | - |
|| 7. Product Specification Modeling | 0/2 | Not started | - |
|| 8. Pricing & Merchandising Controls | 0/2 | Not started | - |
|| 9. Article Category Management | 0/2 | Not started | - |
|| 10. Article Authoring & Publishing | 0/2 | Not started | - |
|| 11. Policy Pages & AI-Ready Content Model | 0/2 | Not started | - |
|| 12. Storefront Home Merchandising | 0/2 | Not started | - |
|| 13. Category Listings & Faceted Filtering | 0/2 | Not started | - |
|| 14. Listing Sorting & Product Search | 2/2 | Complete | 2026-04-18 |
|| 15. Showroom Inventory Ledger | 2/2 | Complete | 2026-04-18 |
|| 16. Inventory Adjustment Audit Trail | 2/2 | Planned | - |
|| 17. Availability Rules & Storefront Stock Messaging | 0/2 | Not started | - |
|| 18. Inventory Visibility in Order Operations | 0/2 | Not started | - |
|| 19. Product Detail Experience | 2/2 | Complete | 2026-04-18 |
|| 20. Showroom Availability on PDP | 2/2 | Planned | 2026-04-18 |
|| 21. Product Comparison Flow | 2/2 | Planned | 2026-04-18 |
|| 22. Cart Management | 2/2 | Planned | 2026-04-18 |
|| 23. Checkout Contact Capture | 2/2 | Planned | 2026-04-18 |
|| 24. Quick Buy Submission | 2/2 | Planned | 2026-04-18 |
|| 25. Checkout Payment Method Selection | 2/2 | Planned | 2026-04-18 |
|| 26. Dynamic QR Banking Instructions | 2/2 | Planned | 2026-04-18 |
|| 27. High-Value COD Deposit Rules | 2/2 | Planned | 2026-04-18 |
|| 28. Order State Modeling | 2/2 | Planned | 2026-04-18 |
|| 29. Verification Intake Queue | 2/2 | Planned | 2026-04-18 |
|| 30. Order Assignment & Processing Actions | 2/2 | Planned | 2026-04-18 |
|| 31. Customer Records Workspace | 2/2 | Planned | 2026-04-18 |
|| 32. Lead Capture & Management | 2/2 | Planned | 2026-04-18 |
|| 33. Support Ticket Handling | 2/2 | Planned | 2026-04-18 |
|| 34. Warranty Case Creation | 2/2 | Planned | 2026-04-18 |
|| 35. Service Ownership & Warranty History | 2/2 | Planned | 2026-04-18 |
|| 36. Operations Dashboard & Work Queues | 2/2 | Planned | 2026-04-18 |
