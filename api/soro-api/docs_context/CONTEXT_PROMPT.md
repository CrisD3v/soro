# Guía Completa para Consumir SORO API

## 📋 Resumen del Sistema

SORO API es un sistema SaaS multi-tenant construido con:
- **Backend**: NestJS + Prisma + PostgreSQL
- **Arquitectura**: Hexagonal (Ports & Adapters) + DDD
- **Autenticación**: JWT con refresh tokens
- **Multi-tenancy**: Row-level con `companyId`
- **Permisos**: RBAC jerárquico con scopes (GLOBAL, COMPANY, PROJECT, RESOURCE)
- **Eventos**: Event-driven architecture para procesamiento asíncrono

## 🌐 Base URL

```
Development: http://localhost:3000
Production: https://api.yourdomain.com
```

## 🏗️ Estructura del Proyecto

```
src/context/
├── auth/           # Autenticación JWT
├── user/           # Gestión de usuarios
├── company/        # Empresas (multi-tenant)
├── role/           # Roles y permisos
├── project/        # Gestión de proyectos
├── task/           # Tareas
├── contact/        # CRM - Contactos
├── deal/           # CRM - Oportunidades
├── invoice/        # Facturación
├── document/       # Gestión documental
├── notification/   # Notificaciones
├── event/          # Sistema de eventos
├── custom-field/   # Campos dinámicos
└── workflow/       # Automatizaciones
```

Cada módulo sigue:
```
module/
├── domain/
│   ├── entities/
│   └── ports/
├── application/
│   ├── use-cases/
│   └── dto/
└── infrastructure/
    ├── persistence/
    ├── controllers/
    └── mappers/
```

## 🔑 Conceptos Clave

### Multi-tenant
- Cada empresa (`Company`) es un tenant
- Todos los datos tienen `companyId`
- Aislamiento automático en repositories
- Configuración por tenant en `TenantConfig`

### Permisos Jerárquicos
```
GLOBAL → COMPANY → PROJECT → RESOURCE
```
- Roles pueden heredar de roles padres
- Permisos tienen scopes específicos
- Guards validan permisos en cada request

### Eventos
- Operaciones publican eventos (`user.created`, `invoice.paid`, etc.)
- Handlers procesan eventos asíncronamente
- Sistema de retry para eventos fallidos
- Auditoría completa en `EventLog`

### Custom Fields
- Campos dinámicos sin modificar schema
- Configurables por tenant y entidad
- Validación automática según tipo
- Almacenados en JSON fields

## 📊 Modelos Principales

### User
```typescript
{
  id, email, password, name, lastName,
  documentNumber, documentType, phone,
  companyId, isActive, roles[], signature
}
```

### Company
```typescript
{
  id, name, nit, sector, address, phone, email,
  parentId, isActive, deletedAt,
  children[], users[], projects[]
}
```

### Role
```typescript
{
  id, name, description, isGlobal, level,
  parentId, permissions[]
}
```

### Permission
```typescript
{
  id, name, description, resource, action,
  scope // GLOBAL | COMPANY | PROJECT | RESOURCE
}
```

### Project
```typescript
{
  id, name, description, status,
  startDate, endDate, companyId, createdBy,
  tasks[], documents[]
}
```

### Contact (CRM)
```typescript
{
  id, companyId, type, name, email, phone,
  address, notes, customData, deals[]
}
```

### Invoice
```typescript
{
  id, companyId, dealId, invoiceNumber,
  status, subtotal, tax, total, currency,
  dueDate, paidAt, payments[]
}
```

## 🔐 Autenticación

### 1. Login

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "test@example.com",
  "password": "Test123456!"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0...",
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "name": "Test",
    "lastName": "User"
  }
}
```

**Errores:**
- `401 Unauthorized`: Credenciales inválidas
- `400 Bad Request`: Datos de entrada inválidos

### 2. Refresh Token

**Endpoint:** `POST /auth/refresh`

**Request:**
```json
{
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "new-refresh-token..."
}
```

**Errores:**
- `401 Unauthorized`: Refresh token inválido o expirado

### 3. Logout

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0..."
}
```

**Response:** `204 No Content`

### 4. Usar el Token

Todos los endpoints protegidos requieren el header:

