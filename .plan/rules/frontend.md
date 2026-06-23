# Frontend Rules — MyPartner

**Source:** MyPartner UI Kit (Claude Design export)  
**Last updated:** 2026-06-23

---

## 1. Design Tokens — CSS Variables

All variables live in ONE file: `app/assets/css/globals.css`.  
Never hardcode hex colors in component classes if a CSS variable exists.  
Never define tokens in component `<style>` blocks.

```css
/* app/assets/css/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ─── Brand ─────────────────────────────────────── */
    --color-primary: #0055ff;
    --color-primary-fg: #ffffff;
    --color-primary-subtle: #eef3ff; /* icon bg, info badge bg */
    --color-primary-muted: rgba(0, 85, 255, 0.15); /* accent strip */

    /* ─── Sidebar / Navigation ────────────────────── */
    --color-sidebar-bg: #0d1017;
    --color-sidebar-item-active: #0055ff;
    --color-sidebar-icon-muted: #353b47;
    --color-sidebar-text-muted: #4b5260;
    --color-sidebar-text-active: #ffffff;
    --sidebar-width: 260px;

    /* ─── Page Layout ─────────────────────────────── */
    --color-background: #f7f8fa; /* page/content bg */
    --color-surface: #ffffff; /* card, navbar, modal */
    --color-surface-input: #f1f2f5; /* input, search, select bg */
    --color-hero-dark: #111111; /* hero dark banner */
    --navbar-height: 64px;

    /* ─── Text ────────────────────────────────────── */
    --color-text-primary: #0d1017; /* headings, body text */
    --color-text-secondary: #4b5260; /* labels, captions */
    --color-text-muted: #8b919e; /* placeholders, hints */
    --color-text-disabled: #d3d7df;

    /* ─── Borders & Dividers ──────────────────────── */
    --color-border: #f1f2f5; /* table rows, card borders */
    --color-border-strong: #e5e7ec; /* inputs, stronger dividers */
    --color-skeleton: #e5e7ec; /* skeleton loaders */
    --color-skeleton-dark: #d3d7df; /* table column headers */

    /* ─── Semantic: Success ───────────────────────── */
    --color-success-bg: #e8f8ef;
    --color-success-text: #0f7b3e;
    --color-success: #16a34a;

    /* ─── Semantic: Warning ───────────────────────── */
    --color-warning-bg: #fef4e5;
    --color-warning-text: #b45309;
    --color-warning: #d97706;

    /* ─── Semantic: Error ─────────────────────────── */
    --color-error-bg: #fef2f2;
    --color-error-text: #b91c1c;
    --color-error: #dc2626;

    /* ─── Semantic: Info ──────────────────────────── */
    --color-info-bg: #eef3ff; /* same as primary-subtle */
    --color-info-text: #0055ff;
    --color-info: #0055ff;

    /* ─── Border Radius ───────────────────────────── */
    --radius-xs: 3px; /* small tags, chip labels */
    --radius-sm: 4px; /* badges, compact elements */
    --radius-md: 6px; /* buttons, inputs, nav items */
    --radius-lg: 8px; /* icon containers, small cards */
    --radius-xl: 12px; /* stat cards, table containers */
    --radius-2xl: 14px; /* avatar circles */
    --radius-3xl: 16px; /* hero cards, large modals */
    --radius-full: 9999px; /* pills, circular badges */

    /* ─── Shadows ─────────────────────────────────── */
    --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
    --shadow-modal:
      0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
    --shadow-dropdown:
      0 4px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);

    /* ─── Spacing Scale ───────────────────────────── */
    /* Tailwind default scale is sufficient. Use Tailwind classes. */
    /* Layout-specific values: */
    --content-padding-x: 2rem; /* 32px — inner content horizontal padding */
    --content-padding-y: 1.5rem; /* 24px — inner content vertical padding */
  }

  /* ─── Dark mode: sidebar tokens remap ──────────────
     App uses a light content area with a dark sidebar.
     Full dark mode is NOT in scope for Phase 1.
  ───────────────────────────────────────────────── */

  body {
    background-color: var(--color-background);
    color: var(--color-text-primary);
    font-family:
      "Inter",
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
}
```

---

## 2. Typography

**Font:** Inter (via `@fontsource/inter` — already in deps).  
Register in `nuxt.config.ts`:

```ts
css: [
  '@fontsource/inter/400.css',
  '@fontsource/inter/500.css',
  '@fontsource/inter/600.css',
  '@fontsource/inter/700.css',
  '~/assets/css/globals.css',
],
```

| Role        | Size       | Weight | Usage                      |
| ----------- | ---------- | ------ | -------------------------- |
| Display     | 24px / 1.3 | 700    | Page titles, hero headings |
| Heading 1   | 20px / 1.4 | 600    | Section headings           |
| Heading 2   | 16px / 1.4 | 600    | Card titles, modal titles  |
| Body        | 14px / 1.5 | 400    | All body text (default)    |
| Body Medium | 14px / 1.5 | 500    | Labels, nav items          |
| Small       | 12px / 1.5 | 400    | Captions, meta info        |
| Mono        | 13px / 1.5 | 400    | Codes, vault passwords     |

---

## 3. Layout Structure

