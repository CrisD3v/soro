# Changelog - Phase V2

## 🚀 Version 2.1.0 - Settings & Health Improvements

**Fecha**: 2025-11-19

### 🆕 Nuevas Funcionalidades

#### Settings Module
- ✅ **Settings Module**: Sistema completo de configuraciones multi-tenant
  - Categorías: GENERAL, SECURITY, NOTIFICATIONS, BILLING, INTEGRATIONS, APPEARANCE
  - Visibilidad pública/privada por configuración
  - Clave única por empresa
  - 6 endpoints REST completos (CRUD + list + get by key)
  - Documentación Swagger completa

#### Auth Improvements
- ✅ **Endpoint /auth/me**: Obtener usuario autenticado desde JWT
  - Soporta Bearer Token y Cookies
  - Retorna datos completos del usuario sin password
  - Documentado en Swagger

#### Health Module Improvements
- ✅ **Health Check Mejorado**: Información detallada del sistema
  - Métricas de CPU (uso, cores, modelo)
  - Métricas de memoria (total, usado, libre, porcentaje)
  - Métricas de disco (total, usado, libre, porcentaje)
  - Estado de servicios (Database, API Server)
  - Uptime del servidor
  - Versión de la aplicación
  - 4 endpoints: `/health`, `/health/ping`, `/health/basic`, `/health/metrics`

### 🔧 Mejoras

#### Base de Datos
- Migración `20251119142955_add_setting_module`
- Modelo `Setting` actualizado con campos: key, value, description, category, isPublic
- Enum `SettingCategory` agregado
- Índices optimizados en companyId, category, isPublic
- Constraint único en [key, companyId]

#### Documentación
- Todos los nuevos endpoints documentados en Swagger
- DTOs con validaciones y decoradores ApiProperty
- Responses documentadas con ejemplos

---

## 🎉 Version 2.0.0 - Phase V2 Release

**Fecha**: 2024-11-13

### 🆕 Nuevas Funcionalidades

#### Core System
- ✅ **SystemVersion**: Tabla para versionado de migraciones y sistema
- ✅ **Multi-tenant mejorado**: TenantConfig con límites y features por empresa
- ✅ **Permisos jerárquicos**: Sistema RBAC con scopes (GLOBAL, COMPANY, PROJECT, RESOURCE)
- ✅ **Roles con herencia**: Jerarquía de roles con herencia de permisos
- ✅ **Custom Fields**: Campos dinámicos configurables por tenant y entidad
- ✅ **Event System**: Sistema de eventos para procesamiento asíncrono
- ✅ **Auditoría completa**: AuditLog con tracking de cambios, IP y user agent

#### Módulos de Negocio
- ✅ **Projects**: Gestión de proyectos con tareas
- ✅ **Tasks**: Sistema de tareas con asignación y estados
- ✅ **Contacts (CRM)**: Gestión de contactos (leads, clientes, proveedores)
- ✅ **Deals**: Oportunidades de venta con pipeline
- ✅ **Invoices**: Sistema de facturación completo
- ✅ **Payments**: Registro de pagos vinculados a facturas
- ✅ **Resources**: Gestión de inventario y recursos
- ✅ **Documents**: Gestión documental con upload de archivos
- ✅ **Workflows**: Sistema de automatizaciones configurables
- ✅ **Notifications**: Sistema de notificaciones en tiempo real

#### Integraciones
- ✅ **Integration**: Configuración de integraciones externas
- ✅ **ApiKey**: Sistema de API Keys para acceso programático
- ✅ **Subscriptions**: Gestión de suscripciones y planes
- ✅ **Plans**: Planes con features y límites configurables

### 🔧 Mejoras

#### Schema de Base de Datos
- Agregado `isActive` a User y Company
- Agregado `lastLoginAt` a User
- Agregado campos adicionales a Company (sector, email, logoUrl)
- Agregado `description` a Role
- Agregado campos de scope a Permission (resource, action, scope)
- Índices optimizados para queries multi-tenant
- Relaciones mejoradas con cascade deletes apropiados

#### Seguridad
- Índice único en `RefreshToken.tokenHash`
- Validación de permisos por scope
- Guards mejorados para multi-tenant
- Auditoría de accesos

