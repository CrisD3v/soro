# 🧩 Guía de Componentes

## 📋 Índice
- [Atoms](#atoms)
- [Molecules](#molecules)
- [Organisms](#organisms)
- [Templates](#templates)
- [Uso y Ejemplos](#uso-y-ejemplos)

---

## Atoms

### Logo

Componente de logo animado de la aplicación.

**Props:**
```typescript
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Uso:**
```tsx
import { Logo } from '@/components/atoms/Logo/Logo';

<Logo size="md" />
```

**Características:**
- Animación de entrada con motion
- Tres tamaños predefinidos
- Colores morados del tema

---

### ThemeToggle

Botón para alternar entre modo claro y oscuro.

**Props:**
```typescript
interface ThemeToggleProps {
  className?: string;
}
```

**Uso:**
```tsx
import { ThemeToggle } from '@/components/atoms/ThemeToggle/ThemeToggle';

<ThemeToggle />
```

**Características:**
- Animación de rotación al cambiar
- Iconos de sol/luna
- Persiste preferencia en localStorage
- Integrado con useTheme hook

---

## Molecules

### FormField

Wrapper para inputs con label y mensaje de error.

**Props:**
```typescript
interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  htmlFor?: string;
  className?: string;
}
```

**Uso:**
```tsx
import { FormField } from '@/components/molecules/FormField/FormField';

<FormField
  label="Email"
  error={errors.email?.message}
  required
  htmlFor="email"
>
  <input id="email" type="email" />
</FormField>
```

**Características:**
- Animación de entrada para errores
- Indicador visual de campo requerido
- Asociación automática label-input
- Soporte dark mode

---

### PasswordInput

Input de contraseña con toggle de visibilidad.

**Props:**
```typescript
interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: boolean;
}
```

**Uso:**
```tsx
import { PasswordInput } from '@/components/molecules/PasswordInput/PasswordInput';

<PasswordInput
  placeholder="••••••••"
  error={!!errors.password}
/>
```

**Características:**
- Toggle animado de visibilidad
- Iconos de ojo/ojo tachado
- Estados de error
- Accesibilidad (aria-label)

---

## Organisms

### LoginForm

Formulario completo de inicio de sesión.

**Props:**
```typescript
interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
  onSwitchToReset?: () => void;
}
```

**Uso:**
```tsx
import { LoginForm } from '@/components/organisms/LoginForm/LoginForm';

<LoginForm
  onSuccess={() => router.push('/dashboard')}
  onSwitchToRegister={() => setView('register')}
  onSwitchToReset={() => setView('reset')}
/>
```

**Características:**
- Validación con Zod
- Integración con TanStack Query
- Manejo de errores de API
- Animaciones de entrada/salida
- Loading state

---

### RegisterForm

Formulario completo de registro de usuario.

**Props:**
```typescript
interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}
```

**Uso:**
```tsx
import { RegisterForm } from '@/components/organisms/RegisterForm/RegisterForm';

<RegisterForm
  onSuccess={() => setView('login')}
  onSwitchToLogin={() => setView('login')}
/>
```

**Características:**
- Validación completa de datos
- Campos de documento y teléfono
- Selector de tipo de documento
- Grid responsive
- Validación de formato de teléfono colombiano

---

### ResetPasswordForm

Formulario para solicitar recuperación de contraseña.

**Props:**
```typescript
interface ResetPasswordFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}
```

**Uso:**
```tsx
import { ResetPasswordForm } from '@/components/organisms/ResetPasswordForm/ResetPasswordForm';

<ResetPasswordForm
  onSuccess={() => setView('login')}
  onSwitchToLogin={() => setView('login')}
/>
```

**Características:**
- Validación de email
- Mensaje de éxito
- Botón de volver al login
- Manejo de errores

---

## Templates

### AuthTemplate

Template principal para vistas de autenticación.

**Props:**
```typescript
interface AuthTemplateProps {
  initialView?: 'login' | 'register' | 'reset';
  onAuthSuccess?: () => void;
}
```

**Uso:**
```tsx
import { AuthTemplate } from '@/components/templates/AuthTemplate/AuthTemplate';

<AuthTemplate
  initialView="login"
  onAuthSuccess={() => router.push('/')}
/>
```

**Características:**
- Compound Component Pattern
- Transiciones animadas entre vistas
- ThemeToggle integrado
- Diseño responsive
- Gradiente de fondo morado

---

## Uso y Ejemplos

### Ejemplo Completo: Página de Auth

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { AuthTemplate } from '@/components/templates/AuthTemplate/AuthTemplate';

export default function AuthPage() {
  const router = useRouter();

  return (
    <AuthTemplate
      initialView="login"
      onAuthSuccess={() => router.push('/dashboard')}
    />
  );
}
```

