# Zenovee UX/UI Design System

## Core Principles

1. **Simplicity** - Remove all unnecessary elements
2. **Clarity** - User understands purpose in 5 seconds
3. **Professional** - SaaS-grade polish
4. **Goal-Driven** - Organize around user outcomes, not features

---

## Navigation Structure

### Primary Navigation
- **Dashboard** (overview, credits, recently used, recommended)
- **Marketing Tools** (5 main goal-based categories)
- **Developer Tools** (5 main goal-based categories)
- **Image Tools** (5 main goal-based categories)
- **SEO Tools** (5 main goal-based categories)
- **Automation Tools** (5 main goal-based categories)
- **Billing** (simple 3-tier pricing)

### User Flow
```
Home → Choose Goal → Run Tool → Get Results → Upgrade
```

---

## Color Palette — Ultra Premium SaaS

### Primary Colors
- **Primary Gradient**: `#7C5CFF` → `#5B9CFF` (Violet → Blue)
- **Accent Glow**: `#8B5CF6` (Purple glow accent)

### Dark Mode
- **Background**: `#0B0F19` (Deep dark)
- **Secondary Dark**: `#111827` (Card backgrounds)
- **Card Dark**: `rgba(255,255,255,0.05)` (Subtle overlay)

### Light Mode
- **Background**: `#F9FAFB` (Off-white)
- **Section Light**: `#FFFFFF` (Pure white for sections)
- **Border Light**: `#E5E7EB` (Light borders)

### Text
- **Dark BG Text**: `#FFFFFF` (White on dark)
- **Light BG Text**: `#111827` (Dark on light)
- **Secondary Text**: `#6B7280` (Muted gray)

### Status Colors
- **Success**: `#22C55E` (Green)
- **Error**: `#EF4444` (Red)

### Shadow System
- **Light Shadows**: Subtle soft gray (for light mode)
- **Dark Shadows**: Purple/blue glow (for dark mode)

---

## Color System Rules

### 🎨 Design Principles
- **NEVER** use pure black everywhere — maintain dark `#0B0F19` instead
- **ALWAYS** mix light + dark modes for contrast and hierarchy
- **USE** gradients for all CTAs (primary purple to blue)
- **APPLY** glows for premium visual hierarchy (accent `#8B5CF6`)

### 📐 Implementation Guidelines
1. **Primary Gradient for CTAs**: Always use `#7C5CFF → #5B9CFF` with shadow glow
2. **Text on Dark**: White (`#FFFFFF`) for dark backgrounds
3. **Text on Light**: Dark (`#111827`) for light backgrounds
4. **Secondary Elements**: Space-filling text `#6B7280` (gray)
5. **Borders**: Use slight transparency (`rgba(255,255,255,0.1)` on dark, `#E5E7EB` on light)
6. **Cards**: Dark mode uses `rgba(255,255,255,0.05)`, light mode uses `#FFFFFF`
7. **Glow Effects**: Dark mode uses purple/blue shadow (e.g., `box-shadow: 0 0 30px rgba(124, 92, 255, 0.3)`)

---

## Typography

- **H1 (Page Title)**: `text-4xl sm:text-5xl font-bold text-white`
- **H2 (Section)**: `text-2xl sm:text-3xl font-bold text-white`
- **H3 (Subsection)**: `text-lg sm:text-xl font-semibold text-white`
- **Body**: `text-sm sm:text-base text-slate-300`
- **Label**: `text-xs sm:text-sm font-medium text-slate-400`

---

## Components

### Buttons

**Primary CTA**
```
rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-8 py-4 
font-semibold text-white hover:scale-105 transition-transform
```

**Secondary Button**
```
rounded-xl border border-white/20 bg-white/5 px-8 py-4 
font-semibold text-white hover:bg-white/10 transition-colors
```

**Small Button**
```
rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-white 
hover:bg-white/10 transition-colors
```

### Cards

