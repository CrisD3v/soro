# Changelog - SORO Frontend

Todos los cambios notables en el frontend de SORO serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

## [Unreleased]

### Added
- **Módulo de Events (100% Completo)**:
  - 1 página implementada (timeline de eventos)
  - Timeline visual de eventos del sistema
  - 19 tipos de eventos (usuarios, empresas, proyectos, tareas, deals, facturas, documentos, notificaciones)
  - 4 estados: Pendiente, Procesando, Completado, Fallido
  - Stats cards con métricas (total, pendientes, completados, fallidos)
  - Filtros por categoría y estado
  - Visualización de payload de eventos
  - Timestamps de creación y procesamiento
  - Iconos distintivos por estado
  - Auto-refresh cada 30 segundos
  - Colores distintivos por estado

- **Módulo de Health (100% Completo)**:
  - 1 página implementada (health check y monitoreo)
  - Estado general del sistema (uptime, versión, última verificación)
  - Monitoreo de servicios (estado, tiempo de respuesta, última verificación)
  - Recursos del sistema (CPU, memoria, disco, red)
  - Indicadores visuales de estado (saludable, degradado, no saludable)
  - Barras de progreso para uso de recursos
  - Formato de bytes y uptime
  - Auto-refresh cada 30 segundos
  - Colores distintivos por estado

- **Módulo de Metrics (100% Completo)**:
  - 1 página implementada (dashboard de métricas)
  - Dashboard completo con 8 secciones de métricas
  - Métricas de usuarios (total, activos, inactivos, nuevos)
  - Métricas de proyectos (total, activos, completados, tasa de completación)
  - Métricas de tareas (total, en progreso, completadas, tasa de completación)
  - Métricas de deals (total, ganados, valor total, tasa de éxito)
  - Métricas de facturas (total, monto, pagadas, tasa de cobro)
  - Métricas de documentos (total, tamaño, subidos este mes)
  - Métricas de performance (tiempo de respuesta, requests, tasa de error, uptime)
  - Filtros por período (día, semana, mes, año)
  - Formato de moneda y porcentajes
  - Animaciones escalonadas con motion

- **Módulo de Settings (100% Completo)**:
  - 3 páginas implementadas (lista, detalle, editar)
  - CRUD completo con validación
  - 6 categorías: General, Seguridad, Notificaciones, Facturación, Integraciones, Apariencia
  - Stats cards con métricas (total, públicas, privadas, categorías)
  - SettingForm con campos de clave, valor, descripción, categoría y visibilidad
  - Colores distintivos por categoría
  - Filtros por categoría y búsqueda
  - Gestión de configuraciones públicas y privadas

- **Módulo de Invoices (100% Completo)**:
  - 2 páginas implementadas (lista, detalle)
  - Context menu funcional con 2 opciones
  - Gestión completa de facturas
  - 5 estados: Borrador, Enviada, Pagada, Vencida, Cancelada
  - Stats cards con métricas financieras (total, monto, pagadas, vencidas)
  - Visualización de items de factura
  - Formato de moneda USD profesional
  - Cálculo automático de subtotal, impuestos y total

- **Módulo de Documents (100% Completo)**:
  - 1 página implementada (lista)
  - Context menu funcional con 3 opciones
  - Gestión de archivos y documentos
  - Stats cards con métricas de archivos (total, tamaño, PDFs, imágenes)
  - Formato de tamaño en B/KB/MB
  - Descarga y visualización de documentos

- **Módulo de Deals (100% Completo)**:
  - 3 páginas implementadas (lista, detalle, editar)
  - Context menu funcional con 3 opciones
  - CRUD completo con validación
  - 6 etapas: Lead, Calificado, Propuesta, Negociación, Ganado, Perdido
  - Stats cards con métricas de ventas (total, valor total, activos, ganados)
  - DealForm con campos de valor monetario y probabilidad
  - Colores distintivos por etapa del pipeline
  - Formato de moneda USD profesional

- **Módulo de Contacts (100% Completo)**:
  - 3 páginas implementadas (lista, detalle, editar)
  - Context menu funcional con 3 opciones
  - CRUD completo con validación
  - 4 estados: Lead, Calificado, Cliente, Inactivo
  - 6 fuentes: Sitio Web, Referido, Redes Sociales, Email, Teléfono, Otro
  - Stats cards con métricas (total, leads, calificados, clientes)
  - ContactForm con Textarea para notas
  - Colores distintivos por estado

- **Módulo de Tasks (100% Completo)**:
  - 3 páginas implementadas (lista, detalle, editar)
  - Context menu funcional con 3 opciones
  - CRUD completo con validación
  - 5 estados: Por Hacer, En Progreso, En Revisión, Completada, Cancelada
  - 4 prioridades: Baja, Media, Alta, Urgente
  - Stats cards con métricas (total, por hacer, en progreso, completadas)
  - Integración con ProjectSelect y UserSelect
  - TaskForm con layout optimizado (2 filas de 2 columnas)

