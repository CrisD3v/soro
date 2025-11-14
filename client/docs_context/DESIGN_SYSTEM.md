# 🎨 Design System - SORO Frontend

## 🌈 Paleta de Colores

### **Color Principal: Purple**

El sistema está basado en un tema purple usando el espacio de color OKLCH para mejor consistencia y accesibilidad.

#### **Purple Base**
```css
/* Color principal */
--purple-base: oklch(62.7% 0.265 303.9);

/* Equivalente en HSL */
--purple-base-hsl: hsl(270, 100%, 60%);

/* Equivalente en RGB */
--purple-base-rgb: rgb(153, 51, 255);
```

#### **Escala de Purple (Tailwind)**

```css
/* Purple 50 - Muy claro */
purple-50: oklch(97% 0.02 303.9)
rgb(250, 245, 255)

/* Purple 100 */
purple-100: oklch(94% 0.05 303.9)
rgb(243, 232, 255)

/* Purple 200 */
purple-200: oklch(88% 0.1 303.9)
rgb(233, 213, 255)

/* Purple 300 */
purple-300: oklch(80% 0.15 303.9)
rgb(216, 180, 254)

/* Purple 400 */
purple-400: oklch(72% 0.2 303.9)
rgb(192, 132, 252)

/* Purple 500 - Base */
purple-500: oklch(62.7% 0.265 303.9)
rgb(168, 85, 247)

/* Purple 600 - Hover states */
purple-600: oklch(55% 0.24 303.9)
rgb(147, 51, 234)

/* Purple 700 */
purple-700: oklch(48% 0.21 303.9)
rgb(126, 34, 206)

/* Purple 800 */
purple-800: oklch(40% 0.17 303.9)
rgb(107, 33, 168)

/* Purple 900 */
purple-900: oklch(32% 0.13 303.9)
rgb(88, 28, 135)

/* Purple 950 - Muy oscuro */
purple-950: oklch(24% 0.09 303.9)
rgb(59, 7, 100)
```

---

## 🎨 Colores del Sistema

### **Backgrounds**

```css
/* Background principal (dark mode) */
bg-zinc-950: rgb(9, 9, 11)

/* Background secundario */
bg-zinc-900: rgb(24, 24, 27)

/* Cards y superficies */
bg-white/5: rgba(255, 255, 255, 0.05)
backdrop-blur-sm

/* Borders */
border-white/10: rgba(255, 255, 255, 0.1)
border-white/20: rgba(255, 255, 255, 0.2)
```

### **Text Colors**

```css
/* Texto principal */
text-white: rgb(255, 255, 255)

/* Texto secundario */
text-white/60: rgba(255, 255, 255, 0.6)
text-white/70: rgba(255, 255, 255, 0.7)

/* Texto terciario */
text-white/40: rgba(255, 255, 255, 0.4)
text-white/50: rgba(255, 255, 255, 0.5)
```

### **Purple Variants**

```css
/* Botones primarios */
bg-purple-600: rgb(147, 51, 234)
hover:bg-purple-700: rgb(126, 34, 206)

/* Botones secundarios */
bg-purple-500/10: rgba(168, 85, 247, 0.1)
hover:bg-purple-500/20: rgba(168, 85, 247, 0.2)

/* Texto purple */
text-purple-400: rgb(192, 132, 252)
text-purple-500: rgb(168, 85, 247)
text-purple-600: rgb(147, 51, 234)

/* Borders purple */
border-purple-500/20: rgba(168, 85, 247, 0.2)
border-purple-500/30: rgba(168, 85, 247, 0.3)
```

---

## 🌟 Gradientes

### **Gradiente Principal (Background)**

```css
/* Esquina inferior derecha */
background: radial-gradient(
  circle at 100% 100%,
  oklch(62.7% 0.265 303.9 / 0.15) 0%,
  transparent 50%
);
```

### **Gradientes de Cards**

