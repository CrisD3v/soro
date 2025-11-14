# 📋 FRONT_TASK.md - Plan de Desarrollo Frontend SORO

## 🎯 Objetivo Principal
Desarrollar el frontend completo del sistema SORO para consumir la API backend que ya está 100% implementada con 16 módulos funcionales.

## 📊 Estado Actual del Backend

### ✅ Módulos Backend Completados (16/16)
1. **Auth** - Autenticación JWT con refresh tokens
2. **User** - CRUD usuarios, roles, firmas
3. **Company** - CRUD empresas, jerarquía, soft delete
4. **Role** - CRUD roles, permisos, jerarquía
5. **Permission** - Gestión de permisos por recurso
6. **Project** - CRUD proyectos, estados, asignaciones
7. **Task** - CRUD tareas, prioridades, estados
8. **Contact** - CRM - Gestión de leads y clientes
9. **Deal** - CRM - Pipeline de ventas
10. **Invoice** - Facturación y pagos
11. **Notification** - Sistema de notificaciones
12. **Document** - Gestión de archivos
13. **Event** - Sistema de eventos asíncronos
14. **CustomField** - Campos dinámicos
15. **Workflow** - Automatizaciones
16. **Health** - Health checks y métricas

### 📈 Endpoints Disponibles: 85+
- Auth: 3 endpoints
- Users: 6 endpoints
- Companies: 7 endpoints
- Roles: 8 endpoints
- Permissions: 3 endpoints
- Projects: 5 endpoints
- Tasks: 6 endpoints
- Contacts: 5 endpoints
- Deals: 6 endpoints
- Invoices: 9 endpoints
- Notifications: 5 endpoints
- Documents: 3 endpoints
- Events: 3 endpoints
- Custom Fields: 4 endpoints
- Workflows: 4 endpoints
- Health & Metrics: 2 endpoints

## 📊 Estado Actual del Frontend

### ✅ Completado (40%)
- **Landing Page**: Hero, Features, Pricing, Testimonials, NavBar
- **Dashboard Layout**: Sidebar, TopBar, Layout base
- **Autenticación**: Login, Register, Reset Password con cookies HttpOnly
- **Componentes Base**: StatCard, FeatureCard, FormField, PasswordInput
- **Arquitectura**: Atomic Design, TanStack Query, Repository Pattern
- **Middleware**: Protección de rutas /dashboard
- **Tema**: Purple theme con dark/light mode
- **Módulo de Usuarios (100%)**: 7 páginas completas con CRUD
- **Módulo de Empresas (100%)**: 4 páginas completas con CRUD y jerarquía
- **DataTable Genérico**: ag-grid con tema purple personalizado
- **Sistema de Notificaciones**: Sonner integrado
- **Context Menu**: Click derecho funcional en tablas
- **Selectores Dinámicos**: CompanySelect, RoleSelect
- **ConfirmDialog**: Componente reutilizable para confirmaciones

### ⏳ Pendiente (60%)
- **14 Módulos Restantes**: Roles, Projects, Tasks, CRM, etc.
- **Integración API**: Conectar módulos restantes del backend
- **Gestión de Estados**: Context providers para cada módulo
- **Formularios Avanzados**: Wizard multi-step, campos condicionales
- **Exportación**: CSV, PDF para tablas
- **Tests**: Unitarios e integración
- **Performance**: Optimizaciones y lazy loading

## 🗺️ Roadmap de Desarrollo

### **Fase 1: Integración API Core (Semana 1-2)**

#### 1.1 APIs y Types
- [x] `src/lib/api/user.api.ts` - CRUD usuarios ✅
- [x] `src/lib/api/user.types.ts` - Types de usuarios ✅
- [ ] `src/lib/api/company.api.ts` - CRUD empresas
- [ ] `src/lib/api/role.api.ts` - CRUD roles
- [ ] `src/lib/api/permission.api.ts` - Gestión permisos
- [ ] `src/lib/api/project.api.ts` - CRUD proyectos
- [ ] `src/lib/api/task.api.ts` - CRUD tareas

#### 1.2 Queries y Mutations
- [x] `src/lib/queries/user.queries.ts` - useUsers, useCreateUser, etc. ✅
- [ ] `src/lib/queries/company.queries.ts` - useCompanies, useCreateCompany, etc.
- [ ] `src/lib/queries/role.queries.ts` - useRoles, useAssignRole, etc.
- [ ] `src/lib/queries/permission.queries.ts` - usePermissions
- [ ] `src/lib/queries/project.queries.ts` - useProjects, useCreateProject, etc.
- [ ] `src/lib/queries/task.queries.ts` - useTasks, useCreateTask, etc.

