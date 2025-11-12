# 🚀 SORO - Sistema de Gestión Empresarial

Sistema de gestión empresarial completo con autenticación, dashboard interactivo y landing page, construido con Next.js 16, React 19 y Tailwind CSS 4.

## ✨ Características Principales

### 🎯 Dashboard Completo
- **Layout Profesional** - Sidebar colapsable + TopBar con empresa activa
- **KPI Cards** - 4 indicadores principales con animaciones spring
- **Gestión de Inventario** - Resumen con alertas y progress bars
- **Asignaciones** - Tracking de materiales asignados
- **Notificaciones** - Sistema de alertas automáticas
- **Historial** - Tabla filtrable de movimientos

### 🌐 Landing Page
- **Hero Section** - Con animaciones y scroll indicator funcional
- **Features** - Grid 2x3 con cards animadas
- **Pricing** - 3 planes con diseño profesional
- **Testimonials** - Sección de testimonios
- **Navegación** - NavBar con scroll detection

### 🔐 Autenticación
- **Login** - Con validación completa
- **Registro** - Formulario multi-campo
- **Recuperación** - Reset de contraseña
- **Refresh Token** - Automático en interceptor
- **Middleware** - Protección de rutas /dashboard

### 🎨 Diseño y UX
- **Atomic Design** - Componentes organizados y escalables
- **Animaciones Suaves** - motion v12 con spring effects
- **Dark Mode** - Soporte completo con persistencia
- **Responsive** - Mobile-first design
- **Tooltips** - shadcn/ui en sidebar colapsado
- **Scrollbar Personalizado** - Estilo elegante y sutil

### 🏗️ Arquitectura
- **Patrones de Diseño** - Factory, Repository, Compound Components
- **TypeScript** - Tipado estricto
- **TanStack Query** - Gestión de estado del servidor
- **API Integration** - User, Company, Auth endpoints
- **Context API** - DashboardContext para estado global

### 🧪 Testing y Documentación
- **Vitest** - Tests unitarios y de integración
- **Testing Library** - Tests de componentes
- **Storybook** - Documentación interactiva
- **Docs** - ARCHITECTURE.md, COMPONENTS.md, API_INTEGRATION.md

## 🎨 Tema

Paleta de colores morados basada en `oklch(62.7% 0.265 303.9)` con:
- Degradado sutil en esquina inferior derecha
- Soporte completo para modo claro y oscuro
- Gradientes personalizados por componente

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/CrisD3v/soro.git

# Navegar al directorio del cliente
cd soro/client

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

# Tests con UI
pnpm test:ui

# Coverage
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
client/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Landing page
│   │   ├── auth/              # Página de autenticación
│   │   └── dashboard/         # Dashboard principal
│   ├── components/            # Componentes Atomic Design
│   │   ├── atoms/            # Logo, ThemeToggle, NavLink
│   │   ├── molecules/        # FormField, PasswordInput, StatCard, FeatureCard
│   │   ├── organisms/        # Forms, Sidebar, TopBar, Cards grandes
│   │   ├── templates/        # AuthTemplate, DashboardLayout
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth/
│   │   ├── useTheme/
│   │   ├── useDashboard/
│   │   ├── useScrollPosition/
│   │   └── useScrollReveal/
│   ├── lib/                  # Utilidades y configuración
│   │   ├── api/             # API clients (auth, user, company)
│   │   ├── patterns/        # Factory, Repository
│   │   ├── queries/         # TanStack Query hooks
│   │   └── utils/           # Helpers y validadores
│   ├── context/             # React Context
│   │   └── DashboardContext.tsx
│   ├── docs/                # Documentación
│   │   ├── ARCHITECTURE.md
│   │   ├── COMPONENTS.md
│   │   └── API_INTEGRATION.md
│   └── __tests__/           # Tests
├── public/                   # Assets estáticos
├── .storybook/              # Configuración Storybook
└── vitest.config.ts         # Configuración Vitest
```

## 🎯 Rutas Principales

- `/` - Landing page
- `/auth` - Autenticación (login/register/reset)
- `/dashboard` - Dashboard principal (protegido)
- `/dashboard/inventory` - Gestión de inventario
- `/dashboard/employees` - Gestión de empleados
- `/dashboard/projects` - Gestión de proyectos
- `/dashboard/reports` - Reportes
- `/dashboard/settings` - Configuración

## 🔧 Tecnologías

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19
- **Estilos**: Tailwind CSS 4
- **Animaciones**: motion v12.23.24
- **Forms**: React Hook Form + Zod
- **State**: TanStack Query 5
- **Testing**: Vitest + Testing Library
- **Docs**: Storybook 10
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: lucide-react
- **TypeScript**: 5.x

## 📚 Documentación

- [Arquitectura](./src/docs/ARCHITECTURE.md) - Patrones y estructura
- [Componentes](./src/docs/COMPONENTS.md) - Guía de componentes
- [API Integration](./src/docs/API_INTEGRATION.md) - Integración con backend
- [Changelog](./CHANGELOG.md) - Historial de cambios

## 🎨 Componentes Destacados

### Dashboard
- **DashboardLayout** - Layout principal con sidebar y topbar
- **Sidebar** - Navegación colapsable con tooltips
- **TopBar** - Header con empresa activa y user menu
- **StatCard** - KPI cards con animaciones spring
- **InventorySummaryCard** - Resumen de inventario
- **MovementHistoryCard** - Historial con filtros

### Landing
- **HeroSection** - Hero con animaciones
- **FeaturesSection** - Grid de características
- **PricingSection** - Planes de precios
- **TestimonialsSection** - Testimonios

### Auth
- **LoginForm** - Formulario de login
- **RegisterForm** - Formulario de registro
- **ResetPasswordForm** - Recuperación de contraseña
- **AuthTemplate** - Template con compound components

## 🔐 Seguridad

- Middleware de autenticación en rutas protegidas
- Refresh token automático
- Tokens en localStorage
- Interceptor para manejo de 401
- Validación con Zod
- CSRF protection ready

## 🚀 Deployment

```bash
# Build
pnpm build

# El output estará en .next/
# Deployable en Vercel, Netlify, o cualquier plataforma Node.js
```

## 📝 Scripts Disponibles

```bash
pnpm dev          # Desarrollo
pnpm build        # Build producción
pnpm start        # Servidor producción
pnpm lint         # Linter
pnpm test         # Tests
pnpm test:ui      # Tests con UI
pnpm test:coverage # Coverage
pnpm storybook    # Storybook
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Equipo

Desarrollado por el equipo de SORO.

---

**Versión**: 2.0.0
**Última actualización**: 2025-11-11
**Estado**: ✅ En producción