```
┌──────────────────────────────────────────────────────┐
│ Sidebar (260px, fixed, #0D1017)                      │
│   Logo mark (top-left, brand blue)                   │
│   Nav items (icon + label)                           │
│   Active item: full-width pill, #0055FF              │
│   Inactive: icon #353B47, text #4B5260               │
├──────────────────────────────────────────────────────┤
│ Navbar (full-width minus sidebar, 64px, #FFFFFF)     │
│   Search bar (right side, #F1F2F5 bg, rx-md)        │
│   Avatar (far right, 32×32, circular, brand blue)   │
├──────────────────────────────────────────────────────┤
│ Content Area (#F7F8FA bg, padding var(--content-*)) │
│   Optional: Hero dark card (#111111, rx-3xl)        │
│   Stat cards (#FFFFFF, rx-xl, shadow-card)          │
│   Tables (#FFFFFF container, rx-xl, shadow-card)    │
│   Forms, modals, etc.                               │
└──────────────────────────────────────────────────────┘
```

The Nuxt layout file: `app/layouts/admin.vue`

- `<aside>` = sidebar, position fixed, `var(--sidebar-width)`
- `<header>` = navbar, position fixed, `var(--navbar-height)`
- `<main>` = content, `margin-left: var(--sidebar-width)`, `padding-top: var(--navbar-height)`

---

## 4. Component Conventions

### Cards

```html
<!-- Stat card -->
<div class="bg-white rounded-xl shadow-card p-6">
  <!-- icon container: 40×40, bg semantic color, rx-lg -->
  <!-- value: text-2xl font-bold -->
  <!-- label: text-sm text-secondary -->
</div>

<!-- Hero dark card -->
<div class="rounded-3xl p-8" style="background: var(--color-hero-dark)">
  <!-- content on dark bg, white text -->
</div>
```

### Badges / Status Chips

```html
<!-- Success -->
<span
  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
  style="background: var(--color-success-bg); color: var(--color-success-text)"
>
  Aktif
</span>
<!-- Warning -->
<span
  style="background: var(--color-warning-bg); color: var(--color-warning-text)"
  >...</span
>
<!-- Info -->
<span style="background: var(--color-info-bg); color: var(--color-info-text)"
  >...</span
>
```

### Buttons

- Primary: `bg-primary text-white` (brand blue, rx-md)
- Secondary: `bg-surface border border-border text-text-primary`
- Destructive: `bg-error text-white`
- Ghost: `hover:bg-surface-input text-text-secondary`

All buttons use `rx-md` (6px) unless in a compact row context.

### Tables

- Container: `bg-white rounded-xl shadow-card overflow-hidden`
- Header row: `bg-background` (`#F7F8FA`), text `text-muted` small
- Body rows: `border-b border-border` dividers, `#F1F2F5`
- Row hover: `hover:bg-surface-input`

### Inputs / Forms

- Background: `var(--color-surface-input)` (`#F1F2F5`)
- Border: `var(--color-border-strong)` (`#E5E7EC`) — only visible on focus or error
- Focus ring: `2px solid var(--color-primary)`
- Error state: `border-error` + `text-error` message below
- All inputs use `rx-md` (6px)

---

## 5. shadcn-vue Token Mapping

In `components.json` and the shadcn CSS variable block, map to our tokens:

```css
/* Inside @layer base { :root { ... } } — after our custom vars */
--background: 0 0% 97%; /* approx #F7F8FA */
--foreground: 220 20% 7%; /* approx #0D1017 */
--card: 0 0% 100%; /* #FFFFFF */
--card-foreground: 220 20% 7%;
--popover: 0 0% 100%;
--popover-foreground: 220 20% 7%;
--primary: 220 100% 50%; /* #0055FF */
--primary-foreground: 0 0% 100%;
--secondary: 220 9% 46%; /* #4B5260 */
--secondary-foreground: 0 0% 100%;
--muted: 220 14% 96%; /* #F1F2F5 */
--muted-foreground: 220 13% 50%; /* #8B919E */
--accent: 220 100% 93%; /* #EEF3FF */
--accent-foreground: 220 100% 50%;
--destructive: 0 73% 51%; /* #DC2626 */
--destructive-foreground: 0 0% 100%;
--border: 220 13% 91%; /* #E5E7EC */
--input: 220 14% 95%; /* #F1F2F5 */
--ring: 220 100% 50%; /* #0055FF */
--radius: 0.375rem; /* 6px = var(--radius-md) */
```

---

## 6. What NOT to Do

- ❌ No hardcoded hex in component classes (use CSS vars or Tailwind tokens)
- ❌ No `color: #353B47` inline style — use `text-[var(--color-sidebar-icon-muted)]`
- ❌ No custom UI components from scratch if shadcn-vue already has it
- ❌ No full dark mode implementation (out of scope Phase 1)
- ❌ No separate CSS files per component — globals.css only for global tokens
- ❌ No `<style scoped>` for layout or token overrides — only for truly scoped micro-styles
- ❌ No `console.log` in client code — use Pino on server, browser console is fine only in dev

---

## 7. UI Kit Reference

The exported `MyPartner UI Kit.html` file is the visual ground truth.  
Copy it to `public/ui-kit-reference.html` so the Executor can open it locally during development.  
Path: `http://localhost:3000/ui-kit-reference.html`

---

## 8. Approval Gate

After Phase 02 (Design System / Kitchen Sink) is complete:

1. Run `pnpm dev`
2. Open `http://localhost:3000/kitchen-sink`
3. Open `http://localhost:3000/ui-kit-reference.html` side by side
4. Screenshot both → send to Planner (Claude Cowork) for approval
5. Do NOT proceed to page implementation until approval is given

---

_This file is the source of truth for all frontend visual decisions. If in doubt, refer to `public/ui-kit-reference.html`._
