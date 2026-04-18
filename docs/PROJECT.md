# XuanVuAudio / tainghe.com.vn Rebuild

## What This Is

A greenfield rebuild of `tainghe.com.vn` into a desktop-first ecommerce web app for Vietnam focused on multi-brand headphones and audio gear. The v1 product combines a customer storefront with the operational tools needed to run the business: catalog and showroom inventory management, order/payment handling, basic CRM, and a lightweight CMS for trust-building content.

## Core Value

Customers can confidently discover and buy the right audio product, while staff can reliably operate catalog, inventory, orders, and after-sales workflows in one coherent system.

## Requirements

### Validated

(None yet — new project, nothing shipped or validated)

### Active

- [ ] Launch a desktop-first storefront for discovery, comparison, cart, and checkout of multi-brand headphone/audio products.
- [ ] Support Vietnam-fit purchase flows including COD, dynamic QR banking, and deposit-required COD for high-value orders.
- [ ] Give staff/admin operational control over products, brands, categories, specs, pricing, showroom inventory, orders, CRM records, and content.
- [ ] Track showroom-aware inventory, manual order verification, and serial-based warranty handling as first-class workflows.
- [ ] Publish policy and article content that improves trust, SEO, and buying confidence.

### Out of Scope

- Native mobile app — v1 is explicitly web-only and desktop-first.
- Deep mobile-first optimization — responsive support is needed, but dense desktop UX takes priority for MVP.
- Loyalty, points, or membership programs — not core to proving commerce and operations value in v1.
- Marketing automation — deferred until core CRM and CMS workflows are stable.
- Deep Facebook, Zalo, or marketplace integrations — operational complexity is too high for initial launch.
- AI shopping assistant/chatbot — not required to validate the buying journey.
- Fully automated AI article generation — future extension only; v1 needs AI-ready structure, not automation.
- Advanced analytics/BI dashboards — initial dashboard should focus on operational visibility, not deep reporting.
- Consumer customer-account system with rich self-service history — lightweight guest-style ordering and CRM capture are sufficient for v1.

## Context

- This is a greenfield rebuild of the existing `tainghe.com.vn` business, not an incremental redesign.
- Target market is Vietnam only.
- The catalog is multi-brand and spec-heavy; technical specifications are part of the product experience, not secondary content.
- Showroom inventory matters because customers may visit, test, or buy based on local availability.
- The operating model includes manual post-checkout phone verification as a standard workflow.
- Warranty/service handling is important enough to require serial-number-based cases and history logging in v1.
- Editorial content is part of conversion and SEO, not a side module.
- Current planning research points toward a modular-monolith architecture with `Next.js` for the app shell, `Supabase` for transactional data/auth, and `Payload CMS` for editorial content.
- Workflow settings already selected for this project: `mode=yolo`, `granularity=fine`, `parallelization=true`, `commit_docs=false`, `research=true`, `plan_check=true`, `verifier=true`, `model_profile=inherit`, `nyquist_validation=true`.

## Constraints

- **Market**: Vietnam-only launch — payment, language, and operations must fit local retail expectations.
- **Experience**: Desktop-first MVP — prioritizes dense catalog/admin usability over deep mobile polish.
- **Commerce Workflow**: COD, dynamic QR banking, and conditional deposit flow must coexist — these are core business requirements, not optional add-ons.
- **Operations**: Manual order verification by staff is mandatory — fulfillment cannot assume fully automated checkout acceptance.
- **Inventory**: Stock is showroom-scoped — the system cannot treat inventory as a single global quantity.
- **Warranty**: Serial-based warranty history is required — support data must be structured enough for later verification and audits.
- **Architecture**: Transactional commerce data should remain separate from editorial CMS concerns — avoids data drift and weak operational control.
- **Planning Process**: Planning docs stay local-only — `commit_docs=false`, so no documentation commits should be created in this stage.
- **Roadmap Shape**: Requirements should decompose cleanly into a fine-grained roadmap of small, dependency-aware phases — requirements must stay atomic and phaseable.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build as a greenfield rebuild rather than retrofit the old site | Existing objective is a modernized platform and cleaner operating model, not patching legacy behavior | — Pending |
| Prioritize desktop-first UX for v1 | Both dense storefront comparison and staff operations benefit more from desktop-first layouts in the MVP | — Pending |
| Treat storefront + operations as one product scope | The business value depends on both customer conversion and internal execution quality | — Pending |
| Separate transactional data from editorial content ownership | Orders, payments, inventory, CRM, and warranty workflows need stronger control than a CMS-first model provides | — Pending |
| Make showroom inventory a first-class domain concept | Availability by showroom affects merchandising, verification, and fulfillment correctness | — Pending |
| Model payment status, verification status, and order status separately | COD deposit and QR banking flows become ambiguous if collapsed into one order state | — Pending |
| Keep permissions pragmatic in v1 with admin and staff roles | Broad staff access speeds MVP delivery, but the model must remain extensible for tighter controls later | — Pending |
| Keep AI content workflows out of v1 while preserving extension points | The PRD wants future AI-assisted publishing without delaying the initial launch | — Pending |

## Evolution

This document is a living project context record and should evolve with the roadmap and delivery work.

### After each phase transition

1. Move shipped and verified requirements from **Active** to **Validated** with a phase reference.
2. Move descoped or disproven requirements to **Out of Scope** with explicit reasoning.
3. Add newly discovered requirements only when they materially affect roadmap scope.
4. Record new architecture, product, or operations decisions in **Key Decisions**.
5. Re-check whether **What This Is** still accurately describes the current product.

### After each milestone

1. Review all sections for drift against the latest shipped reality.
2. Confirm the **Core Value** still reflects the right tradeoff rule.
3. Audit **Out of Scope** items to ensure the exclusions are still intentional.
4. Update **Context** with meaningful new operational, user, or technical learnings.

---
*Last updated: 2026-04-14 after initial GSD project setup*