#### Performance
- Índices compuestos para queries frecuentes
- Índices en campos de filtrado (status, type, etc.)
- Índices en foreign keys
- Índices en campos de búsqueda (email, documentNumber, etc.)

### 📚 Documentación

Nueva documentación completa en `/docs`:
- `ARCHITECTURE.md` - Arquitectura hexagonal y DDD
- `MULTI_TENANT.md` - Estrategia multi-tenant
- `PERMISSIONS.md` - Sistema de permisos jerárquico
- `EVENTS.md` - Sistema de eventos y procesamiento asíncrono
- `CUSTOM_FIELDS.md` - Campos dinámicos
- `API_GUIDE.md` - Guía completa de endpoints
- `DEPLOYMENT.md` - Guía de despliegue en producción

### 🗄️ Migraciones

**Migración**: `20251113210147_phase_v2`

Cambios aplicados:
- Creación de 15 nuevas tablas
- Modificación de tablas existentes (User, Company, Role, Permission)
- Creación de enum `PermissionScope`
- Migración de datos existentes en Permission
- Creación de índices optimizados

### 🌱 Seeds

Seeds actualizados con:
- SystemVersion inicial (2.0.0)
- 3 planes (Free, Professional, Enterprise)
- 16 permisos base con scopes
- 5 roles con jerarquía (super_admin → admin → manager → employee → viewer)
- 5 empresas con TenantConfig
- 5 suscripciones
- 7 usuarios de prueba
- Asignación de roles y permisos

### 🔄 Breaking Changes

⚠️ **Atención**: Esta versión incluye cambios que rompen compatibilidad con V1:

1. **Permission model**: Ahora requiere `resource`, `action` y `scope`
2. **Role model**: Agregados campos `isGlobal`, `level`, `parentId`
3. **Company model**: Campo `phone` ya no es único ni requerido
4. **User model**: Agregado campo `isActive`

### 📦 Dependencias

Dependencias principales:
- NestJS 11.x
- Prisma 6.19.x
- PostgreSQL 14+
- bcrypt para passwords
- JWT para autenticación

Nuevas dependencias (V2.1):
- @nestjs/throttler 6.4.0 - Rate limiting
- winston 3.18.3 - Logging estructurado
- nest-winston 1.10.2 - Integración Winston con NestJS

### 🧪 Testing

Implementado:
- [x] Tests E2E para Auth (login, refresh, logout)
- [x] Tests unitarios para CreateUserUseCase
- [x] Configuración de jest-e2e.json

Pendiente:
- [ ] Tests unitarios para todos los módulos
- [ ] Tests de integración para repositories
- [ ] Tests E2E para flujos completos
- [ ] Tests de performance para multi-tenant
- [ ] Coverage mínimo del 80%

### 🚀 Mejoras Implementadas (V2.1)

**Fecha**: 2024-11-14

Nuevas características agregadas:
- [x] **Rate Limiting**: Sistema de rate limiting por tenant con @nestjs/throttler
- [x] **Monitoring**: Logs estructurados con Winston y métricas de performance
- [x] **Tests**: Tests E2E y unitarios iniciados
- [x] **Variables de Entorno**: Configuración completa con .env.example
- [x] **Swagger Mejorado**: Documentación completa con 16 tags

### 🚀 Próximos Pasos (V3)

Planeado para la siguiente versión:
- [ ] Expandir cobertura de tests (80%+)
- [ ] CI/CD con GitHub Actions
- [ ] Cache layer con Redis
- [ ] File upload real (S3/R2)
- [ ] Sistema de webhooks para integraciones
- [ ] Reportes y analytics avanzados
- [ ] GraphQL API
- [ ] WebSockets para notificaciones en tiempo real
- [ ] Sistema de templates para documentos
- [ ] Integración con servicios de pago (Stripe, MercadoPago)

### 📊 Estadísticas

- **Tablas nuevas**: 15
- **Tablas modificadas**: 4
- **Líneas de código agregadas**: ~5,000
- **Documentación**: 7 archivos nuevos
- **Endpoints nuevos**: ~50+

### 👥 Contribuidores

- Sistema desarrollado siguiendo arquitectura hexagonal
- Implementación de principios SOLID
- Código documentado en español con tecnicismos en inglés

### 🔗 Referencias

- [Documentación completa](/docs)
- [README principal](/README.md)
- [Guía de API](/docs/API_GUIDE.md)