#### 1.3 Context Providers
- [ ] `src/context/UserContext.tsx` - Estado global de usuarios
- [ ] `src/context/CompanyContext.tsx` - Estado global de empresas
- [ ] `src/context/ProjectContext.tsx` - Estado global de proyectos

### **Fase 2: Páginas del Dashboard (Semana 3-4)**

#### 2.1 Página de Usuarios
- [x] `src/app/dashboard/users/page.tsx` - Lista de usuarios ✅
- [ ] `src/app/dashboard/users/create/page.tsx` - Crear usuario
- [ ] `src/app/dashboard/users/[id]/page.tsx` - Ver/editar usuario
- [x] `src/components/organisms/DataTable/` - Tabla genérica con ag-grid ✅
- [ ] `src/components/organisms/UserForm/` - Formulario de usuario
- [ ] `src/components/molecules/UserCard/` - Card de usuario

#### 2.2 Página de Empresas
- [ ] `src/app/dashboard/companies/page.tsx` - Lista de empresas
- [ ] `src/app/dashboard/companies/create/page.tsx` - Crear empresa
- [ ] `src/app/dashboard/companies/[id]/page.tsx` - Ver/editar empresa
- [ ] `src/app/dashboard/companies/[id]/hierarchy/page.tsx` - Jerarquía
- [ ] `src/components/organisms/CompanyTable/` - Tabla de empresas
- [ ] `src/components/organisms/CompanyForm/` - Formulario de empresa
- [ ] `src/components/organisms/CompanyHierarchy/` - Árbol jerárquico
- [ ] `src/components/molecules/CompanyCard/` - Card de empresa

#### 2.3 Página de Roles y Permisos
- [ ] `src/app/dashboard/roles/page.tsx` - Lista de roles
- [ ] `src/app/dashboard/roles/create/page.tsx` - Crear rol
- [ ] `src/app/dashboard/roles/[id]/page.tsx` - Ver/editar rol
- [ ] `src/app/dashboard/roles/[id]/permissions/page.tsx` - Gestionar permisos
- [ ] `src/components/organisms/RoleTable/` - Tabla de roles
- [ ] `src/components/organisms/RoleForm/` - Formulario de rol
- [ ] `src/components/organisms/PermissionManager/` - Gestor de permisos
- [ ] `src/components/molecules/RoleCard/` - Card de rol

#### 2.4 Página de Proyectos
- [ ] `src/app/dashboard/projects/page.tsx` - Lista de proyectos
- [ ] `src/app/dashboard/projects/create/page.tsx` - Crear proyecto
- [ ] `src/app/dashboard/projects/[id]/page.tsx` - Ver/editar proyecto
- [ ] `src/app/dashboard/projects/[id]/tasks/page.tsx` - Tareas del proyecto
- [ ] `src/components/organisms/ProjectTable/` - Tabla de proyectos
- [ ] `src/components/organisms/ProjectForm/` - Formulario de proyecto
- [ ] `src/components/organisms/ProjectKanban/` - Vista Kanban
- [ ] `src/components/molecules/ProjectCard/` - Card de proyecto

#### 2.5 Página de Tareas
- [ ] `src/app/dashboard/tasks/page.tsx` - Lista de tareas
- [ ] `src/app/dashboard/tasks/create/page.tsx` - Crear tarea
- [ ] `src/app/dashboard/tasks/[id]/page.tsx` - Ver/editar tarea
- [ ] `src/components/organisms/TaskTable/` - Tabla de tareas
- [ ] `src/components/organisms/TaskForm/` - Formulario de tarea
- [ ] `src/components/organisms/TaskBoard/` - Board de tareas
- [ ] `src/components/molecules/TaskCard/` - Card de tarea

### **Fase 3: Componentes Avanzados (Semana 5-6)**

#### 3.1 Tablas de Datos
- [x] `src/components/organisms/DataTable/` - Tabla genérica reutilizable con ag-grid ✅
- [x] Filtros avanzados ✅
- [x] Paginación ✅
- [x] Ordenamiento ✅
- [x] Búsqueda (integrada en filtros) ✅
- [ ] Exportación (CSV, PDF)
- [x] Selección múltiple ✅
- [ ] Acciones en lote