```css
/* Esquina superior derecha (sutil) */
background: radial-gradient(
  circle at 100% 0%,
  oklch(62.7% 0.265 303.9 / 0.1) 0%,
  transparent 50%
);

/* Gradiente de hover */
background: linear-gradient(
  135deg,
  oklch(62.7% 0.265 303.9 / 0.1) 0%,
  transparent 100%
);
```

---

## 🎯 Uso por Componente

### **Botones**

#### Primary Button
```tsx
className="
  bg-purple-600
  hover:bg-purple-700
  text-white
  px-4 py-2
  rounded-lg
  font-medium
  transition-colors
"
```

#### Secondary Button
```tsx
className="
  bg-purple-500/10
  hover:bg-purple-500/20
  text-purple-400
  border border-purple-500/20
  px-4 py-2
  rounded-lg
  font-medium
  transition-colors
"
```

#### Ghost Button
```tsx
className="
  text-white/60
  hover:text-white
  hover:bg-white/5
  px-4 py-2
  rounded-lg
  transition-colors
"
```

### **Cards**

#### Card Base
```tsx
className="
  bg-white/5
  backdrop-blur-sm
  border border-white/10
  rounded-lg
  p-6
"
```

#### Card con Gradiente
```tsx
className="
  relative
  bg-white/5
  backdrop-blur-sm
  border border-white/10
  rounded-lg
  p-6
  overflow-hidden
"
style={{
  background: `
    radial-gradient(circle at 100% 0%, oklch(62.7% 0.265 303.9 / 0.1) 0%, transparent 50%),
    rgba(255, 255, 255, 0.05)
  `
}}
```

#### StatCard (con hover)
```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="
    bg-white/5
    backdrop-blur-sm
    border border-white/10
    rounded-lg
    p-6
    cursor-pointer
  "
/>
```

### **Inputs**

#### Input Base
```tsx
className="
  w-full
  px-4 py-3
  bg-white/5
  border border-white/10
  rounded-lg
  text-white
  placeholder:text-white/40
  focus:outline-none
  focus:border-purple-500/50
  focus:ring-2
  focus:ring-purple-500/20
  transition-all
"
```

#### Input con Error
```tsx
className="
  w-full
  px-4 py-3
  bg-red-500/5
  border border-red-500/50
  rounded-lg
  text-white
  focus:outline-none
  focus:border-red-500
  focus:ring-2
  focus:ring-red-500/20
"
```

### **Badges**

#### Success Badge
```tsx
className="
  px-2 py-1
  bg-green-500/10
  text-green-400
  border border-green-500/20
  rounded-md
  text-xs
  font-medium
"
```

#### Warning Badge
```tsx
className="
  px-2 py-1
  bg-yellow-500/10
  text-yellow-400
  border border-yellow-500/20
  rounded-md
  text-xs
  font-medium
"
```

#### Error Badge
```tsx
className="
  px-2 py-1
  bg-red-500/10
  text-red-400
  border border-red-500/20
  rounded-md
  text-xs
  font-medium
"
```

#### Info Badge
```tsx
className="
  px-2 py-1
  bg-purple-500/10
  text-purple-400
  border border-purple-500/20
  rounded-md
  text-xs
  font-medium
"
```

---

## 🎭 Estados

### **Loading**

```tsx
// Spinner
<div className="
  w-8 h-8
  border-4
  border-purple-500/30
  border-t-purple-500
  rounded-full
  animate-spin
" />

// Skeleton
<div className="
  animate-pulse
  bg-white/5
  rounded-lg
  h-20
" />
```

### **Hover States**

```tsx
// Card hover
hover:bg-white/10
hover:border-white/20

// Button hover
hover:bg-purple-700
hover:scale-105

// Link hover
hover:text-purple-400
hover:underline
```

### **Active/Focus States**

```tsx
// Input focus
focus:border-purple-500/50
focus:ring-2
focus:ring-purple-500/20

// Button active
active:scale-95
active:bg-purple-800
```

### **Disabled States**

