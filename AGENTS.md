# AGENTS.md

## 1. Core Principles

- `docs/` is the source of truth for product behavior, flows, and contracts.
- `app/` is the implementation and must always match `docs/`.
- Never update code without checking relevant docs first.
- Never change behavior without updating docs.

---

## 2. Required Workflow (MANDATORY)

When given any task:

### Step 1 — Understand
- Read all relevant files in `docs/`
- Summarize your understanding before making changes

### Step 2 — Plan
- Propose a short plan (max 5 steps)
- List files to update in both `docs/` and `app/`

### Step 3 — Update Design First
- If behavior / API / UI changes:
  - update files in `docs/` first

### Step 4 — Implement
- Update code in `app/`
- Follow existing patterns in the codebase

### Step 5 — Validate Consistency
- Ensure `docs/` and `app/` are consistent
- If mismatch exists, fix or report

---

## 3. Documentation Rules

### docs/product-spec.md
- Describe user flows and expected behavior
- Include edge cases

### docs/architecture.md
- Describe system structure and major decisions
- Keep it high-level but precise

### docs/api-contract.md
- Define request/response formats
- Include error cases

### docs/ui-states.md
- Define all UI states:
  - loading
  - empty
  - error
  - success
  - validation

### docs/changelog.md
- Record:
  - what changed
  - why it changed
  - impacted areas

---

## 4. Code Rules

- Follow existing structure and naming
- Do not introduce new patterns without explanation
- Keep logic separated (UI / business / API)
- Prefer small, focused changes

---

## 5. Output Format (REQUIRED)

Always respond with:

### Summary
- What was changed

### Files Changed
- List all modified files

### Design Changes
- What changed in `docs/`

### Code Changes
- What changed in `app/`

### Consistency Check
- Confirm docs and code are aligned
- List mismatches if any

### Open Questions / Risks
- Any assumptions or unclear areas

---

## 6. Forbidden

- ❌ Do NOT change code without reading docs
- ❌ Do NOT update only code when behavior changes
- ❌ Do NOT invent requirements not in docs (unless stated)
- ❌ Do NOT silently make assumptions

---

## 7. Priority Order

1. Correctness vs docs
2. Simplicity
3. Consistency
4. Performance (only when needed)

## NOTES

If instructions from user conflict with this file, ask for clarification before proceeding.