#### 3.2 Formularios Dinámicos
- [ ] `src/components/organisms/DynamicForm/` - Formulario genérico
- [ ] Validación con Zod
- [ ] Campos condicionales
- [ ] Upload de archivos
- [ ] Auto-save
- [ ] Wizard multi-step

#### 3.3 Notificaciones
- [ ] `src/components/organisms/NotificationCenter/` - Centro de notificaciones
- [ ] `src/components/molecules/NotificationItem/` - Item de notificación
- [ ] `src/components/molecules/NotificationBadge/` - Badge con contador
- [ ] WebSocket integration (opcional)
- [ ] Push notifications
- [ ] Filtros por tipo

### **Fase 4: Módulos CRM y Facturación (Semana 7-8)**

#### 4.1 CRM - Contactos
- [ ] `src/app/dashboard/contacts/page.tsx` - Lista de contactos
- [ ] `src/app/dashboard/contacts/create/page.tsx` - Crear contacto
- [ ] `src/app/dashboard/contacts/[id]/page.tsx` - Ver/editar contacto
- [ ] `src/components/organisms/ContactTable/` - Tabla de contactos
- [ ] `src/components/organisms/ContactForm/` - Formulario de contacto
- [ ] `src/components/molecules/ContactCard/` - Card de contacto
- [ ] `src/lib/api/contact.api.ts` - API de contactos
- [ ] `src/lib/queries/contact.queries.ts` - Queries de contactos

#### 4.2 CRM - Deals
- [ ] `src/app/dashboard/deals/page.tsx` - Lista de deals
- [ ] `src/app/dashboard/deals/create/page.tsx` - Crear deal
- [ ] `src/app/dashboard/deals/[id]/page.tsx` - Ver/editar deal
- [ ] `src/components/organisms/DealPipeline/` - Pipeline de ventas
- [ ] `src/components/organisms/DealForm/` - Formulario de deal
- [ ] `src/components/molecules/DealCard/` - Card de deal
- [ ] `src/lib/api/deal.api.ts` - API de deals
- [ ] `src/lib/queries/deal.queries.ts` - Queries de deals

#### 4.3 Facturación
- [ ] `src/app/dashboard/invoices/page.tsx` - Lista de facturas
- [ ] `src/app/dashboard/invoices/create/page.tsx` - Crear factura
- [ ] `src/app/dashboard/invoices/[id]/page.tsx` - Ver/editar factura
- [ ] `src/app/dashboard/invoices/[id]/preview/page.tsx` - Vista previa
- [ ] `src/components/organisms/InvoiceTable/` - Tabla de facturas
- [ ] `src/components/organisms/InvoiceForm/` - Formulario de factura
- [ ] `src/components/organisms/InvoicePreview/` - Vista previa de factura
- [ ] `src/components/molecules/InvoiceCard/` - Card de factura
- [ ] `src/lib/api/invoice.api.ts` - API de facturas
- [ ] `src/lib/queries/invoice.queries.ts` - Queries de facturas

### **Fase 5: Módulos Avanzados (Semana 9-10)**

#### 5.1 Documentos
- [ ] `src/app/dashboard/documents/page.tsx` - Lista de documentos
- [ ] `src/app/dashboard/documents/upload/page.tsx` - Subir documento
- [ ] `src/components/organisms/DocumentTable/` - Tabla de documentos
- [ ] `src/components/organisms/DocumentUploader/` - Uploader
- [ ] `src/lib/api/document.api.ts` - API de documentos
- [ ] `src/lib/queries/document.queries.ts` - Queries de documentos

#### 5.2 Custom Fields
- [ ] `src/app/dashboard/settings/custom-fields/page.tsx` - Gestión de campos
- [ ] `src/components/organisms/CustomFieldManager/` - Gestor de campos
- [ ] `src/components/organisms/CustomFieldForm/` - Formulario de campo
- [ ] `src/lib/api/custom-field.api.ts` - API de custom fields
- [ ] `src/lib/queries/custom-field.queries.ts` - Queries de custom fields

#### 5.3 Workflows
- [ ] `src/app/dashboard/workflows/page.tsx` - Lista de workflows
- [ ] `src/app/dashboard/workflows/create/page.tsx` - Crear workflow
- [ ] `src/components/organisms/WorkflowBuilder/` - Constructor visual
- [ ] `src/lib/api/workflow.api.ts` - API de workflows
- [ ] `src/lib/queries/workflow.queries.ts` - Queries de workflows

### **Fase 6: Testing y Optimización (Semana 11-12)**

