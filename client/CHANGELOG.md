# Changelog

Todos los cambios notables del proyecto serán documentados en este archivo.

## [1.4.0] - 2024-11-11

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

## [1.3.0] - 2024-11-11

### ✅ Completado

#### Documentación
- ARCHITECTURE.md - Arquitectura y patrones
- COMPONENTS.md - Guía de componentes
- API_INTEGRATION.md - Integración con backend
- README.md completo con instrucciones

## [1.2.0] - 2024-11-11

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

## [1.1.0] - 2024-11-11

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

## [1.0.0] - 2024-11-11

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

## Request ID

```
REQUEST-ID: AUTH-FORMS-v1.4.0-20241111
Context: API_DOCUMENTATION.md + package.json
Scope: Authentication Forms + API Integration + Tests + Storybook
Library: motion v12.23.24
Types: Co-located with components/modules
Status: ✅ COMPLETED
```

## Próximas Versiones

### [1.5.0] - Pendiente
- Implementar módulos de usuarios
- Implementar módulos de empresas
- Implementar módulos de roles
- Agregar más tests de integración

### [1.6.0] - Pendiente
- Middleware de autenticación
- Refresh token automático
- Protected routes
- Manejo de sesiones expiradas

### [1.7.0] - Pendiente
- Internacionalización (i18n)
- Más animaciones
- Optimizaciones de rendimiento
- SEO improvements
