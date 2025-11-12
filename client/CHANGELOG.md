# Changelog

Todos los cambios notables del proyecto serán documentados en este archivo.

## [2.0.0] - 2025-11-11

### ✅ Completado - Dashboard SORO

#### Dashboard Layout
- DashboardLayout template con sidebar y topbar
- Sidebar colapsable con tooltips
- TopBar con nombre de empresa y user menu
- Background con degradado sutil en esquina
- Responsive completo (mobile, tablet, desktop)
- Dark/light mode integrado

#### Componentes Dashboard
- **StatCard**: KPI cards con animaciones spring (scale 1.02)
- **InventorySummaryCard**: Resumen de inventario con progress bar
- **RecentAssignmentsCard**: Lista de asignaciones recientes
- **NotificationsCard**: Alertas automáticas del sistema
- **MovementHistoryCard**: Historial con tabla filtrable
- Diseño inspirado en FeatureCard con gradientessutiles

#### Navegación
- Sidebar con 3 grupos: Principal, Gestión, Sistema
- Tooltips en sidebar colapsado (shadcn/ui)
- Iconos con lucide-react
- Badges para notificaciones
- Animaciones smooth en navegación

#### APIs Integradas
- **User API**: CRUD completo de usuarios
- **Company API**: CRUD de empresas con jerarquía
- Refresh token automático en interceptor
- Repository pattern implementado

#### Middleware y Seguridad
- Middleware de autenticación en rutas /dashboard
- Refresh token automático
- Protected routes
- Redirección con preservación de URL

#### Hooks y Context
- **useDashboard**: Estado global del dashboard
- **DashboardContext**: Provider para empresa activa
- **useScrollPosition**: Detección de scroll
- **useScrollReveal**: Animaciones en scroll

#### Estilos y Animaciones
- Scrollbar personalizado (.scrollbar-thin)
- Gradiente radial utility
- Animaciones optimizadas (150-300ms)
- Hover effects profesionales
- Spring animations en StatCards

## [1.5.0] - 2025-11-11

### ✅ Completado - Landing Page

#### Landing Page Completa
- HeroSection con animaciones y scroll indicator
- FeaturesSection con grid 2x3
- PricingSection con 3 planes
- TestimonialsSection con carrusel
- NavBar con navegación smooth
- Footer completo

#### Componentes Landing
- **FeatureCard**: Cards con iconos y animaciones
- **NavLink**: Links de navegación con active state
- **NavBar**: Navegación con scroll detection
- Animaciones con motion en todas las secciones

#### Mejoras UX Landing
- Animaciones de hover optimizadas (200ms)
- Scroll indicator funcional
- Botón demo con estilo outline
- Cards de pricing alineadas
- Cursor pointer en todos los botones

## [1.4.0] - 2025-11-11

### ✅ Completado

#### Tests Implementados
- Tests para componentes atoms (Logo)
- Tests para componentes molecules (FormField, PasswordInput)
- Tests para hooks (useTheme)
- Configuración de Vitest con jsdom
- Mock de window.matchMedia para tests
- Coverage configurado

#### Storybook
- Stories para atoms (Logo, ThemeToggle)
- Stories para molecules (FormField, PasswordInput)
- Configuración de Storybook con Next.js
- Preview con estilos globales

## [1.3.0] - 2025-11-11

### ✅ Completado

#### Documentación
- ARCHITECTURE.md - Arquitectura y patrones
- COMPONENTS.md - Guía de componentes
- API_INTEGRATION.md - Integración con backend
- README.md completo con instrucciones

## [1.2.0] - 2025-11-11

### ✅ Completado

#### API Integration
- Cliente HTTP base con interceptors
- Endpoints de autenticación (login, register, refresh, logout, reset)
- TanStack Query hooks (useLogin, useRegister, useRefreshToken, useLogout, useResetPassword)
- Repository Pattern para localStorage
- Factory Pattern para API clients
- Manejo de errores tipado

#### Types
- Types co-localizados por componente/módulo
- Types globales en lib/types/common.types.ts
- Types para API en lib/api/auth.types.ts
- Types para queries en lib/queries/auth.queries.types.ts

## [1.1.0] - 2025-11-11

### ✅ Completado

#### Componentes Atoms
- Logo con animación de entrada
- ThemeToggle con transiciones suaves

#### Componentes Molecules
- FormField con animación de errores
- PasswordInput con toggle de visibilidad

#### Componentes Organisms
- LoginForm con validación completa
- RegisterForm con todos los campos
- ResetPasswordForm con manejo de éxito

#### Componentes Templates
- AuthTemplate con Compound Component Pattern
- Transiciones animadas entre vistas
- Diseño responsive

#### Hooks
- useTheme para dark/light mode
- useAuth para estado de autenticación

## [1.0.0] - 2025-11-11

### ✅ Completado

#### Configuración Inicial
- Next.js 16 con App Router
- React 19
- Tailwind CSS 4
- TypeScript 5
- motion v12.23.24
- TanStack Query 5
- React Hook Form + Zod
- Vitest + Testing Library
- Storybook 10

#### Estructura
- Atomic Design implementado
- Carpetas organizadas por patrón
- Types co-localizados
- Configuración de tests
- Configuración de Storybook

#### Tema
- Colores morados oklch(62.7% 0.265 303.9)
- Dark mode completo
- CSS variables configuradas
- Transiciones suaves

---

## Request IDs

```
REQUEST-ID: DASHBOARD-v2.0.0-20251111
Context: Dashboard completo con UX mejorada
Scope: Layout + Components + APIs + Middleware + Animations
Library: motion v12.23.24 + shadcn/ui
Status: ✅ COMPLETED

REQUEST-ID: LANDING-v1.5.0-20251111
Context: Landing page completa
Scope: Hero + Features + Pricing + Testimonials
Library: motion v12.23.24
Status: ✅ COMPLETED

REQUEST-ID: AUTH-FORMS-v1.4.0-20241111
Context: API_DOCUMENTATION.md + package.json
Scope: Authentication Forms + API Integration + Tests + Storybook
Library: motion v12.23.24
Types: Co-located with components/modules
Status: ✅ COMPLETED
```

## Próximas Versiones

### [2.1.0] - Pendiente
- Implementar páginas de inventario
- Implementar páginas de empleados
- Implementar páginas de proyectos
- Agregar más tests de integración

### [2.2.0] - Pendiente
- Implementar reportes y analytics
- Gráficos interactivos
- Exportación de datos
- Filtros avanzados

### [2.3.0] - Pendiente
- Internacionalización (i18n)
- Notificaciones en tiempo real
- Optimizaciones de rendimiento
- SEO improvements
