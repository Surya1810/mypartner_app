# Frontend Rules — MyPartner

**Source:** MyPartner UI Kit (Claude Design export)  
**Last updated:** 2026-06-23

---

## 1. Design Tokens — CSS Variables

All variables live in ONE file: `app/assets/css/globals.css`.  
We use Tailwind v4 `@theme` scale. Never hardcode hex colors in component classes if a CSS variable exists.  
Never define tokens in component `<style>` blocks.

```css
/* app/assets/css/globals.css */
@import "tailwindcss";

@theme {
  /* ── Fonts ─────────────────────────────────────────────── */
  --font-sans: "Montserrat", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Kanit", "Montserrat", ui-sans-serif, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* ── Brand scale ─────────────────────────────────────── */
  --color-brand-50: #eef3ff;
  --color-brand-100: #d9e4ff;
  --color-brand-200: #b3c9ff;
  --color-brand-300: #80a4ff;
  --color-brand-400: #4d7eff;
  --color-brand-500: #0055ff;
  --color-brand-600: #0047d6;
  --color-brand-700: #0039ad;
  --color-brand-800: #002c85;
  --color-brand-900: #001f5c;

  /* ── Neutral / Ink scale ────────────────────────────── */
  --color-neutral-0: #ffffff;
  --color-neutral-50: #f7f8fa;
  --color-neutral-100: #f1f2f5;
  --color-neutral-200: #e5e7ec;
  --color-neutral-300: #d3d7df;
  --color-neutral-400: #9aa0ad;
  --color-neutral-500: #6b7280;
  --color-neutral-600: #4b5260;
  --color-neutral-700: #353b47;
  --color-neutral-750: #2a2f3b;
  --color-neutral-800: #21262f;
  --color-neutral-850: #191e27;
  --color-neutral-900: #14171c;
  --color-neutral-950: #0d1017;

  /* ── Ink (text) ─────────────────────────────────────── */
  --color-ink: #1b1b1b;
  --color-ink-near: #111111;

  /* ── Semantic: Success ──────────────────────────────── */
  --color-success-50: #e8f8ef;
  --color-success-100: #c6eed7;
  --color-success-500: #15a05a;
  --color-success-600: #11874c;
  --color-success-700: #0c6b3c;

  /* ── Semantic: Warning ──────────────────────────────── */
  --color-warning-50: #fef4e5;
  --color-warning-100: #fce3bc;
  --color-warning-500: #e8920c;
  --color-warning-600: #c2790a;
  --color-warning-700: #945c06;

  /* ── Semantic: Danger ───────────────────────────────── */
  --color-danger-50: #fdecec;
  --color-danger-100: #f9cfcf;
  --color-danger-500: #e11900;
  --color-danger-600: #be1500;
  --color-danger-700: #911000;

  /* ── Shadows ────────────────────────────────────────── */
  --shadow-xs: 0 1px 2px rgba(20, 23, 28, 0.05);
  --shadow-soft:
    0 1px 3px rgba(20, 23, 28, 0.06), 0 1px 2px rgba(20, 23, 28, 0.04);
  --shadow-card:
    0 4px 12px rgba(20, 23, 28, 0.07), 0 2px 4px rgba(20, 23, 28, 0.04);
  --shadow-lift:
    0 12px 28px rgba(20, 23, 28, 0.1), 0 4px 8px rgba(20, 23, 28, 0.05);
  --shadow-xl:
    0 24px 50px rgba(20, 23, 28, 0.14), 0 8px 16px rgba(20, 23, 28, 0.06);
  --shadow-brand:
    0 10px 24px rgba(0, 85, 255, 0.18), 0 2px 6px rgba(0, 85, 255, 0.1);
  --shadow-card-dark:
    0 4px 14px rgba(0, 0, 0, 0.28), 0 2px 4px rgba(0, 0, 0, 0.16);

  /* ── Border Radius ──────────────────────────────────── */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 24px;

  /* ── Layout ─────────────────────────────────────────── */
  --sidebar-width: 260px;
  --navbar-height: 64px;
}
```

---

## 2. Typography

**Font:** Montserrat + Kanit + JetBrains Mono  
Register in `nuxt.config.ts`:

```ts
css: [
  // Montserrat — body font
  '@fontsource/montserrat/400.css',
  '@fontsource/montserrat/500.css',
  '@fontsource/montserrat/600.css',
  '@fontsource/montserrat/700.css',
  // Kanit — display/heading font
  '@fontsource/kanit/400.css',
  '@fontsource/kanit/600.css',
  '@fontsource/kanit/700.css',
  // JetBrains Mono — code/mono font
  '@fontsource/jetbrains-mono/400.css',
  '@fontsource/jetbrains-mono/500.css',
  // Global styles
  '~/assets/css/globals.css',
],
```

| Role        | Size       | Weight | Font           | Usage                      |
| ----------- | ---------- | ------ | -------------- | -------------------------- |
| Display     | 24px / 1.3 | 700    | Kanit          | Page titles, hero headings |
| Heading 1   | 20px / 1.4 | 600    | Kanit          | Section headings           |
| Heading 2   | 16px / 1.4 | 600    | Kanit          | Card titles, modal titles  |
| Body        | 14px / 1.5 | 400    | Montserrat     | All body text (default)    |
| Body Medium | 14px / 1.5 | 500    | Montserrat     | Labels, nav items          |
| Small       | 12px / 1.5 | 400    | Montserrat     | Captions, meta info        |
| Mono        | 13px / 1.5 | 400    | JetBrains Mono | Codes, vault passwords     |

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

Pola wajib dari UI Kit:

```
Input pattern:
  h-11 px-3.5 rounded-md bg-white border border-neutral-300 text-sm text-ink
  placeholder:text-neutral-400
  focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 outline-none transition

Button solid:
  h-10 px-4 rounded-md bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-brand transition-colors

Button outline:
  h-10 px-4 rounded-md bg-white border border-neutral-300 hover:border-brand-500
  hover:text-brand-600 text-ink text-sm font-semibold shadow-xs transition-colors

Button ghost:
  h-10 px-4 rounded-md text-brand-600 hover:bg-brand-50 text-sm font-semibold transition-colors

Card:
  bg-white rounded-lg border border-neutral-200 shadow-soft p-6

Section header label (above card):
  text-xs font-semibold uppercase tracking-[.12em] text-neutral-400 mb-3
```

### Badges / Status Chips

```html
<!-- Success -->
<span class="badge-success">Aktif</span>
<!-- Warning -->
<span class="badge-warning">Pending</span>
<!-- Info -->
<span class="badge-brand">Info</span>
<!-- Danger -->
<span class="badge-danger">Error</span>
```

### Tables

- Container: `bg-white rounded-xl shadow-card overflow-hidden`
- Header row: `bg-background` (`#F7F8FA`), text `text-muted` small
- Body rows: `border-b border-border` dividers, `#F1F2F5`
- Row hover: `hover:bg-surface-input`

---

## 5. shadcn-vue Token Mapping

In `components.json` and the shadcn CSS variable block, map to our tokens:

```css
/* Inside @layer base { :root { ... } } — after our custom vars */
--background: 220 14% 98%; /* neutral-50 */
--foreground: 0 0% 11%; /* ink #1B1B1B */
--card: 0 0% 100%;
--card-foreground: 0 0% 11%;
--popover: 0 0% 100%;
--popover-foreground: 0 0% 11%;
--primary: 220 100% 50%; /* brand-500 #0055FF */
--primary-foreground: 0 0% 100%;
--secondary: 220 9% 29%; /* neutral-700 #353B47 */
--secondary-foreground: 0 0% 100%;
--muted: 220 14% 95%; /* neutral-100 */
--muted-foreground: 220 13% 56%; /* neutral-500 */
--accent: 220 100% 93%; /* brand-50 */
--accent-foreground: 220 100% 50%;
--destructive: 8 100% 44%; /* danger-500 #E11900 */
--destructive-foreground: 0 0% 100%;
--border: 220 13% 90%; /* neutral-200 */
--input: 220 14% 95%; /* neutral-100 */
--ring: 220 100% 50%; /* brand-500 */
--radius: 0.5rem; /* 8px = radius-md */
```

---

## 6. What NOT to Do

- ❌ No hardcoded hex in component classes (use CSS vars or Tailwind tokens)
- ❌ No `color: #353B47` inline style — use `text-[var(--color-sidebar-icon-muted)]` or the tailwind config
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