```tsx
// Disabled button
disabled:opacity-50
disabled:cursor-not-allowed
disabled:hover:bg-purple-600

// Disabled input
disabled:bg-white/5
disabled:text-white/40
disabled:cursor-not-allowed
```

---

## 📏 Espaciado y Tamaños

### **Spacing Scale**

```css
/* Tailwind spacing */
p-1: 0.25rem (4px)
p-2: 0.5rem (8px)
p-3: 0.75rem (12px)
p-4: 1rem (16px)
p-5: 1.25rem (20px)
p-6: 1.5rem (24px)
p-8: 2rem (32px)
p-10: 2.5rem (40px)
p-12: 3rem (48px)
```

### **Border Radius**

```css
rounded-sm: 0.125rem (2px)
rounded: 0.25rem (4px)
rounded-md: 0.375rem (6px)
rounded-lg: 0.5rem (8px)
rounded-xl: 0.75rem (12px)
rounded-2xl: 1rem (16px)
rounded-3xl: 1.5rem (24px)
rounded-full: 9999px
```

### **Font Sizes**

```css
text-xs: 0.75rem (12px)
text-sm: 0.875rem (14px)
text-base: 1rem (16px)
text-lg: 1.125rem (18px)
text-xl: 1.25rem (20px)
text-2xl: 1.5rem (24px)
text-3xl: 1.875rem (30px)
text-4xl: 2.25rem (36px)
```

---

## 🎬 Animaciones

### **Durations**

```css
/* Rápidas (micro-interacciones) */
duration-150: 150ms

/* Normales (hover, focus) */
duration-200: 200ms
duration-300: 300ms

/* Lentas (transiciones de página) */
duration-500: 500ms
```

### **Easing**

```css
/* Default */
ease-in-out

/* Suave */
ease-out

/* Snappy */
ease-in
```

### **Motion (Framer Motion)**

```typescript
// Scroll reveal
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.2 }}

// Hover (cards)
whileHover={{ scale: 1.02, y: -4 }}
transition={{ type: "spring", stiffness: 400, damping: 17 }}

// Hover (buttons)
whileHover={{ scale: 1.02 }}
whileTap={{ scale: 0.98 }}

// Spring animation
transition={{ type: "spring", stiffness: 400, damping: 17 }}
```

---

## 🌓 Dark Mode

El sistema está diseñado principalmente para dark mode, pero soporta light mode:

### **Dark Mode (Default)**

```css
/* Background */
bg-zinc-950

/* Text */
text-white
text-white/60

/* Cards */
bg-white/5
border-white/10
```

### **Light Mode**

```css
/* Background */
bg-white

/* Text */
text-zinc-900
text-zinc-600

/* Cards */
bg-zinc-50
border-zinc-200
```

---

## 📱 Responsive

### **Breakpoints**

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### **Uso**

```tsx
className="
  grid
  grid-cols-1
  md:grid-cols-2
  lg:grid-cols-3
  xl:grid-cols-4
  gap-4
"
```

---

## 🎨 Ejemplos Completos

### **Card Completo**

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.3 }}
  className="
    relative
    bg-white/5
    backdrop-blur-sm
    border border-white/10
    rounded-lg
    p-6
    overflow-hidden
  "
  style={{
    background: `
      radial-gradient(circle at 100% 0%, oklch(62.7% 0.265 303.9 / 0.1) 0%, transparent 50%),
      rgba(255, 255, 255, 0.05)
    `
  }}
>
  <h3 className="text-xl font-bold text-white mb-2">
    Título
  </h3>
  <p className="text-white/60">
    Descripción del card
  </p>
</motion.div>
```

### **Botón Completo**

```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="
    px-6 py-3
    bg-purple-600
    hover:bg-purple-700
    text-white
    rounded-lg
    font-medium
    transition-colors
    flex items-center gap-2
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
>
  <Icon className="w-5 h-5" />
  Acción
</motion.button>
```

---

**Fecha de creación**: 2025-11-14
**Última actualización**: 2025-11-14
**Versión**: 1.0.0
**Estado**: 🎨 Design System establecido