- **Nuevos Selectores Dinámicos**:
  - ContactSelect - Selector de contactos con carga desde API
  - UserSelect - Selector de usuarios con carga desde API
  - ProjectSelect - Selector de proyectos con carga desde API
  - Soporte para filtrado por companyId
  - Loading states durante carga

- **Módulo de Usuarios (100% Completo)**:
  - 7 páginas implementadas (lista, detalle, editar, roles, firma)
  - Context menu funcional con 5 opciones
  - CRUD completo con validación
  - Upload de firma digital con preview
  - Asignación de roles con selectores dinámicos

- **Módulo de Empresas (100% Completo)**:
  - 4 páginas implementadas (lista, detalle, editar, jerarquía)
  - Context menu funcional con 4 opciones
  - CRUD completo con validación
  - Visualización de jerarquía empresarial
  - Soporte para empresa padre/subsidiarias

- **APIs Completas**:
  - Invoice API (5 endpoints: getAll, getById, create, update, delete)
  - Document API (5 endpoints: getAll, getById, create, update, delete)
  - Deal API (5 endpoints: getAll, getById, create, update, delete)
  - Contact API (5 endpoints: getAll, getById, create, update, delete)
  - Task API (5 endpoints: getAll, getById, create, update, delete)
  - User API (7 endpoints incluyendo delete)
  - Company API (7 endpoints incluyendo hierarchy)
  - Role API (8 endpoints)

- **Componentes Reutilizables**:
  - DataTable genérico con ag-grid y tema purple
  - DealForm, ContactForm, TaskForm, UserForm y CompanyForm con validación Zod
  - ContactSelect, UserSelect, ProjectSelect, CompanySelect y RoleSelect dinámicos
  - Textarea component de shadcn/ui
  - ConfirmDialog para confirmaciones
  - Context menu support en DataTable

- **Sistema de Notificaciones**:
  - Integración de Sonner
  - Toast notifications en todas las acciones
  - Variantes success y destructive

- **Patrón CRUD Establecido**:
  - 81 commits atómicos organizados
  - Patrón replicable para nuevos módulos
  - Documentación completa en FRONT_CONTEXT.md
  - Layout de formularios optimizado (2 columnas)
  - Sistema CRM completo (Contacts + Deals)
  - Sistema de facturación implementado
  - Gestión de documentos funcional

- **Páginas de Gestión de Usuarios Completas**:
  - `/dashboard/users/[id]` - Página de detalle con toda la información del usuario
  - `/dashboard/users/[id]/edit` - Página de edición con formulario pre-llenado
  - `/dashboard/users/[id]/roles` - Gestión de roles (asignar/remover)
  - `/dashboard/users/[id]/signature` - Gestión de firma digital (subir/actualizar)
- **UserForm Component** - Formulario completo para crear/editar usuarios
  - Validación con Zod y React Hook Form
  - Campos: email, password, name, lastName, documentNumber, documentType, phone, companyId
  - Validaciones completas (email, password strength, phone format, UUID)
  - Estados de loading y disabled
- **Dialog para crear usuario** - Modal con formulario integrado
- **Context Menu en tabla de usuarios** - Click derecho con opciones:
  - Ver Detalles, Editar, Asignar Rol, Asignar Firma, Eliminar
- **Hook useToast** - Sistema simple de notificaciones (temporal)
- **Label Component** - Componente UI para labels de formularios
- **Soporte Light Mode en DataTable** - Temas separados para dark y light mode
- Sistema de diseño completo documentado en DESIGN_SYSTEM.md
- Paleta de colores purple con escala completa
- Guía de uso de componentes con ejemplos
- Documentación de estados (hover, focus, disabled)
- Guía de animaciones y transiciones
- Layout del dashboard (`/dashboard/layout.tsx`) con DashboardLayout template
- Enlaces en el sidebar: Usuarios, Empresas, Roles, Proyectos, Tareas, Contactos, Deals, Documentos, Facturas
- Páginas completamente integradas en el dashboard
- Sistema CRM completo con pipeline de ventas
- Sistema de facturación con items
- Gestión de documentos y archivos

### Changed
- **DataTable** - Mejorado soporte para light/dark mode
  - Tema `purpleThemeDark` para dark mode
  - Tema `purpleThemeLight` para light mode
  - Prop `darkMode` para cambiar entre temas
  - Filtros más visibles con backgrounds sólidos
- **Filtros de ag-grid** - Cambiados de `agSetColumnFilter` a `agTextColumnFilter`
  - Evita error #200 de módulos enterprise no registrados
  - Usa solo módulos community
