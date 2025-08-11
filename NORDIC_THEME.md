# Nordic Rune Timer - Theme Documentation

## Overview

The Nordic Rune Timer features a sophisticated theme system inspired by Nordic mythology and the beauty of the northern night sky. The theme combines modern glass morphism effects with mystical aurora animations and carefully crafted rune iconography.

## Theme System

### CSS Custom Properties

The theme is built on a foundation of CSS custom properties that define:

- **Nordic Colors**: Night sky gradients from deep blues to ethereal whites
- **Aurora Colors**: Magical blues, cyans, emeralds, purples, and pinks
- **Rune Colors**: Accent colors for interactive elements and status indicators
- **Glass Effects**: Translucent overlays with blur effects and subtle borders
- **Timer States**: Specific colors for idle, running, and paused states

### Key Design Elements

#### 1. Night Sky Background

```css
.night-sky
```

- Animated star field with twinkling effects
- Multi-layered aurora gradients
- Deep space color transitions

#### 2. Glass Morphism Effects

```css
.night-glass           /* Basic glass effect */
.night-glass-ethereal  /* Enhanced with color gradients */
.night-glass-mystical  /* Emerald-tinted glass */
.night-glass-cosmic    /* Purple-blue cosmic glass */
```

#### 3. Interactive Elements

```css
.btn-nordic-primary    /* Primary action buttons */
.btn-nordic-secondary  /* Secondary actions */
.btn-nordic-ghost      /* Subtle ghost buttons */
```

#### 4. Animations

- **Aurora Flow**: Flowing northern lights animation
- **Star Twinkle**: Subtle star field movement
- **Rune Glow**: Pulsating glow effects for rune symbols
- **Shimmer**: Light reflection effects
- **Magic Particles**: Floating magical elements

## Usage Examples

### Basic Nordic Button

```svelte
<button class="btn-nordic btn-nordic-primary hover-glow"> Start Timer </button>
```

### Glass Container

```svelte
<div class="night-glass-ethereal shimmer">
  <h2>Timer Display</h2>
  <div class="timer-text rune-glow">25:00</div>
</div>
```

### Status Indicators

```svelte
<div class="timer-status running">⏵ Focus Time</div>
<div class="timer-status paused">⏸ Paused</div>
<div class="timer-status idle">⏹ Ready</div>
```

## Color Palette

### Primary Colors

- **Nordic Night**: `#0a0e1a` - Deep space background
- **Nordic Dusk**: `#111827` - Card backgrounds
- **Nordic Snow**: `#f9fafb` - Primary text
- **Nordic Ice**: `#d1d5db` - Secondary text

### Accent Colors

- **Rune Blue**: `#60a5fa` - Primary interactive elements
- **Rune Emerald**: `#34d399` - Success/running states
- **Rune Amber**: `#fbbf24` - Warning/paused states
- **Rune Cyan**: `#22d3ee` - Secondary accents

### Aurora Effects

- **Aurora Blue**: `#3b82f6`
- **Aurora Cyan**: `#06b6d4`
- **Aurora Emerald**: `#10b981`
- **Aurora Purple**: `#8b5cf6`
- **Aurora Pink**: `#ec4899`

## Accessibility Features

- **Focus Indicators**: High-contrast focus rings
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **High Contrast**: Enhanced borders in high-contrast mode
- **Screen Reader**: Proper ARIA labels and hidden text
- **Keyboard Navigation**: Full keyboard accessibility

## Responsive Design

The theme includes responsive breakpoints:

- **Mobile**: Optimized layouts for small screens
- **Tablet**: Adjusted spacing and button sizes
- **Desktop**: Full featured experience

## Animation Performance

All animations are optimized for performance:

- **GPU Acceleration**: Transform and opacity animations
- **Reduced Complexity**: Simplified animations on lower-end devices
- **Battery Awareness**: Lighter effects on battery-powered devices

## Customization

The theme can be customized by modifying CSS custom properties:

```css
:root {
  --rune-blue: #your-color;
  --aurora-flow-duration: 20s;
  --glass-blur: 25px;
}
```

## Technical Implementation

### File Structure

```
src/styles/
├── nordic-theme.css    # Complete theme system
└── ...

src/
├── App.svelte         # Main app with night sky
├── styles.css         # Theme imports
└── lib/components/
    └── TimerPanel.svelte  # Themed timer interface
```

### Browser Support

- **Modern Browsers**: Full feature support
- **Safari**: Optimized backdrop-filter performance
- **Firefox**: Alternative gradients for better support
- **Chrome**: Full CSS Grid and Flexbox support

## Performance Considerations

- **CSS Variables**: Efficient property updates
- **Animation Layers**: Isolated animation contexts
- **Backdrop Filters**: Optimized blur implementations
- **GPU Rendering**: Hardware acceleration where possible

---

_The Nordic Rune Timer theme represents the meeting of ancient Nordic mysticism with modern design principles, creating an immersive and functional user experience._
