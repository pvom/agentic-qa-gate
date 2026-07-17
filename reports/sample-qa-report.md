# QA verdict · feat/financial-export · 2026-05-14

**PR:** `feat/financial-export` · commits `a1b2c3…d4e5f6`
**Verdict:** ✅ APPROVE

### Automated tests
- Vitest: 15/15 pass
- Playwright e2e: 130/130 pass · 0 new failures · 2 known-skipped
- tsc: 0 errors

### Design-system compliance
- Static audit: PASS · 0 violations
- Runtime color audit: 0 foreign colors across Dashboard / Financial / Settings
- Storybook side-by-side (Button, Card): no drift

### Visual audit (mobile-first)
- 3 viewports × 3 pages · no unintended diff vs baseline

### Manual golden path
- Login ✅ · Dashboard ✅ · Create shift ✅ · Mark done ✅ · Financial total ✅ · Logout ✅

### Recommendation
APPROVE → Ops may deploy.

---

# QA verdict · feat/new-card-style · 2026-05-16

**Verdict:** ❌ REJECT

### Design-system compliance
- Runtime color audit: **2 foreign colors** on Financial
  - `#7c3aed  background-color  div.card` (not in palette)
  - `#ef4444  color  span.badge` (not in palette)
- New violation vs previous HEAD → automatic reject.

### Recommendation
Back to Coder: replace hardcoded values with `--surface` / accent token from the design system.