#### 6.1 Tests
- [ ] Tests unitarios para componentes
- [ ] Tests de integración para APIs
- [ ] Tests E2E con Playwright
- [ ] Coverage > 80%

#### 6.2 Performance
- [ ] Lazy loading de páginas
- [ ] Optimización de imágenes
- [ ] Code splitting
- [ ] Caching strategies
- [ ] React Query optimizations

#### 6.3 Storybook
- [ ] Documentar todos los componentes
- [ ] Casos de uso
- [ ] Variantes de estado

## 🛠️ Estrategia de Implementación

### **Paso 1: Configuración Base**
1. Actualizar variables de entorno con URL del backend
2. Configurar TanStack Query para todos los módulos
3. Crear estructura de carpetas para nuevas páginas
4. Verificar que la autenticación funcione correctamente

### **Paso 2: API Integration**
1. Crear API clients siguiendo el patrón de `auth.api.ts`
2. Definir types basados en la documentación del backend
3. Implementar queries y mutations con TanStack Query
4. Probar cada endpoint con datos reales

### **Paso 3: Componentes Base**
1. Crear componentes reutilizables (DataTable, DynamicForm)
2. Implementar sistema de notificaciones
3. Crear layouts específicos para cada módulo
4. Documentar en Storybook

### **Paso 4: Páginas CRUD**
1. Implementar páginas siguiendo el patrón: List → Create → Edit → View
2. Usar componentes base para consistencia
3. Integrar con APIs del backend
4. Agregar validaciones y manejo de errores

### **Paso 5: Testing y Polish**
1. Agregar tests progresivamente
2. Optimizar performance
3. Documentar en Storybook
4. Refinar UX/UI

## 📋 Checklist de Inicio Inmediato

### **Hoy - Configuración**
- [ ] Leer documentación completa del backend en `docs_context/`
- [ ] Actualizar `.env.local` con URL del backend
- [ ] Verificar que la autenticación funcione correctamente
- [ ] Probar endpoints básicos con Postman/Thunder Client

### **Mañana - Primera API**
- [ ] Implementar `user.api.ts` completo
- [ ] Crear `user.types.ts` con todas las interfaces
- [ ] Crear `user.queries.ts` con TanStack Query
- [ ] Crear página básica `/dashboard/users`
- [ ] Probar CRUD de usuarios

### **Esta Semana - Fundación**
- [ ] Completar APIs de User, Company, Role, Permission
- [ ] Crear componentes base (DataTable, DynamicForm)
- [ ] Implementar 2-3 páginas CRUD completas
- [ ] Establecer patrones para replicar

## 🎯 Métricas de Éxito

### **Semana 2**
- [ ] 6 APIs integradas (User, Company, Role, Permission, Project, Task)
- [ ] 2 páginas CRUD funcionales (Users, Companies)
- [ ] Componentes base creados (DataTable, DynamicForm)

### **Semana 4**
- [ ] 8 páginas del dashboard implementadas
- [ ] Sistema de notificaciones básico
- [ ] Formularios dinámicos funcionando

### **Semana 6**
- [ ] Todos los módulos core integrados
- [ ] DataTable avanzada con filtros
- [ ] Tests básicos implementados

### **Semana 8**
- [ ] Módulos CRM y facturación completos
- [ ] Performance optimizada
- [ ] Documentación en Storybook

### **Semana 12**
- [ ] Sistema completo y funcional
- [ ] Tests > 80% coverage
- [ ] Listo para producción

## 🔧 Herramientas y Tecnologías

### **Ya Configuradas**
- Next.js 16 + React 19
- TypeScript 5
- Tailwind CSS 4
- motion v12
- TanStack Query 5
- React Hook Form + Zod
- Vitest + Testing Library
- Storybook 10

### **Por Agregar**
- [ ] @tanstack/react-table v8 (para DataTable)
- [ ] react-beautiful-dnd (para Kanban boards)
- [ ] recharts (para gráficos)
- [ ] react-pdf (para facturas)
- [ ] socket.io-client (para notificaciones en tiempo real)

## 📞 Próximos Pasos Inmediatos

1. **Leer toda la documentación** en `docs_context/`
2. **Empezar con User API** - Es el más crítico
3. **Crear página `/dashboard/users`** - Primera implementación completa
4. **Iterar rápidamente** - Un módulo por día
5. **Mantener calidad** - Tests desde el inicio

---

**Fecha de creación**: 2025-11-14
**Estado**: 📋 Plan inicial
**Próxima revisión**: Cada viernes
**Responsable**: Equipo Frontend SORO
