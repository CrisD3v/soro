# 🏗️ Arquitectura del Proyecto

## 📋 Índice
- [Visión General](#visión-general)
- [Patrones de Diseño](#patrones-de-diseño)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Flujo de Datos](#flujo-de-datos)
- [Convenciones](#convenciones)

---

## Visión General

Este proyecto implementa una arquitectura basada en **Atomic Design** combinada con múltiples patrones de diseño para garantizar escalabilidad, mantenibilidad y reutilización de código.

### Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS 4
- **Animaciones**: motion v12
- **State Management**: TanStack Query v5
- **Validación**: Zod + React Hook Form
- **Testing**: Vitest + Testing Library
- **Documentación**: Storybook

---

## Patrones de Diseño

### 1. Atomic Design

Organización de componentes en niveles de complejidad:

```
Atoms → Molecules → Organisms → Templates → Pages
```

**Atoms** (Componentes básicos)
- Logo
- ThemeToggle
- Iconos individuales

**Molecules** (Combinación de atoms)
- FormField (label + input + error)
- PasswordInput (input + toggle visibility)

**Organisms** (Componentes complejos)
- LoginForm
- RegisterForm
- ResetPasswordForm

**Templates** (Layouts)
- AuthTemplate

**Pages** (Vistas completas)
- /auth

### 2. Compound Component Pattern

Implementado en `AuthTemplate` para manejar múltiples vistas de autenticación con estado compartido.

```typescript
<AuthTemplate initialView="login">
  <LoginForm />
  <RegisterForm />
  <ResetPasswordForm />
</AuthTemplate>
```

### 3. Factory Pattern

`ApiClientFactory` para crear y gestionar instancias de clientes API.

```typescript
const authClient = ApiClientFactory.getClient('auth');
ApiClientFactory.setAuthToken(token);
```

### 4. Repository Pattern

`AuthRepository` abstrae el almacenamiento de datos (localStorage) del resto de la aplicación.

```typescript
authRepository.saveSession(loginResponse);
authRepository.getAccessToken();
authRepository.clearSession();
```

---

## Estructura de Carpetas

```
src/
├── app/                          # Next.js App Router
│   ├── auth/                     # Página de autenticación
│   ├── layout.tsx                # Layout principal
│   └── globals.css               # Estilos globales
│
├── components/                   # Componentes UI (Atomic Design)
│   ├── ui/                       # shadcn/ui components
│   ├── atoms/                    # Componentes básicos
│   │   ├── Logo/
│   │   │   ├── Logo.tsx
│   │   │   └── Logo.types.ts
│   │   └── ThemeToggle/
│   │       ├── ThemeToggle.tsx
│   │       └── ThemeToggle.types.ts
│   ├── molecules/                # Componentes compuestos
│   │   ├── FormField/
│   │   └── PasswordInput/
│   ├── organisms/                # Componentes complejos
│   │   ├── LoginForm/
│   │   ├── RegisterForm/
│   │   └── ResetPasswordForm/
│   └── templates/                # Layouts y templates
│       └── AuthTemplate/
│
├── lib/                          # Lógica de negocio
│   ├── api/                      # API clients
│   │   ├── client.ts             # Cliente HTTP base
│   │   ├── auth.api.ts           # Endpoints de auth
│   │   └── auth.types.ts         # Types de auth API
│   ├── queries/                  # TanStack Query hooks
│   │   ├── auth.queries.ts
│   │   └── auth.queries.types.ts
│   ├── patterns/                 # Patrones de diseño
│   │   ├── factory/
│   │   │   └── api-client.factory.ts
│   │   └── repository/
│   │       └── auth.repository.ts
│   ├── providers/                # React providers
│   │   └── QueryProvider.tsx
│   ├── types/                    # Types globales
│   │   └── common.types.ts
│   └── utils/                    # Utilidades
│       └── validators.ts         # Schemas de Zod
│
├── hooks/                        # Custom hooks
│   ├── useTheme/
│   │   ├── useTheme.ts
│   │   └── useTheme.types.ts
│   └── useAuth/
│       ├── useAuth.ts
│       └── useAuth.types.ts
│
├── docs/                         # Documentación
│   ├── ARCHITECTURE.md
│   ├── COMPONENTS.md
│   └── API_INTEGRATION.md
│
├── stories/                      # Storybook stories
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
│
└── __tests__/                    # Tests con Vitest
    ├── setup.ts
    ├── atoms/
    ├── molecules/
    └── organisms/
```

---

## Flujo de Datos

### Autenticación

```
1. Usuario → LoginForm (organism)
2. LoginForm → useLogin (TanStack Query hook)
3. useLogin → authApi.login (API client)
4. authApi → apiClient.post (HTTP client)
5. Response → authRepository.saveSession (Repository)
6. authRepository → localStorage
7. ApiClientFactory.setAuthToken (Factory)
8. Success callback → Redirect
```

### Gestión de Estado

- **Server State**: TanStack Query (queries, mutations)
- **Client State**: React hooks (useState, useReducer)
- **Persistent State**: localStorage via Repository Pattern
- **Theme State**: useTheme hook + CSS variables

---

## Convenciones

### Nomenclatura

- **Componentes**: PascalCase (`LoginForm.tsx`)
- **Hooks**: camelCase con prefijo `use` (`useAuth.ts`)
- **Types**: PascalCase con sufijo `Props`, `Data`, etc. (`LoginFormProps`)
- **Constantes**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Funciones**: camelCase (`handleSubmit`)

### Organización de Archivos

Cada componente/hook tiene su propia carpeta con:
- Archivo principal (`.tsx` o `.ts`)
- Archivo de types (`.types.ts`)
- Tests (`.test.tsx`)
- Stories (`.stories.tsx`)

### Types

- Co-localizados con su módulo correspondiente
- Exportados desde archivos `.types.ts`
- Types globales en `lib/types/common.types.ts`

### Comentarios

- Documentación en español
- Términos técnicos en inglés (types, hooks, patterns)
- JSDoc para funciones públicas

```typescript
/**
 * Hook para manejar el estado de autenticación
 * @returns {UseAuthReturn} Estado y métodos de auth
 */
export const useAuth = (): UseAuthReturn => {
  // ...
}
```

### Animaciones

Todas las animaciones usan `motion` v12:

```typescript
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
```

### Colores

Tema morado basado en `oklch(62.7% 0.265 303.9)`:
- Definidos en `globals.css` como CSS variables
- Accesibles via Tailwind: `bg-purple-500`, `text-purple-400`
- Soporte dark mode automático

---

## Próximos Pasos

1. Implementar más módulos (users, companies, roles)
2. Agregar middleware de autenticación
3. Implementar refresh token automático
4. Agregar más tests de integración
5. Documentar componentes en Storybook


---

## Dashboard Architecture

### Layout Structure

```
DashboardLayout
├── Sidebar (fixed, colapsable)
│   ├── Logo / Toggle button
│   └── Navigation Groups
│       ├── Principal (Dashboard, Inventario, Notificaciones)
│       ├── Gestión (Empleados, Proyectos, Reportes)
│       └── Sistema (Ajustes)
├── TopBar (sticky)
│   ├── Company Name
│   ├── Breadcrumbs
│   └── Actions (Theme, Notifications, Language, User Menu)
└── Main Content
    ├── Page Header
    ├── KPI Stats Grid (4 StatCards)
    └── Content Grid (Cards grandes)
```

### State Management

#### Dashboard Context

```typescript
// Global state para dashboard
DashboardContext
├── activeCompany: string
├── setActiveCompany: (company: string) => void
├── sidebarCollapsed: boolean
└── setSidebarCollapsed: (collapsed: boolean) => void
```

#### Local State

- **Sidebar**: `isCollapsed` state
- **TopBar**: `showUserMenu`, `showNotifications` states
- **Cards**: Data fetching con TanStack Query

### Data Flow

```
API Layer (user.api.ts, company.api.ts)
    ↓
TanStack Query Hooks (useQuery, useMutation)
    ↓
Dashboard Components
    ↓
UI Updates
```

### Routing

```
/ (Landing)
├── /auth (Public)
│   ├── Login
│   ├── Register
│   └── Reset Password
└── /dashboard (Protected)
    ├── / (Overview)
    ├── /inventory
    ├── /employees
    ├── /projects
    ├── /reports
    └── /settings
```

### Middleware

```typescript
// src/middleware.ts
- Verifica accessToken en cookies
- Protege rutas /dashboard/*
- Redirige a /auth si no autenticado
- Preserva URL destino en query param
```

### API Integration

#### Endpoints

```typescript
// User API
GET    /users
GET    /users/:id
POST   /users
PATCH  /users/:id
POST   /users/:id/assign-role

// Company API
GET    /companies
GET    /companies/:id
POST   /companies
PATCH  /companies/:id
DELETE /companies/:id
POST   /companies/:id/restore
GET    /companies/:id/hierarchy
```

#### Interceptor

```typescript
// Refresh token automático
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Intenta refresh
      const refreshToken = getRefreshToken();
      const newToken = await refreshTokenApi(refreshToken);
      // Retry request con nuevo token
      return apiClient(originalRequest);
    }
  }
);
```

### Component Patterns

#### Dashboard Cards

Todas las cards grandes siguen este patrón:

```typescript
// 1. Gradiente sutil en esquina
<div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-{color}-500/10 to-transparent rounded-full blur-3xl" />

// 2. Header con icono
<div className="relative flex items-center justify-between mb-6">
  <div>
    <h3>Título</h3>
    <p>Descripción</p>
  </div>
  <div className="p-3 rounded-xl bg-gradient-to-br from-{color}-500 to-{color}-600 shadow-lg shadow-{color}-500/30">
    <Icon />
  </div>
</div>

// 3. Contenido con scroll
<div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
  {/* Items */}
</div>

// 4. Sin hover effect
// Solo scroll reveal animation
```

#### StatCards

```typescript
// Animaciones spring
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="cursor-pointer"
>
  {/* Content */}
</motion.div>
```

### Performance Optimizations

#### Animaciones

- **Durations**: 150-300ms (profesional)
- **Delays**: Secuenciales y cortos
- **Spring**: Solo en StatCards
- **Scroll reveal**: Una vez (viewport: { once: true })

#### Scrollbars

```css
/* Custom scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}
```

#### Background

```tsx
// Gradiente solo en esquina (no afecta performance)
<div className="fixed bottom-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-purple-500/10 via-purple-500/5 to-transparent pointer-events-none" />
```

### Responsive Breakpoints

```typescript
// Tailwind breakpoints
sm: '640px'   // Mobile landscape
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
2xl: '1536px' // Extra large

// Dashboard usage
- StatCards: sm:grid-cols-2 lg:grid-cols-4
- Cards grandes: xl:grid-cols-2
- Sidebar: Overlay en mobile, fixed en desktop
```

### Security

#### Protected Routes

```typescript
// middleware.ts
const protectedRoutes = ['/dashboard'];

if (isProtectedRoute && !token) {
  redirect('/auth?redirect=' + pathname);
}
```

#### Token Management

```typescript
// Tokens en localStorage
- accessToken: JWT de corta duración
- refreshToken: JWT de larga duración

// Refresh automático
- Interceptor detecta 401
- Llama a /auth/refresh
- Actualiza tokens
- Retry request original
```

### Testing Strategy

#### Unit Tests

```typescript
// Componentes
- StatCard.test.tsx
- Sidebar.test.tsx
- TopBar.test.tsx

// Hooks
- useDashboard.test.tsx
- useScrollPosition.test.tsx
```

#### Integration Tests

```typescript
// Flujos completos
- Dashboard flow
- Auth flow con refresh
- CRUD operations
```

### Deployment

```bash
# Build
pnpm build

# Output
.next/
├── static/
├── server/
└── standalone/

# Environment variables
NEXT_PUBLIC_API_URL=https://api.soro.com
```

### Monitoring

```typescript
// Logs en consola (desarrollo)
console.log('[Auth] Token refreshed successfully');
console.error('[Auth] Token refresh failed:', error);

// TODO: Implementar
- Sentry para error tracking
- Analytics para user behavior
- Performance monitoring
```

---

## Landing Page Architecture

### Structure

```
Landing Page
├── NavBar (sticky)
├── HeroSection
├── FeaturesSection (Grid 2x3)
├── PricingSection (3 planes)
├── TestimonialsSection
└── Footer
```

### Animations

```typescript
// Scroll reveal pattern
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.3, delay }}
>
```

### Navigation

```typescript
// Smooth scroll
<a href="#features" className="scroll-smooth">
  Features
</a>

// Scroll indicator
<button onClick={() => scrollTo('#features')}>
  <ChevronDown />
</button>
```

---

## Best Practices

### Component Organization

```
ComponentName/
├── ComponentName.tsx       # Component logic
├── ComponentName.types.ts  # TypeScript types
├── ComponentName.test.tsx  # Tests (opcional)
└── ComponentName.stories.tsx # Storybook (opcional)
```

### Naming Conventions

- **Components**: PascalCase (StatCard, DashboardLayout)
- **Files**: PascalCase para componentes, camelCase para utils
- **Props**: Descriptivos (companyName, notificationCount)
- **Hooks**: useNombre (useDashboard, useScrollPosition)

### Code Style

```typescript
// Imports ordenados
import { motion } from 'framer-motion';
import { Icon } from 'lucide-react';
import { Component } from '@/components';
import { hook } from '@/hooks';
import { util } from '@/lib';

// Props interface
interface ComponentProps {
  required: string;
  optional?: number;
  className?: string;
}

// Component
export const Component = ({ required, optional = 0, className = '' }: ComponentProps) => {
  // Hooks
  const { data } = useHook();

  // Handlers
  const handleClick = () => {};

  // Render
  return <div className={className}>{/* JSX */}</div>;
};
```

### Performance

- **Lazy loading**: Para rutas y componentes pesados
- **Memoization**: React.memo para componentes puros
- **Code splitting**: Automático con Next.js
- **Image optimization**: next/image
- **Font optimization**: next/font

### Accessibility

- **ARIA labels**: En botones y links
- **Keyboard navigation**: Tab, Enter, Escape
- **Focus visible**: Outline en elementos interactivos
- **Semantic HTML**: header, nav, main, footer
- **Alt text**: En todas las imágenes
