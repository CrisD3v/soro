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
