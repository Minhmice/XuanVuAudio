# CLAUDE.md

## Project context

- Project: rebuild `tainghe.com.vn` as a desktop-first ecommerce web app for Vietnam focused on multi-brand headphones and audio gear.
- v1 combines storefront buying flows with internal operations for catalog, showroom inventory, orders, CRM, warranty, and editorial content.
- Current delivery direction from planning research: modular monolith with `Next.js` for app surfaces, `Supabase` for transactional/auth data, and `Payload CMS` for editorial content.

## Working guidance for future sessions

Read these first before planning or implementation:
1. `.planning/PROJECT.md` — current product context, constraints, and key decisions.
2. `.planning/REQUIREMENTS.md` — atomic scoped requirements and phase mapping.
3. `.planning/ROADMAP.md` — roadmap and current phase order.
4. `.planning/STATE.md` — current session position and short-term memory.

Then use `PRD.md` when deeper original product detail is needed.

## Important reminders

- `.planning/` is local-only project memory and should not be committed from this workspace.
- `commit_docs=false`; keep planning docs updated locally, but do not prepare doc commits unless the workflow changes.
- Keep storefront and internal operations aligned: money, stock, verification, and warranty workflows should be modeled explicitly.
- Keep transactional commerce workflows separate from editorial CMS ownership.

## Current status

- Initial project artifacts are in place.
- The project is ready for Phase 1 planning.
- `.planning/ROADMAP.md` exists and is the source of truth for current phase order, naming, and planning sequence.