```
Authorization: Bearer <access-token>
```

**Ejemplo con fetch:**
```javascript
const response = await fetch('http://localhost:3000/users', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```

**Ejemplo con axios:**
```javascript
const response = await axios.get('http://localhost:3000/users', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

## 👥 Módulo de Usuarios

### Crear Usuario

**Endpoint:** `POST /users`

**Request:**
```json
{
  "email": "nuevo@example.com",
  "password": "Password123!",
  "name": "Juan",
  "lastName": "Pérez",
  "documentNumber": "1234567890",
  "documentType": "CC",
  "phone": "+573001234567",
  "companyId": "company-uuid"
}
```

**Response (201):**
```json
{
  "id": "user-uuid",
  "email": "nuevo@example.com",
  "name": "Juan",
  "lastName": "Pérez",
  "fullName": "Juan Pérez",
  "documentNumber": "1234567890",
  "documentType": "CC",
  "phone": "+573001234567",
  "companyId": "company-uuid",
  "isActive": true,
  "roles": [],
  "signature": null,
  "createdAt": "2024-11-13T10:00:00.000Z",
  "updatedAt": "2024-11-13T10:00:00.000Z"
}
```

**Errores:**
- `409 Conflict`: Email o documento ya existe
- `403 Forbidden`: Sin permisos para crear usuarios
- `400 Bad Request`: Datos inválidos

### Listar Usuarios

**Endpoint:** `GET /users?companyId=uuid&email=search`

**Query Params:**
- `companyId` (opcional): Filtrar por empresa
- `email` (opcional): Buscar por email (parcial)
- `documentNumber` (opcional): Buscar por documento

**Response (200):**
```json
[
  {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "Juan",
    "lastName": "Pérez",
    "fullName": "Juan Pérez",
    "documentNumber": "1234567890",
    "documentType": "CC",
    "phone": "+573001234567",
    "companyId": "company-uuid",
    "isActive": true,
    "roles": [
      {
        "id": "role-uuid",
        "roleId": "admin-role-uuid",
        "companyId": "company-uuid",
        "createdAt": "2024-11-13T10:00:00.000Z"
      }
    ],
    "createdAt": "2024-11-13T10:00:00.000Z",
    "updatedAt": "2024-11-13T10:00:00.000Z"
  }
]
```

### Obtener Usuario

**Endpoint:** `GET /users/:id`

**Response (200):** Igual que crear usuario

**Errores:**
- `404 Not Found`: Usuario no existe
- `403 Forbidden`: Sin permisos

### Actualizar Usuario

**Endpoint:** `PUT /users/:id`

**Request:**
```json
{
  "name": "Juan Carlos",
  "phone": "+573009999999",
  "email": "newemail@example.com"
}
```

**Response (200):** Usuario actualizado

### Asignar Rol

**Endpoint:** `POST /users/:id/roles`

**Request:**
```json
{
  "roleId": "role-uuid",
  "companyId": "company-uuid"
}
```

**Response:** `204 No Content`

### Asignar Firma

**Endpoint:** `POST /users/:id/signature`

**Request:**
```json
{
  "signature": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Response:** `204 No Content`

## 🏢 Módulo de Empresas

### Crear Empresa

**Endpoint:** `POST /companies`

**Request:**
```json
{
  "name": "Mi Empresa",
  "nit": "900123456-7",
  "sector": "Technology",
  "address": "Calle 123 #45-67",
  "phone": "+573001234567",
  "email": "contact@miempresa.com",
  "parentId": null
}
```

**Response (201):**
```json
{
  "id": "company-uuid",
  "name": "Mi Empresa",
  "nit": "900123456-7",
  "sector": "Technology",
  "address": "Calle 123 #45-67",
  "phone": "+573001234567",
  "email": "contact@miempresa.com",
  "logoUrl": null,
  "parentId": null,
  "isActive": true,
  "deletedAt": null,
  "createdAt": "2024-11-13T10:00:00.000Z",
  "updatedAt": "2024-11-13T10:00:00.000Z",
  "parent": null,
  "children": []
}
```

### Listar Empresas

**Endpoint:** `GET /companies?parentId=&name=search&includeDeleted=false`

**Query Params:**
- `parentId` (opcional): Filtrar por empresa padre (vacío para raíz)
- `name` (opcional): Buscar por nombre
- `includeDeleted` (opcional): Incluir eliminadas

**Response (200):** Array de empresas

### Obtener Jerarquía

**Endpoint:** `GET /companies/:id/hierarchy`

**Response (200):**
```json
{
  "id": "company-uuid",
  "name": "ACME Corporation",
  "children": [
    {
      "id": "child-uuid",
      "name": "ACME Tech",
      "children": [
        {
          "id": "grandchild-uuid",
          "name": "ACME Dev",
          "children": []
        }
      ]
    }
  ]
}
```

### Eliminar Empresa (Soft Delete)

**Endpoint:** `DELETE /companies/:id`

**Response:** `204 No Content`

### Restaurar Empresa

**Endpoint:** `PATCH /companies/:id/restore`

**Response:** `204 No Content`

## 👔 Módulo de Roles

### Crear Rol

**Endpoint:** `POST /roles`

**Request:**
```json
{
  "name": "project_manager",
  "description": "Manager de proyectos",
  "isGlobal": false,
  "level": 2,
  "parentId": "admin-role-uuid"
}
```

**Response (201):**
```json
{
  "id": "role-uuid",
  "name": "project_manager",
  "description": "Manager de proyectos",
  "isGlobal": false,
  "level": 2,
  "permissionCount": 0,
  "permissions": [],
  "createdAt": "2024-11-13T10:00:00.000Z",
  "updatedAt": "2024-11-13T10:00:00.000Z"
}
```

### Listar Roles

**Endpoint:** `GET /roles`

**Response (200):** Array de roles con permisos

### Asignar Permiso a Rol

**Endpoint:** `POST /roles/:id/permissions`

**Request:**
```json
{
  "permissionId": "permission-uuid"
}
```

**Response:** `204 No Content`

### Remover Permiso

**Endpoint:** `DELETE /roles/:id/permissions/:permissionId`

**Response:** `204 No Content`

### Listar Permisos del Rol

**Endpoint:** `GET /roles/:id/permissions`

**Response (200):**
```json
[
  {
    "id": "permission-uuid",
    "name": "projects.create",
    "description": "Create projects",
    "resource": "projects",
    "action": "create",
    "scope": "COMPANY"
  }
]
```

## 📊 Módulo de Proyectos

### Crear Proyecto

**Endpoint:** `POST /projects`

**Request:**
```json
{
  "name": "Proyecto Alpha",
  "description": "Descripción del proyecto",
  "status": "active",
  "startDate": "2024-11-13",
  "endDate": "2024-12-31",
  "companyId": "company-uuid"
}
```

**Response (201):**
```json
{
  "id": "project-uuid",
  "name": "Proyecto Alpha",
  "description": "Descripción del proyecto",
  "status": "active",
  "startDate": "2024-11-13T00:00:00.000Z",
  "endDate": "2024-12-31T00:00:00.000Z",
  "companyId": "company-uuid",
  "createdBy": "user-uuid",
  "createdAt": "2024-11-13T10:00:00.000Z",
  "updatedAt": "2024-11-13T10:00:00.000Z"
}
```

### Listar Proyectos

**Endpoint:** `GET /projects?status=active&companyId=uuid`

**Response (200):** Array de proyectos

### Crear Tarea en Proyecto

**Endpoint:** `POST /projects/:projectId/tasks`

**Request:**
```json
{
  "title": "Implementar feature X",
  "description": "Descripción de la tarea",
  "status": "todo",
  "priority": "high",
  "dueDate": "2024-11-20",
  "assignedTo": "user-uuid"
}
```

**Response (201):**
```json
{
  "id": "task-uuid",
  "title": "Implementar feature X",
  "description": "Descripción de la tarea",
  "status": "todo",
  "priority": "high",
  "dueDate": "2024-11-20T00:00:00.000Z",
  "projectId": "project-uuid",
  "assignedTo": "user-uuid",
  "createdAt": "2024-11-13T10:00:00.000Z",
  "updatedAt": "2024-11-13T10:00:00.000Z"
}
```

## 📇 Módulo CRM - Contactos

### Crear Contacto

**Endpoint:** `POST /contacts`

**Request:**
```json
{
  "type": "lead",
  "name": "Empresa Cliente",
  "email": "cliente@empresa.com",
  "phone": "+573001234567",
  "address": "Calle 123",
  "notes": "Contacto inicial",
  "customData": {
    "industry": "tech",
    "budget": 50000
  }
}
```

**Response (201):**
```json
{
  "id": "contact-uuid",
  "companyId": "company-uuid",
  "type": "lead",
  "name": "Empresa Cliente",
  "email": "cliente@empresa.com",
  "phone": "+573001234567",
  "address": "Calle 123",
  "notes": "Contacto inicial",
  "customData": {
    "industry": "tech",
    "budget": 50000
  },
  "createdBy": "user-uuid",
  "createdAt": "2024-11-13T10:00:00.000Z",
  "updatedAt": "2024-11-13T10:00:00.000Z"
}
```

### Listar Contactos

**Endpoint:** `GET /contacts?type=lead&email=search`

**Response (200):** Array de contactos

## 💼 Módulo CRM - Oportunidades

### Crear Oportunidad

**Endpoint:** `POST /deals`

**Request:**
```json
{
  "contactId": "contact-uuid",
  "title": "Venta Software",
  "description": "Oportunidad de venta",
  "value": 100000,
  "currency": "USD",
  "stage": "prospecting",
  "probability": 30,
  "expectedCloseDate": "2024-12-31",
  "assignedTo": "user-uuid"
}
```

**Response (201):**
```json
{
  "id": "deal-uuid",
  "companyId": "company-uuid",
  "contactId": "contact-uuid",
  "title": "Venta Software",
  "description": "Oportunidad de venta",
  "value": 100000,
  "currency": "USD",
  "stage": "prospecting",
  "probability": 30,
  "expectedCloseDate": "2024-12-31T00:00:00.000Z",
  "closedAt": null,
  "assignedTo": "user-uuid",
  "createdBy": "user-uuid",
  "createdAt": "2024-11-13T10:00:00.000Z",
  "updatedAt": "2024-11-13T10:00:00.000Z"
}
```

### Actualizar Stage de Oportunidad

**Endpoint:** `PUT /deals/:id`

**Request:**
```json
{
  "stage": "negotiation",
  "probability": 70
}
```

**Response (200):** Deal actualizado

## 💰 Módulo de Facturación

### Crear Factura

**Endpoint:** `POST /invoices`

**Request:**
```json
{
  "dealId": "deal-uuid",
  "invoiceNumber": "INV-2024-001",
  "status": "draft",
  "subtotal": 100000,
  "tax": 19000,
  "total": 119000,
  "currency": "USD",
  "dueDate": "2024-12-31",
  "notes": "Pago a 30 días"
}
```

**Response (201):**
```json
{
  "id": "invoice-uuid",
  "companyId": "company-uuid",
  "dealId": "deal-uuid",
  "invoiceNumber": "INV-2024-001",
  "status": "draft",
  "subtotal": 100000,
  "tax": 19000,
  "total": 119000,
  "currency": "USD",
  "dueDate": "2024-12-31T00:00:00.000Z",
  "paidAt": null,
  "notes": "Pago a 30 días",
  "createdBy": "user-uuid",
  "createdAt": "2024-11-13T10:00:00.000Z",
  "updatedAt": "2024-11-13T10:00:00.000Z"
}
```

### Registrar Pago

**Endpoint:** `POST /invoices/:id/payments`

**Request:**
```json
{
  "amount": 119000,
  "currency": "USD",
  "method": "transfer",
  "transactionId": "TRX-123456",
  "paidAt": "2024-11-13T10:00:00.000Z"
}
```

**Response (201):**
```json
{
  "id": "payment-uuid",
  "invoiceId": "invoice-uuid",
  "amount": 119000,
  "currency": "USD",
  "method": "transfer",
  "transactionId": "TRX-123456",
  "status": "completed",
  "paidAt": "2024-11-13T10:00:00.000Z",
  "createdAt": "2024-11-13T10:00:00.000Z"
}
```

## 🔔 Módulo de Notificaciones

### Listar Notificaciones

**Endpoint:** `GET /notifications?read=false`

**Query Params:**
- `read` (opcional): Filtrar por leídas/no leídas

**Response (200):**
```json
[
  {
    "id": "notification-uuid",
    "userId": "user-uuid",
    "title": "Nueva tarea asignada",
    "message": "Se te ha asignado la tarea 'Implementar feature X'",
    "type": "task",
    "entityType": "task",
    "entityId": "task-uuid",
    "read": false,
    "readAt": null,
    "createdAt": "2024-11-13T10:00:00.000Z"
  }
]
```

### Marcar como Leída

**Endpoint:** `PATCH /notifications/:id/read`

**Response:** `204 No Content`

## 🎯 Flujos Completos de Uso

### Flujo 1: Onboarding de Nueva Empresa

```javascript
// 1. Crear empresa
const company = await fetch('/companies', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    name: 'Nueva Empresa',
    nit: '900123456-7',
    sector: 'Technology',
    address: 'Calle 123',
    phone: '+573001234567',
    email: 'contact@empresa.com'
  })
}).then(r => r.json());

// 2. Crear usuario admin
const admin = await fetch('/users', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    email: 'admin@empresa.com',
    password: 'Admin123!',
    name: 'Admin',
    lastName: 'User',
    documentNumber: '1234567890',
    documentType: 'CC',
    phone: '+573001234567',
    companyId: company.id
  })
}).then(r => r.json());

// 3. Asignar rol de admin
await fetch(`/users/${admin.id}/roles`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    roleId: 'admin-role-uuid',
    companyId: company.id
  })
});
```

### Flujo 2: Crear Proyecto con Tareas

```javascript
// 1. Crear proyecto
const project = await fetch('/projects', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    name: 'Proyecto Alpha',
    description: 'Nuevo proyecto',
    status: 'active',
    startDate: '2024-11-13',
    endDate: '2024-12-31',
    companyId: 'company-uuid'
  })
}).then(r => r.json());

// 2. Crear tareas
const task1 = await fetch(`/projects/${project.id}/tasks`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    title: 'Tarea 1',
    description: 'Primera tarea',
    status: 'todo',
    priority: 'high',
    dueDate: '2024-11-20',
    assignedTo: 'user-uuid'
  })
}).then(r => r.json());
```

### Flujo 3: Pipeline de Ventas

```javascript
// 1. Crear contacto (lead)
const contact = await fetch('/contacts', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    type: 'lead',
    name: 'Cliente Potencial',
    email: 'cliente@empresa.com',
    phone: '+573001234567'
  })
}).then(r => r.json());

// 2. Crear oportunidad
const deal = await fetch('/deals', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    contactId: contact.id,
    title: 'Venta Software',
    value: 100000,
    currency: 'USD',
    stage: 'prospecting',
    probability: 30
  })
}).then(r => r.json());

// 3. Avanzar stage
await fetch(`/deals/${deal.id}`, {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    stage: 'negotiation',
    probability: 70
  })
});

// 4. Crear factura
const invoice = await fetch('/invoices', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    dealId: deal.id,
    invoiceNumber: 'INV-2024-001',
    subtotal: 100000,
    tax: 19000,
    total: 119000,
    dueDate: '2024-12-31'
  })
}).then(r => r.json());

// 5. Registrar pago
await fetch(`/invoices/${invoice.id}/payments`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    amount: 119000,
    method: 'transfer',
    transactionId: 'TRX-123456'
  })
});
```

## 🛠️ Comandos Útiles

```bash
# Desarrollo
pnpm run start:dev

# Migraciones
pnpm prisma migrate dev
pnpm prisma migrate deploy

# Seed
pnpm prisma:seed

# Tests
pnpm test
pnpm test:e2e

# Generar módulo
nest g module context/[module]
nest g controller context/[module]/infrastructure/controllers
nest g service context/[module]/application/use-cases
```

## 📝 Convenciones

### Naming
- Entities: `User`, `Company` (PascalCase singular)
- Use Cases: `CreateUserUseCase` (VerbNounUseCase)
- DTOs: `create-user.dto.ts` (kebab-case)
- Ports: `UserRepositoryPort` (NounPort)
- Implementations: `PrismaUserRepository` (TechNoun)

### Comentarios
- En español con tecnicismos en inglés
- Ejemplo: "Repository para gestionar Users con multi-tenant support"

### Commits
- Atómicos y funcionales
- Formato: `feat: add user management module`
- Sin errores de syntax, imports o linting

## 🔗 Documentación

- `docs/ARCHITECTURE.md` - Arquitectura hexagonal y DDD
- `docs/MULTI_TENANT.md` - Estrategia multi-tenant
- `docs/PERMISSIONS.md` - Sistema de permisos
- `docs/EVENTS.md` - Sistema de eventos
- `docs/CUSTOM_FIELDS.md` - Campos dinámicos
- `docs/API_GUIDE.md` - Guía de endpoints
- `README.md` - Documentación general

## 🎓 Próximos Pasos

Al continuar el desarrollo:

1. **Implementar módulos faltantes** siguiendo la arquitectura establecida
2. **Agregar tests** para cada use case y repository
3. **Configurar CI/CD** con GitHub Actions
4. **Implementar rate limiting** por tenant
5. **Agregar cache layer** con Redis
6. **Configurar monitoring** con Prometheus/Grafana
7. **Documentar API** con Swagger/OpenAPI
8. **Implementar webhooks** para integraciones
9. **Agregar módulos sectoriales** (salud, educación, etc.)
10. **Optimizar queries** con índices y eager loading

## ⚠️ Consideraciones Importantes

- **Siempre filtrar por `companyId`** en repositories
- **Validar permisos** en todos los endpoints protegidos
- **Publicar eventos** para operaciones importantes
- **Usar transacciones** para operaciones múltiples
- **Validar límites** del tenant antes de crear recursos
- **Hashear passwords** con bcrypt (10 rounds)
- **Invalidar cache** al actualizar datos
- **Loggear errores** con contexto (userId, companyId)

## ⚠️ Manejo de Errores

### Códigos HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `204 No Content`: Operación exitosa sin contenido
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: Token inválido o expirado
- `403 Forbidden`: Sin permisos para la operación
- `404 Not Found`: Recurso no encontrado
- `409 Conflict`: Conflicto (ej: email duplicado)
- `500 Internal Server Error`: Error del servidor

### Estructura de Error

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Ejemplos de Errores Comunes

**Token Expirado:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**Solución:** Usar refresh token para obtener nuevo access token

**Sin Permisos:**
```json
{
  "statusCode": 403,
  "message": "Permission users.create required"
}
```
**Solución:** Verificar que el usuario tenga el rol/permiso necesario

**Email Duplicado:**
```json
{
  "statusCode": 409,
  "message": "Email already exists"
}
```
**Solución:** Usar otro email

**Validación Fallida:**
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request"
}
```
**Solución:** Corregir los datos según los mensajes

### Manejo de Errores en Cliente

```javascript
async function apiCall(endpoint, options) {
  try {
    const response = await fetch(`http://localhost:3000${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();

      // Token expirado - renovar
      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        // Reintentar con nuevo token
        return apiCall(endpoint, options);
      }

      // Sin permisos
      if (response.status === 403) {
        console.error('Sin permisos:', error.message);
        // Mostrar mensaje al usuario
      }

      // Otros errores
      throw new Error(error.message);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

async function refreshAccessToken() {
  const response = await fetch('http://localhost:3000/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });

  const data = await response.json();
  accessToken = data.accessToken;
  refreshToken = data.refreshToken;

  return accessToken;
}
```

## 🚀 Usuarios de Prueba

### Usuario Principal
```
Email: test@example.com
Password: Test123456!
Role: admin
Company: ACME Corporation
```

### Otros Usuarios
```
admin@acme.com / Admin123456! (Admin at ACME)
manager@acmetech.com / Manager123456! (Manager at ACME Tech)
employee@acmelogistics.com / Employee123456! (Employee at ACME Logistics)
admin@global.com / Global123456! (Admin at Global)
viewer@globalservices.com / Viewer123456! (Viewer at Global Services)
junior@acmetech.com / Junior123456! (Employee at ACME Tech)
```

## � SPaginación y Filtros

### Paginación (Próximamente)

```
GET /users?page=1&limit=20
```

**Response:**
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Filtros

Los endpoints de listado soportan filtros por query params:

```
GET /projects?status=active&startDate[gte]=2024-01-01
GET /contacts?type=lead&email=@gmail.com
GET /deals?stage=negotiation&value[gte]=50000
```

### Ordenamiento (Próximamente)

```
GET /users?sortBy=createdAt&sortOrder=desc
```

## 🎨 Custom Fields

### Crear Custom Field

**Endpoint:** `POST /custom-fields`

**Request:**
```json
{
  "entity": "contacts",
  "fieldName": "industry",
  "fieldType": "select",
  "fieldConfig": {
    "options": [
      { "value": "tech", "label": "Technology" },
      { "value": "finance", "label": "Finance" }
    ]
  },
  "isRequired": false
}
```

### Usar Custom Fields

Al crear/actualizar entidades, incluir `customData`:

```json
{
  "name": "Cliente",
  "email": "cliente@empresa.com",
  "customData": {
    "industry": "tech",
    "budget": 100000,
    "priority_level": "high"
  }
}
```

## 💡 Mejores Prácticas

### 1. Almacenar Tokens de Forma Segura

```javascript
// ❌ NO hacer esto
localStorage.setItem('accessToken', token);

// ✅ Mejor opción
// Usar httpOnly cookies o almacenamiento seguro
```

### 2. Renovar Token Automáticamente

```javascript
// Interceptor para renovar token automáticamente
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const newToken = await refreshAccessToken();
      error.config.headers['Authorization'] = `Bearer ${newToken}`;
      return axios.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

### 3. Validar Datos Antes de Enviar

```javascript
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
  return password.length >= 8;
}
```

### 4. Manejar Estados de Carga

```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

async function fetchData() {
  setLoading(true);
  setError(null);

  try {
    const data = await apiCall('/users');
    // Procesar data
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
```

### 5. Debounce en Búsquedas

```javascript
import { debounce } from 'lodash';

const searchUsers = debounce(async (query) => {
  const users = await fetch(`/users?email=${query}`);
  // Actualizar resultados
}, 300);
```

## 🔒 Seguridad

### Headers Recomendados

```javascript
const headers = {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
  'X-Request-ID': generateUUID(), // Para tracking
};
```

### CORS

El API acepta requests desde:
- `http://localhost:3000` (desarrollo)
- `http://localhost:5173` (Vite)
- Tu dominio en producción

### Rate Limiting

- **Global**: 100 requests por 15 minutos por IP
- **Por Tenant**: Según configuración en TenantConfig
- **Por Endpoint**: Límites específicos en endpoints críticos

Si excedes el límite:
```json
{
  "statusCode": 429,
  "message": "Too Many Requests"
}
```

## 📊 Monitoreo

### Health Check

```javascript
const health = await fetch('http://localhost:3000/health');
// { status: 'ok', database: 'connected', timestamp: '...' }
```

### Métricas (Próximamente)

```javascript
const metrics = await fetch('/metrics');
// Métricas de performance y uso
```

## 🔗 Recursos Adicionales

### Documentación
- `/docs/ARCHITECTURE.md` - Arquitectura del sistema
- `/docs/MULTI_TENANT.md` - Multi-tenancy
- `/docs/PERMISSIONS.md` - Sistema de permisos
- `/docs/EVENTS.md` - Sistema de eventos
- `/docs/API_GUIDE.md` - Guía completa de API

### Ejemplos de Integración

**React + TypeScript:**
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Uso
const users = await api.get('/users');
```

**Vue + Composition API:**
```typescript
import { ref } from 'vue';

export function useApi() {
  const loading = ref(false);
  const error = ref(null);

  async function apiCall(endpoint, options) {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        ...options,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          ...options.headers
        }
      });

      return await response.json();
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  }

  return { apiCall, loading, error };
}
```

**Angular + HttpClient:**
```typescript
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  getUsers() {
    return this.http.get(`${this.baseUrl}/users`, {
      headers: this.getHeaders()
    });
  }
}
```

## 📞 Soporte

Para dudas sobre la API:
- Revisar documentación en `/docs`
- Verificar ejemplos en este documento
- Consultar códigos de error
- Revisar logs del servidor para debugging