### Ejemplo: Formulario Personalizado

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField } from '@/components/molecules/FormField/FormField';
import { PasswordInput } from '@/components/molecules/PasswordInput/PasswordInput';
import { loginSchema } from '@/lib/utils/validators';

export function CustomLoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        label="Email"
        error={errors.email?.message}
        required
      >
        <input
          type="email"
          {...register('email')}
        />
      </FormField>

      <FormField
        label="Contraseña"
        error={errors.password?.message}
        required
      >
        <PasswordInput
          error={!!errors.password}
          {...register('password')}
        />
      </FormField>

      <button type="submit">Iniciar Sesión</button>
    </form>
  );
}
```

### Ejemplo: Uso de Hooks

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth/useAuth';
import { useTheme } from '@/hooks/useTheme/useTheme';

export function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!isAuthenticated) {
    return <div>No autenticado</div>;
  }

  return (
    <div>
      <h1>Hola, {user?.name}</h1>
      <p>Tema actual: {theme}</p>
      <button onClick={toggleTheme}>Cambiar tema</button>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
}
```

---

## Testing

Todos los componentes tienen tests en `src/__tests__/`:

```bash
# Ejecutar todos los tests
pnpm test

# Ejecutar tests con UI
pnpm test:ui

# Ejecutar tests con coverage
pnpm test:coverage
```

## Storybook

Ver todos los componentes en Storybook:

```bash
pnpm storybook
```

Navega a `http://localhost:6006`


---

## Dashboard Components

### Templates

#### DashboardLayout

Layout principal del dashboard con sidebar y topbar.

**Ubicación**: `src/components/templates/DashboardLayout/`

**Props**:
```typescript
interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}
```

**Características**:
- Sidebar colapsable
- TopBar con empresa activa
- Background con degradado sutil
- Responsive completo
- Dark/light mode

**Uso**:
```tsx
<DashboardLayout>
  <YourPageContent />
</DashboardLayout>
```

### Organisms

#### Sidebar

Navegación lateral colapsable con tooltips.

**Ubicación**: `src/components/organisms/Sidebar/`

**Props**:
```typescript
interface SidebarProps {
  groups: SidebarGroup[];
  isCollapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}
```

**Características**:
- Colapsable con animación
- Tooltips en modo colapsado
- Grupos de navegación
- Badges para notificaciones
- Scroll personalizado

#### TopBar

Barra superior con empresa activa y user menu.

**Ubicación**: `src/components/organisms/TopBar/`

**Props**:
```typescript
interface TopBarProps {
  companyName: string;
  userName: string;
  userAvatar?: string;
  notificationCount?: number;
  breadcrumbs?: BreadcrumbItem[];
  onLogout?: () => void;
  className?: string;
}
```

**Características**:
- Nombre de empresa destacado
- Breadcrumbs dinámicos
- Theme toggle
- Notificaciones
- User menu dropdown
- Selector de idioma

#### InventorySummaryCard

Card de resumen de inventario con progress bar.

**Ubicación**: `src/components/organisms/InventorySummaryCard/`

**Props**:
```typescript
interface InventorySummaryCardProps {
  totalMaterials: number;
  lowStockCount: number;
  stockLevel: number; // 0-100
  delay?: number;
  className?: string;
}
```

**Características**:
- Progress bar con colores dinámicos
- Alertas de stock bajo
- Gradiente sutil en background
- Botón de acción rápida

#### RecentAssignmentsCard

Card de asignaciones recientes.

**Ubicación**: `src/components/organisms/RecentAssignmentsCard/`

**Props**:
```typescript
interface RecentAssignmentsCardProps {
  assignments: Assignment[];
  delay?: number;
  className?: string;
}
```

**Características**:
- Lista de asignaciones
- Estados con badges
- Scroll personalizado
- Trazabilidad completa

#### NotificationsCard

Card de notificaciones automáticas.

**Ubicación**: `src/components/organisms/NotificationsCard/`

**Props**:
```typescript
interface NotificationsCardProps {
  notifications: Notification[];
  delay?: number;
  className?: string;
}
```

**Características**:
- Tipos: alert, info, success
- Iconos dinámicos
- Indicador de no leídas
- Scroll personalizado

#### MovementHistoryCard

Card de historial de movimientos con tabla filtrable.

**Ubicación**: `src/components/organisms/MovementHistoryCard/`

**Props**:
```typescript
interface MovementHistoryCardProps {
  movements: Movement[];
  delay?: number;
  className?: string;
}
```

**Características**:
- Tabla filtrable
- Tipos: entrada, salida, transferencia
- Estados con badges
- Iconos de movimiento

### Molecules

#### StatCard

Card de estadísticas con animaciones spring.

**Ubicación**: `src/components/molecules/StatCard/`

