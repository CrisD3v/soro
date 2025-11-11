# 🚀 SORO - Sistema de Gestión

Sistema de gestión empresarial con autenticación completa, construido con Next.js 16, React 19 y Tailwind CSS 4.

## ✨ Características

- 🎨 **Atomic Design** - Componentes organizados y escalables
- 🎭 **Patrones de Diseño** - Factory, Repository, Compound Components
- 🌈 **Animaciones Suaves** - motion v12 para transiciones fluidas
- 🌓 **Dark Mode** - Soporte completo con persistencia
- 📱 **Responsive** - Diseño mobile-first
- 🔐 **Autenticación Completa** - Login, registro y recuperación de contraseña
- 🧪 **Testing** - Vitest + Testing Library
- 📚 **Storybook** - Documentación interactiva de componentes
- 🎯 **TypeScript** - Tipado estricto
- 🔄 **TanStack Query** - Gestión de estado del servidor

## 🎨 Tema

Paleta de colores morados basada en `oklch(62.7% 0.265 303.9)` con soporte completo para modo claro y oscuro.

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.local.example .env.local

# Editar .env.local con tu configuración
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🚀 Uso

### Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm dev

# Abrir en http://localhost:3001
```

### Testing

```bash
# Ejecutar tests
pnpm test

# Tests con UI interactiva
pnpm test:ui

# Tests con coverage
pnpm test:coverage
```

### Storybook

```bash
# Iniciar Storybook
pnpm storybook

# Abrir en http://localhost:6006
```

### Build

```bash
# Crear build de producción
pnpm build

# Iniciar servidor de producción
pnpm start
```

## 📁 Estructura del Proyecto

```
src/
├── app/                          # Next.js App Router
│   ├── auth/                     # Página de autenticación
│   ├── layout.tsx                # Layout principal
│   └── globals.css               # Estilos globales
│
├── components/                   # Componentes UI (Atomic Design)
│   ├── ui/                       # shadcn/ui components
│   ├── atoms/                    # Logo, ThemeToggle
│   ├── molecules/                # FormField, PasswordInput
│   ├── organisms/                # LoginForm, RegisterForm, ResetPasswordForm
│   └── templates/                # AuthTemplate
│
├── lib/                          # Lógica de negocio
│   ├── api/                      # API clients y endpoints
│   ├── queries/                  # TanStack Query hooks
│   ├── patterns/                 # Factory, Repository patterns
│   ├── providers/                # React providers
│   ├── types/                    # Types globales
│   └── utils/                    # Validadores y utilidades
│
├── hooks/                        # Custom hooks
│   ├── useTheme/                 # Dark/Light mode
│   └── useAuth/                  # Estado de autenticación
│
├── docs/                         # Documentación
│   ├── ARCHITECTURE.md           # Arquitectura del proyecto
│   ├── COMPONENTS.md             # Guía de componentes
│   └── API_INTEGRATION.md        # Integración con API
│
├── stories/                      # Storybook stories
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
│
└── __tests__/                    # Tests con Vitest
    ├── atoms/
    ├── molecules/
    ├── organisms/
    └── hooks/
```

## 🎯 Componentes Principales

### Atoms
- **Logo** - Logo animado de la aplicación
- **ThemeToggle** - Botón para cambiar tema

### Molecules
- **FormField** - Wrapper para inputs con label y error
- **PasswordInput** - Input de contraseña con toggle de visibilidad

### Organisms
- **LoginForm** - Formulario de inicio de sesión
- **RegisterForm** - Formulario de registro
- **ResetPasswordForm** - Formulario de recuperación de contraseña

### Templates
- **AuthTemplate** - Template principal para autenticación

## 🔌 API

El proyecto consume la API SORO. Ver [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) para detalles completos.

### Endpoints Principales

- `POST /auth/login` - Iniciar sesión
- `POST /users` - Registrar usuario
- `POST /auth/refresh` - Renovar token
- `POST /auth/logout` - Cerrar sesión

## 🧪 Testing

Tests organizados por tipo de componente:

```bash
src/__tests__/
├── atoms/
│   └── Logo.test.tsx
├── molecules/
│   ├── FormField.test.tsx
│   └── PasswordInput.test.tsx
└── hooks/
    └── useTheme.test.tsx
```

## 📚 Documentación

- [Arquitectura](./src/docs/ARCHITECTURE.md) - Patrones y estructura
- [Componentes](./src/docs/COMPONENTS.md) - Guía de uso de componentes
- [API Integration](./src/docs/API_INTEGRATION.md) - Integración con backend

## 🎨 Storybook

Todos los componentes están documentados en Storybook con ejemplos interactivos:

```bash
pnpm storybook
```

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4
- **Animaciones**: motion 12.23.24
- **Forms**: React Hook Form + Zod
- **State**: TanStack Query 5
- **Testing**: Vitest + Testing Library
- **Docs**: Storybook 10
- **Icons**: Lucide React

## 📝 Convenciones

### Nomenclatura
- Componentes: `PascalCase`
- Hooks: `camelCase` con prefijo `use`
- Types: `PascalCase` con sufijo descriptivo
- Archivos: Mismo nombre que el componente/hook

### Organización
- Cada componente/hook en su propia carpeta
- Archivo `.types.ts` para types
- Tests co-localizados
- Stories en carpeta `stories/`

### Comentarios
- Documentación en español
- Términos técnicos en inglés
- JSDoc para funciones públicas

## 🔐 Seguridad

- Tokens almacenados en localStorage
- Access token expira en 15 minutos
- Refresh token expira en 7 días
- Validación de inputs con Zod
- Sanitización de datos

## 🚧 Roadmap

- [ ] Implementar módulos de usuarios, empresas y roles
- [ ] Agregar middleware de autenticación
- [ ] Implementar refresh token automático
- [ ] Agregar más tests de integración
- [ ] Implementar SSR para SEO
- [ ] Agregar internacionalización (i18n)

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Equipo

Desarrollado por el equipo de SORO.

---

## 🆔 Request ID

```
REQUEST-ID: AUTH-FORMS-v1.0.0-20241111
Context: API_DOCUMENTATION.md + package.json
Scope: Authentication Forms + API Integration
Library: motion v12.23.24
Types: Co-located with components/modules
```

## 📌 Versionamiento

```
v1.0.0 - Initial setup ✅
v1.1.0 - Components implementation ✅
v1.2.0 - API integration ✅
v1.3.0 - Storybook stories ✅
v1.4.0 - Tests implementation ✅
```

---

**¿Necesitas ayuda?** Consulta la [documentación](./src/docs/) o contacta al equipo.