**Standard Card**
```
rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8
hover:border-white/20 hover:bg-white/10 transition-all
```

**Featured Card (Highlight)**
```
rounded-2xl border border-violet-400/50 bg-gradient-to-br from-violet-950/40 to-white/5 
ring-1 ring-violet-400/20 p-6 sm:p-8
```

### Input Fields

```
rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white 
placeholder:text-slate-500 focus:border-violet-400/50 focus:outline-none
```

### Forms

- **Spacing**: `space-y-4` or `space-y-6` between fields
- **Labels**: `text-sm font-medium text-white mb-2`
- **Full Width**: `w-full` for all form fields

---

## Homepage Layout

### Section 1: Hero
- Large headline
- Subheadline (benefits)
- 2 CTAs (primary + secondary)
- Max width: 4xl

### Section 2: How It Works
- 3-step simple process
- Icons + Title + Description
- Grid 1-3 columns

### Section 3: 5 Goal Cards
- Large cards with emoji icons
- Title + description
- Hover effect (border color change)
- Full width or 2-column grid

### Section 4: Pricing
- 3 simple plans
- Highlighted center plan
- Clear pricing + features

### Section 5: Final CTA
- Gradient box
- Single call-to-action

---

## Dashboard Layout

### Sidebar (Desktop)
- Logo at top
- 7 navigation items
- Logout button at bottom
- Width: `w-64`

### Main Content
- Top section: Credits card with "Buy More" CTA
- 2-3 column grid
- Recently used tools (list)
- Recommended tools (buttons)
- Quick start cards

---

## Tool Page Layout

### Section 1: Header
- Tool name (H1)
- Brief description
- Category badge

### Section 2: Input Form
- Clean form fields
- Large "Run Tool" button
- Loading state feedback

### Section 3: Output Display
- Formatted result output
- 3 action buttons: Copy, Download, Regenerate
- Max height with scroll

---

## Admin Dashboard

### Top Section
- 4 stat cards:
  - Total Revenue (white)
  - AI Cost (white)
  - Profit (violet highlight)
  - Active Users (white)

### Middle Section (2 columns)
- Tool Performance Table
- Top Users Table

### Bottom Section
- Recent Users Table
- Transaction List

---

## Spacing Rules

- **Container Padding**: `px-4 sm:px-6 lg:px-8` + `py-12 sm:py-16 lg:py-20`
- **Card Padding**: `p-6 sm:p-8`
- **Section Gap**: `gap-8 lg:gap-12`
- **Item Gap**: `gap-4`

---

## Responsive Design

### Breakpoints
- Mobile: Default (< 640px)
- Small: `sm:` (640px)
- Medium: `md:` (768px)
- Large: `lg:` (1024px)
- XL: `xl:` (1280px)

### Grid Examples
- Single on mobile, 2 on tablet, 3+ on desktop:
  ```
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
  ```

---

## Hover & Transition States

- **Buttons**: `hover:scale-105 transition-transform`
- **Cards**: `hover:border-white/20 hover:bg-white/10 transition-all`
- **Links**: `hover:text-violet-400 transition-colors`
- **All transitions**: 200ms default speed

---

## Accessibility

- All interactive elements have clear hover states
- Text contrast meets AA standards
- Focus states on inputs: `:focus:border-violet-400/50 :focus:outline-none`
- Disabled states: `disabled:opacity-50`

---

## Remove From UI

- Too many buttons on one page
- Hidden features or unclear CTAs
- Complex multi-step flows
- Tool icons other than emoji
- Unnecessary explanatory text
- Confusing metrics or stats
- Multiple sidebar colors

---

## Add To UI

- Large, clear headings
- Generous white space
- Emoji for visual clarity
- Smooth transitions
- Clear loading states
- Success/error feedback
- Consistent rounding (2xl, xl, lg, button-specific)

---

## Summary

User → Homepage → Choose Goal → Dashboard → Run Tool → Get Results

Every page should be clear and focused. Remove options until users understand immediately what to do.