**Props**:
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: 'purple' | 'cyan' | 'red' | 'green' | 'orange';
  delay?: number;
  className?: string;
}
```

**Características**:
- Animaciones spring (scale 1.02)
- Indicadores de tendencia
- Colores personalizables
- Gradiente en background

**Uso**:
```tsx
<StatCard
  title="Total Materiales"
  value="1,234"
  icon={<Package className="w-6 h-6" />}
  trend="up"
  trendValue="+12%"
  color="purple"
/>
```

---

## Landing Components

### Organisms

#### HeroSection

Sección hero de la landing page.

**Ubicación**: `src/components/organisms/HeroSection/`

**Características**:
- Animaciones de entrada
- Scroll indicator funcional
- CTAs principales
- Responsive

#### FeaturesSection

Sección de características con grid 2x3.

**Ubicación**: `src/components/organisms/FeaturesSection/`

**Características**:
- Grid responsive
- FeatureCards animadas
- Botón demo con outline
- Scroll reveal

#### PricingSection

Sección de planes de precios.

**Ubicación**: `src/components/organisms/PricingSection/`

**Características**:
- 3 planes
- Plan popular destacado
- Cards alineadas
- Hover effects

#### TestimonialsSection

Sección de testimonios.

**Ubicación**: `src/components/organisms/TestimonialsSection/`

**Características**:
- Grid de testimonios
- Avatares
- Ratings
- Animaciones staggered

### Molecules

#### FeatureCard

Card de característica con icono.

**Ubicación**: `src/components/molecules/FeatureCard/`

**Props**:
```typescript
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
  className?: string;
}
```

**Características**:
- Icono con gradiente
- Animaciones hover
- Scroll reveal
- Responsive

#### NavBar

Barra de navegación de la landing.

**Ubicación**: `src/components/molecules/NavBar/`

**Características**:
- Scroll detection
- Logo
- Links de navegación
- CTAs
- Theme toggle

---

## Hooks

### useDashboard

Hook para gestión del estado del dashboard.

**Ubicación**: `src/hooks/useDashboard/`

**Retorna**:
```typescript
interface UseDashboardReturn {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}
```

**Uso**:
```tsx
const { stats, isLoading, error, refetch } = useDashboard();
```

### useScrollPosition

Hook para detectar posición del scroll.

**Ubicación**: `src/hooks/useScrollPosition/`

**Retorna**:
```typescript
interface UseScrollPositionReturn {
  scrollY: number;
  scrollDirection: 'up' | 'down' | null;
}
```

### useScrollReveal

Hook para animaciones en scroll.

**Ubicación**: `src/hooks/useScrollReveal/`

**Retorna**:
```typescript
interface UseScrollRevealReturn {
  ref: RefObject<HTMLElement>;
  isVisible: boolean;
}
```

---

## Context

### DashboardContext

Context para estado global del dashboard.

**Ubicación**: `src/context/DashboardContext.tsx`

**Valores**:
```typescript
interface DashboardContextType {
  activeCompany: string;
  setActiveCompany: (company: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}
```

**Uso**:
```tsx
const { activeCompany, sidebarCollapsed } = useDashboardContext();
```

---

## Estilos Globales

### Scrollbar Personalizado

Clase utility para scrollbars elegantes.

```css
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}
```

**Uso**:
```tsx
<div className="overflow-y-auto scrollbar-thin">
  {/* Content */}
</div>
```

### Gradiente Radial

Clase utility para gradientes circulares.

```css
.bg-gradient-radial {
  background-image: radial-gradient(circle, var(--tw-gradient-stops));
}
```

**Uso**:
```tsx
<div className="bg-gradient-radial from-purple-500/10 to-transparent">
  {/* Content */}
</div>
```

---

## Mejores Prácticas Dashboard

### Animaciones

- **StatCards**: Usar `whileHover={{ scale: 1.02 }}` + `whileTap={{ scale: 0.98 }}`
- **Cards grandes**: Sin hover, solo scroll reveal
- **Durations**: 150-300ms para profesionalismo
- **Spring**: Para efectos dinámicos

### Layout

- **Gaps**: `gap-4 lg:gap-6` para StatCards, `gap-6` para cards grandes
- **Grid**: `sm:grid-cols-2 lg:grid-cols-4` para StatCards
- **Responsive**: `xl:grid-cols-2` para cards grandes

### Colores

- **Purple**: Inventario, principal
- **Cyan**: Asignaciones, secundario
- **Orange**: Notificaciones, alertas
- **Red**: Alertas críticas
- **Green**: Success, óptimo

### Delays

- Secuenciales: 0, 0.05, 0.1, 0.15 para StatCards
- Escalonados: 0.2, 0.25, 0.3, 0.35 para cards grandes
