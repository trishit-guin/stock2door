
# 🌐 SmartRoute – Frontend Design Guidelines

**Prepared by:** Senior Frontend Engineer (Google)  
**Date:** July 13, 2025  
**Version:** 1.0

---

## 🎨 1. Visual Theme

SmartRoute embodies **sustainability, clarity, and operational intelligence**. The UI must feel modern, minimal, and powerful. The design should instill trust, and the visuals should reflect a data-driven, environment-conscious product.

### 🔑 Design Pillars:
- **Eco-smart**: Green + neutral palette
- **Professional**: Crisp typography, clear cards, precise spacing
- **Interactive**: Smooth transitions and data responsiveness
- **Accessible**: WCAG 2.1 AA compliance

---

## 🌈 2. Color Palette

| Purpose           | Color                        | HEX       | Notes                          |
|------------------|------------------------------|-----------|--------------------------------|
| Primary          | Deep Blue                    | `#2C3E50` | For navbar, key CTAs           |
| Accent           | SmartRoute Green             | `#27AE60` | Eco-tone, KPIs, highlights     |
| Background       | Light Gray                   | `#F4F7F8` | App background                 |
| Surface          | White                        | `#FFFFFF` | Cards, panels                  |
| Warning          | Amber                        | `#F39C12` | Alerts (weather, EV issues)    |
| Error            | Red                          | `#E74C3C` | Critical warnings              |
| Text Primary     | Charcoal Black               | `#333333` | Body content                   |
| Text Secondary   | Muted Gray                   | `#7F8C8D` | Labels, helper text            |

> 🎨 Use opacity + layering over maps (e.g., clusters, alerts) for visual depth.

---

## 🔠 3. Typography

| Use Case        | Font         | Size     | Weight |
|----------------|--------------|----------|--------|
| Headers (H1-H3)| Inter        | 24-40px  | 600-700|
| Body           | Inter        | 14-16px  | 400    |
| Caption        | Inter        | 12px     | 400    |
| Buttons        | Inter        | 14px     | 500-600|

- Line height: `1.4`
- Letter spacing: `-0.2px` for headers

---

## 🧱 4. Layout & Grid System

- **12-column grid** (Desktop), 4-column (Mobile)
- **Max width:** `1200px`
- **Spacing scale:** 4px → 8px → 16px → 24px → 32px
- **Card elevation:** `box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08)`
- **Navigation bar:** Fixed top, full width, dark background

---

## 📱 5. Component Guidelines

### 🔐 Authentication Screens
- Clean split-screen with visual branding (map/eco image)
- Form in center card with elevation
- Social login (if applicable): simple Google button

### 🗺️ Route Optimizer
- **Map:** Google Maps embedded with route overlays
- **Sidebar:** Inputs – source, destinations, vehicle type
- **Output card:** ETA, emissions, comparison to default
- **Live update:** Animated progress/loading bar during optimization

### ⚡ EV Compatibility
- Charger icons on route
- Color-coded segments (compatible: green, risky: red)
- Recommendations in modal or bottom drawer

### 🌦️ Weather-Aware Routing
- Weather icons over route map
- Inline alerts above or below route card
- Optional toggle: "Avoid bad weather"

### 📈 Analytics Dashboard
- Role-based widgets
- KPIs in card format
- Filters for date, region, vehicle type
- Graphs: Bar, Line, Pie (use `Chart.js` or `Recharts`)

### 📤 Upload & Export
- Dropzone + file preview
- Validation status (✓/✗ icons)
- Export buttons with loading feedback

---

## ⚙️ 6. Interactions & UX

- Smooth transitions (200–300ms ease-out)
- Micro animations for map, alerts, KPIs
- Button states: hover, disabled, loading
- Skeleton loading on slow network
- Toast notifications for success/errors

---

## ♿ 7. Accessibility & Responsiveness

- All buttons: `aria-label` and focus state
- Color contrast > 4.5:1 minimum
- Responsive breakpoints:
  - Mobile: ≤ 768px
  - Tablet: 769–1024px
  - Desktop: ≥ 1025px

---

## 🧩 8. Component Library & Stack

- **Framework:** React (Next.js preferred)
- **UI Library:** shadcn/ui, TailwindCSS
- **State Management:** Zustand or Redux Toolkit
- **Icons:** Lucide, Material Icons
- **Maps:** Google Maps API (JS SDK)
- **Charting:** Recharts or Chart.js

---

## ✅ 9. Final Notes

- Prioritize performance (lazy loading, bundling)
- Use dark mode toggle (optional)
- Consistent iconography across flows
- Ensure brand identity remains minimal but visible

---

*SmartRoute UI reflects both sustainability and precision. Build with empathy, clarity, and responsibility.*
