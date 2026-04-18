# THEME SPECIFICATION (v4 — FINAL ENGINEERING CONTRACT)
 
---
 
## 0. PHILOSOPHY
 
### Creative North Star: "The Obsidian Architect"
 
The interface behaves like a physical engineered object.
 
- **Heavy:** Depth is achieved through material stacking, not light shadows.
- **Precise:** Sharp corners and technical typography convey authority.
- **Controlled:** Minimalist color palette with high-impact primary accents.
 
### Core Principles (NON-NEGOTIABLE)
 
1. **No-Line Rule**
- Do NOT use borders to define containers.
- Visual boundaries are achieved through:
    - Background surface shifts
    - Intentional negative space
    - Layering of distinct elevations
 
2. **Depth = Surface, NOT Shadow**
- Elevation is indicated by lightening the surface color.
- Shadows are reserved strictly for temporary modal overlays.
 
3. **Single Focus Per Screen**
- Maintain a strict hierarchy with one primary CTA per screen to guide user intent.
 
---
 
## 1. TOKEN SYSTEM
 
### 1.1 Primitive Tokens (RAW VALUES)
 
```json
{
"color": {
"neutral-900": "#131315",
"neutral-800": "#1b1b1d",
"neutral-700": "#2a2a2c",
"neutral-600": "#353437",
 
"primary-500": "#6366F1",
"primary-400": "#8083FF",
 
"text-100": "#e4e2e4",
"text-300": "#a1a1aa"
},
 
"spacing": {
"4": "4px",
"8": "8px",
"16": "16px",
"24": "24px",
"32": "32px",
"48": "48px",
"72": "72px",
"96": "96px"
},
 
"radius": {
"sm": "2px",
"md": "8px",
"lg": "12px"
}
}
```
 
### 1.2 Semantic Tokens
```json
{
"surface": {
"base": "#131315",
"low": "#1b1b1d",
"high": "#2a2a2c",
"highest": "#353437"
},
 
"text": {
"primary": "#e4e2e4",
"secondary": "#a1a1aa"
},
 
"action": {
"primary": "#6366F1",
"primary-hover": "#8083FF"
}
}
```
 
### 1.3 Component Tokens
```json
{
"button": {
"primary": {
"bg": "#6366F1",
"text": "#1000a9",
"radius": "2px",
"height-md": "40px"
}
},
 
"card": {
"bg": "#2a2a2c",
"hover-bg": "#353437",
"padding": "24px"
}
}
```
 
---
 
## 2. CSS VARIABLE MAPPING
```css
:root {
--surface-base: #131315;
--surface-low: #1b1b1d;
--surface-high: #2a2a2c;
--surface-highest: #353437;
 
--primary: #6366F1;
--primary-hover: #8083FF;
 
--text-primary: #e4e2e4;
--text-secondary: #a1a1aa;
}
```
 
---
 
## 3. TYPOGRAPHY
 
**Fonts**
- Display: Space Grotesk
- Body: Inter
- Label: Inter
 
**Scale**
- display-lg: 56px / 3.5rem
- headline-md: 28px / 1.75rem
- title-lg: 22px / 1.375rem
- body-md: 14px / 0.875rem
- label-sm: 11px / 0.6875rem
 
**Rules**
- Display: letter-spacing -0.02em
- Body: line-height 1.6
- Hero max width: 520px
 
---
 
## 4. LAYOUT SYSTEM
 
- **Container Max Width:** 1280px
- **Padding X:** 24px
 
**Vertical Rhythm (Section Spacing)**
- Hero: 96px
- Default: 72px
- Dense: 48px
 
**Grid**
- Desktop: 3 columns
- Mobile: 1 column
 
---
 
## 5. COMPONENTS
 
### 5.1 BUTTON
- **Sizes:**
    - SM: 32px H | 12px PX
    - MD: 40px H | 16px PX
    - LG: 48px H | 24px PX
- **States:**
    - Hover: Scale 1.02, 20px blur glow (rgba(99,102,241,0.2))
    - Active: Darker background
    - Motion: 200ms ease-out
 
### 5.2 PRODUCT CARD
- **Layout:** 1:1 Image Ratio | Internal Padding 24px
- **Interaction:** On hover, shift background to `surface-highest` and translate -4px Y.
- **CTA:** Absolute bottom-right position (36px size).
 
### 5.3 INPUT
- **Background:** `surface-low`
- **Focus:** `surface-high` with primary bottom glow. No borders.
 
---
 
## 6. INTERACTION SYSTEM
- **Hover:** 200ms transition.
- **Click:** Instant visual feedback (scale compress).
- **Patterns:** Card hover lifts; Scroll triggers fade-in.
 
---
 
## 7. TAILWIND MAPPING
```javascript
theme: {
  extend: {
    colors: {
      surface: {
        low: "#1b1b1d",
        high: "#2a2a2c",
        highest: "#353437"
      },
      primary: "#6366F1"
    },
    borderRadius: {
      DEFAULT: "2px"
    }
  }
}
```
 
---
 
## 8. QA CHECKLIST
- [ ] No borders used for container separation.
- [ ] Elevation hierarchy follows Surface Base -> Low -> High -> Highest.
- [ ] Typography scale and letter-spacing match spec.
- [ ] Roundedness is consistent at subtle/sharp (2px).
- [ ] Primary CTA is unique and distinctive.