- Dashboard page ahora usa el layout de Next.js en lugar del componente DashboardLayout directamente
- Sidebar actualizado con enlace de "Usuarios" en la sección "Gestión"

### Fixed
- **Next.js 15+ params Promise** - Todas las páginas dinámicas ahora usan `React.use()` para unwrap params
  - `/dashboard/users/[id]/page.tsx`
  - `/dashboard/users/[id]/edit/page.tsx`
  - `/dashboard/users/[id]/roles/page.tsx`
  - `/dashboard/users/[id]/signature/page.tsx`
- Error de ag-grid #200 "SetFilterModule is not registered" - Cambiados filtros a community modules
- Error de ag-grid "No AG Grid modules are registered" - Agregado ModuleRegistry.registerModules([AllCommunityModule])
- Error de ag-grid #239 "Theming API and CSS File Themes are both used" - Migrado a Theming API moderno con themeQuartz
- Removidos archivos CSS legacy de ag-grid (ag-grid.css, ag-theme-alpine.css)
- Implementado tema personalizado purple con themeQuartz.withParams()
- Filtros de ag-grid ahora son visibles en light mode con backgrounds sólidos
- Implementado tema personalizado purple con themeQuartz.withParams()

---

## [0.3.0] - 2025-11-14

### Added
- **Módulo de Usuarios**
  - `src/lib/api/user.types.ts` - 8 interfaces TypeScript
  - `src/lib/api/user.api.ts` - 6 endpoints (getAll, getById, create, update, assignRole, assignSignature)
  - `src/lib/queries/user.queries.ts` - 6 hooks TanStack Query
  - `src/app/dashboard/users/page.tsx` - Página de lista de usuarios

- **Componente DataTable**
  - `src/components/organisms/DataTable/` - Tabla genérica con ag-grid
  - Soporte para filtros por columna (texto, número, fecha, set)
  - Ordenamiento multi-columna
  - Paginación configurable
  - Selección simple/múltiple
  - Loading y empty states
  - Tema oscuro (alpine-dark)
  - Click en fila para navegación

- **Patrones Establecidos**
  - Query Key Factory para organización de TanStack Query
  - Estructura de archivos para módulos (api, types, queries)
  - Patrón de integración con backend

### Technical Details
- ag-grid-react: Librería profesional para tablas
- ag-grid-community: Core de ag-grid
- Query invalidation granular con key factories
- Type safety completo en toda la integración

---

## [0.2.0] - 2025-11-11

### Added
- **Dashboard Layout**
  - Sidebar colapsable con tooltips
  - TopBar con empresa activa y user menu
  - Background con degradado sutil
  - Responsive design (mobile overlay, desktop fixed)

- **Dashboard Cards**
  - StatCards con animaciones spring
  - Cards grandes con scroll reveal
  - Gradientes sutiles
  - Scrollbars personalizados

- **Migración a Cookies HttpOnly**
  - Backend maneja tokens automáticamente
  - `credentials: 'include'` en todas las peticiones
  - Repository simplificado (solo userData)
  - Refresh automático de tokens

### Changed
- Migración de localStorage a cookies HttpOnly para tokens
- Simplificación del auth repository
- Actualización del API client con credentials

---

## [0.1.0] - 2024-11-11

### Added
- **Configuración Inicial**
  - Next.js 16 + React 19 + TypeScript 5
  - Tailwind CSS 4 con tema purple
  - motion v12 para animaciones
  - Atomic Design structure

- **Sistema de Autenticación**
  - Login, Register, Reset Password
  - TanStack Query para state management
  - Repository Pattern para abstracción
  - JWT con cookies HttpOnly

- **Landing Page**
  - Hero Section
  - Features Section
  - Pricing Section
  - Testimonials Section
  - NavBar con navegación suave
  - Scroll reveal animations

- **Componentes Base**
  - Logo (atom)
  - ThemeToggle (atom)
  - FormField (molecule)
  - PasswordInput (molecule)
  - FeatureCard (molecule)
  - AuthTemplate (template)
  - LoginForm (organism)
  - RegisterForm (organism)

### Technical Details
- Atomic Design: atoms/ → molecules/ → organisms/ → templates/
- Co-located Types: Cada componente tiene su `.types.ts`
- Purple Theme: `oklch(62.7% 0.265 303.9)` como color base
- Motion: Animaciones suaves con durations 200-300ms
- TanStack Query 5 para server state
- React Hook Form + Zod para formularios

---

## Tipos de Cambios

- `Added` - Para nuevas funcionalidades
- `Changed` - Para cambios en funcionalidades existentes
- `Deprecated` - Para funcionalidades que serán removidas
- `Removed` - Para funcionalidades removidas
- `Fixed` - Para corrección de bugs
- `Security` - Para vulnerabilidades de seguridad

---

**Mantenido por**: Equipo Frontend SORO
**Última actualización**: 2025-11-19
