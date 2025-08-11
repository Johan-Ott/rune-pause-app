# DAGRO - Styling Files Guide

## 🎨 Huvudsakliga Styling-filer

### **1. `/styles/globals.css` - HUVUDFIL**

**Detta är den viktigaste styling-filen som innehåller:**

✅ **Tailwind V4 konfiguration**

- CSS Custom Properties (variabler)
- Base layer styling
- Utilities layer styling

✅ **Färgteman:**

- Light mode colors (`:root`)
- Dark mode colors (`.dark`)
- Nordic theme colors (`--nordic-*`)

✅ **Avancerade effekter:**

- Night sky background
- Aurora borealis animations
- Glass effects (`.night-glass-*`)
- Shimmer animations
- Star layers och particle systems

✅ **Navigation styling:**

- Button positioning classes
- Hover effects
- Modern interactive elements

### **2. `/styles/nordic-theme.css` - TEMA-SPECIFIK**

**Separerad nordisk tema-styling för Svelte-portering:**

✅ **Enklare CSS-struktur:**

- Grundläggande färger och variabler
- Natthimmel bakgrunder
- Glass effekter
- Knapp-styling
- Layout hjälpklasser

✅ **Standalone design:**

- Inga React/Tailwind-beroenden
- Redo för Svelte implementation
- Fokus på nordisk estetik

## 🧩 Komponenter med Inline Styling

### **Huvudkomponenter:**

```
/components/PauseView.tsx        - Natthimmel och navigation
/components/ConfigView.tsx       - Modern glass container
/components/BreathingExercise.tsx - Andnings-animationer
/components/StretchGuide.tsx     - Stretch-guide styling
/components/NightSkyBackground.tsx - Stjärn och aurora-effekter
/components/SeasonTheme.tsx      - Dynamiska tema-färger
```

### **UI-komponenter:**

```
/components/ui/*.tsx             - ShadCN komponenter med Tailwind
```

## 📱 App-nivå Styling

### **`/App.tsx` - Body Classes:**

```typescript
// Dark mode toggle
document.documentElement.classList.add('dark')
document.body.classList.add('dark')

// System tray mode (transparent background)
document.body.classList.add('system-tray')
```

## 🎯 För Svelte-portering

### **Använd dessa filer:**

1. **`/styles/nordic-theme.css`** - Kopiér direkt
2. **Komponenter:** `/components/Simple*.ts` filer
3. **Guide:** `/SVELTE_PORTING_GUIDE.md`

### **Ignorera dessa för Svelte:**

- `/styles/globals.css` (Tailwind-specifik)
- React `.tsx` komponenter
- ShadCN UI komponenter

## 🔧 CSS-klasser Kategorier

### **Night Sky Effects:**

```css
.night-sky-background     /* Huvudbakgrund */
.stars-layer             /* Stjärnor */
.aurora-borealis         /* Nordljus */
.magic-particles         /* Partiklar */
```

### **Glass Effects:**

```css
.night-glass-ethereal    /* Genomskinlig glass */
.night-glass-mystical    /* Mystisk glass */
.night-glass-cosmic      /* Kosmisk glass */
.glass-subtle           /* Enkel glass */
```

### **Interactive Effects:**

```css
.night-shimmer          /* Shimmer animation */
.night-hover           /* Hover effects */
.rune-glow            /* Rune glöd-effekt */
```

### **Layout & Navigation:**

```css
.modern-container       /* Huvudcontainer */
.modern-card           /* Kort med glass */
.btn-top-left          /* Knapp positionering */
.btn-top-right         /* Knapp positionering */
```

## 📋 Styling Priority

### **1. Highest Priority:**

- `/styles/globals.css` - För React/Tailwind version
- `/styles/nordic-theme.css` - För Svelte version

### **2. Component Level:**

- Komponenter använder huvudsakligen Tailwind-klasser
- Custom CSS definieras i globals.css

### **3. Inline Styles:**

- Minimal användning - mest för dynamiska värden
- Animationer och motion-effekter

## 🛠️ Utveckling

### **För att ändra styling:**

1. **Färger/Teman:** Ändra i `:root` och `.dark` i `globals.css`
2. **Animationer:** Lägg till i `@keyframes` sektionen
3. **Nya effekter:** Skapa i `@layer utilities`
4. **Komponenter:** Använd befintliga CSS-klasser

### **CSS Custom Properties:**

```css
--nordic-primary: #2c5282;
--nordic-secondary: #38a169;
--nordic-accent: #d69e2e;
--night-deep: #0a0e1a;
--glass-blue: rgba(147, 197, 253, 0.2);
```

## 🎨 Sammanfattning

**DAGRO's styling bygger på:**

- **Tailwind V4** med custom properties
- **Nordic theme** med blå färgpalett
- **Night sky** bakgrund med animationer
- **Glass morphism** effekter
- **Responsive design** för mobil/desktop
- **Dark/Light mode** support

**Huvudfiler för styling:**

1. `/styles/globals.css` (React version)
2. `/styles/nordic-theme.css` (Svelte version)
3. Komponenter med Tailwind-klasser

Nu vet du exakt vilka filer som hanterar styling! 🌟💙
