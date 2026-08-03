# UI RULES — Next.js + Tailwind (AI Instructions)

This document defines **strict UI rules** that must be followed when generating or modifying frontend code in this repository.

Target outcome:
**Professional, human-designed UI**
Not flashy. Not trendy. Not “AI-looking”.

---

## 0. Stack Assumptions

- Framework: **Next.js**
- Styling: **Tailwind CSS**
- Components: Local components only (no UI kits unless explicitly stated)

Do not introduce other styling systems.

---

## 1. Absolute Design Bans (Non-Negotiable)

❌ NO gradients  
❌ NO rainbow color palettes  
❌ NO purple (any shade)  
❌ NO neon or glowing effects  
❌ NO glassmorphism  
❌ NO over-animated UI  
❌ NO “marketing landing page” visuals

If unsure → use **neutral, calm, editorial UI**.

---

## 2. Core UI Philosophy

- Calm
- Structured
- Predictable
- Minimal but not empty
- Purpose-driven

This UI should feel:

- **Serious**
- **Trustworthy**
- **Built by an experienced engineer**

---

## 3. Layout Rules (Tailwind-Specific)

- Use `flex`, `grid`, or `container`
- Max content width: `max-w-7xl`
- Center primary content horizontally
- Avoid edge-to-edge text layouts

Spacing rules:

- Use Tailwind spacing scale only
- Prefer vertical rhythm (`space-y-*`)
- No arbitrary pixel spacing unless unavoidable

❌ No random `mt-[37px]`  
❌ No inconsistent padding

---

## 4. Typography Rules

- Max **2 font families**
- Prefer system or neutral fonts
- Font hierarchy must be clear:
  - Page title
  - Section header
  - Body text
  - Meta / helper text

Rules:

- Body text: `leading-relaxed` or `leading-7`
- Avoid long line lengths
- No decorative fonts

---

## 5. Color System (VERY IMPORTANT)

### 5.1 Do NOT Use Raw Colors

❌ `text-red-500`
❌ `bg-blue-600`
❌ `#ff0000`
❌ Pure black / pure white

---

### 5.2 Required: Semantic Color Tokens

Colors must be **semantic**, not literal.

Example approach:

- `bg-surface`
- `bg-muted`
- `text-primary`
- `text-secondary`
- `border-subtle`
- `bg-accent`
- `text-danger`

These should map internally to Tailwind colors.

---

### 5.3 Color Selection Rules

- Base UI: neutral (gray / stone / slate)
- Accent color:
  - Muted
  - Low saturation
  - Used sparingly
- Destructive color:
  - Subtle red tone
  - Never bright

Colors must:

- Relate to each other
- Feel part of one system
- Avoid “default Tailwind look”

---

## 6. Buttons & Actions

Buttons must:

- Have clear hierarchy
- Look clickable without being loud
- Respect spacing and alignment

Button levels:

1. Primary (1 per view max)
2. Secondary
3. Tertiary / ghost

Rules:

- No icon-only buttons without tooltip
- Disabled state must look disabled
- Loading state must be visible

---

## 7. Forms & Inputs

Every input must have:

- Label
- Clear focus state
- Error message (human-readable)

Rules:

- Inputs must align vertically
- Errors must not shift layout aggressively
- Do not rely on placeholder as label

---

## 8. Cards & Containers

Use cards ONLY when:

- Grouping related content
- Creating visual separation

Rules:

- No card-inside-card nesting
- Soft borders preferred over heavy shadows
- Shadows must be subtle

---

## 9. State Handling (Mandatory)

Every interactive view must define:

- Loading state
- Empty state
- Error state

Never leave blank screens.

---

## 10. Accessibility

Mandatory:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Adequate contrast

❌ No `div` buttons  
❌ No removing outlines without replacement

---

## 11. Animation & Motion

Rules:

- Motion must serve clarity
- Duration: `150–250ms`
- Use easing
- Transitions only for state changes

❌ No infinite animations  
❌ No attention-seeking motion

---

## 12. Responsive Design

- Mobile-first
- Touch targets ≥ 44px
- No hover-only interactions
- Layout must reflow, not shrink

---

## 13. AI-Generated UI Anti-Patterns (AVOID THESE)

The following issues are **common AI UI mistakes** and must be avoided:

### ❌ Over-Polished Syndrome

UI looks too shiny, too perfect, too fake.

### ❌ Default Tailwind Look

Looks like a Tailwind docs example.

### ❌ Color Spam

Too many accent colors without hierarchy.

### ❌ Hero Obsession

Unnecessary large hero sections everywhere.

### ❌ Symmetry Addiction

Everything centered even when it shouldn’t be.

### ❌ Component Overuse

Too many cards, pills, badges, dividers.

### ❌ Fake Minimalism

Large empty spaces without structure.

---

## 14. How to Make the UI Feel Professional & Unique

- Use restraint
- Use fewer components, better composed
- Prefer alignment over decoration
- Let spacing do the work
- Use subtle borders instead of color
- Use tone variation, not color variation

Uniqueness comes from:

- Consistency
- Proportion
- Thoughtful defaults

Not from effects.

---

## 15. AI Behavior Rules

When generating UI:

- Prefer conservative solutions
- Follow existing patterns
- Do not redesign unless instructed
- Do not introduce new colors casually
- Comment assumptions when necessary

If unsure:
→ choose the most boring, readable option.

---

## 16. Decision Priority Order

1. Usability
2. Readability
3. Accessibility
4. Consistency
5. Visual polish

---

End of rules.
