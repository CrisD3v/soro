# SORO API

Sistema SaaS multi-tenant construido con NestJS, Prisma y PostgreSQL siguiendo arquitectura hexagonal, DDD y principios SOLID.

## ✨ Características Principales

- 🏢 **Multi-tenant**: Aislamiento completo por empresa con configuración personalizada
- 🔐 **Autenticación JWT**: Access tokens + refresh tokens con rotación + endpoint /me
- 👥 **RBAC Jerárquico**: Sistema de permisos con scopes (GLOBAL, COMPANY, PROJECT, RESOURCE)
- ⚙️ **Settings Module**: Sistema de configuraciones multi-tenant con categorías
- 🔄 **Event-Driven**: Procesamiento asíncrono de eventos con handlers
- 🎨 **Custom Fields**: Campos dinámicos sin modificar schema
- 🤖 **Workflows**: Automatizaciones configurables
- 📊 **CRM Integrado**: Gestión de contactos y oportunidades
- 💰 **Facturación**: Sistema completo de invoicing y pagos
- 📁 **Gestión Documental**: Upload y organización de archivos
- 🔌 **API Pública**: REST API con API Keys
- 📈 **Health & Metrics**: Monitoreo completo del sistema con métricas de CPU, memoria y disco
- 🔍 **Auditoría**: Tracking completo de cambios

## 🏗️ Arquitectura

El proyecto sigue **Arquitectura Hexagonal (Ports & Adapters)** con la siguiente estructura:

```
src/context/
├── auth/           # Módulo de autenticación JWT + /me endpoint
├── user/           # Módulo de usuarios
├── company/        # Módulo de empresas
├── role/           # Módulo de roles y permisos
├── project/        # Módulo de proyectos
├── task/           # Módulo de tareas
├── contact/        # Módulo de contactos (CRM)
├── deal/           # Módulo de oportunidades
├── invoice/        # Módulo de facturación
├── notification/   # Módulo de notificaciones
├── document/       # Módulo de documentos
├── event/          # Módulo de eventos
├── workflow/       # Módulo de workflows
├── custom-field/   # Módulo de campos personalizados
├── setting/        # Módulo de configuraciones (NUEVO v2.1.0)
└── health/         # Health check mejorado con métricas del sistema
```

Cada módulo contiene:
```
module/
├── domain/
│   ├── entities/           # Entidades de dominio
│   └── ports/              # Interfaces (contratos)
├── application/
│   ├── use-cases/          # Casos de uso (lógica de negocio)
│   └── dto/                # Data Transfer Objects
└── infrastructure/
    ├── persistence/        # Implementación de repositorios
    ├── controllers/        # Controladores REST
    └── mappers/            # Conversión Prisma ↔ Domain
```

## 🚀 Instalación

### Requisitos previos
- Node.js >= 18
- PostgreSQL
- pnpm

### Pasos

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd soro-api
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/soro_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

4. **Ejecutar migraciones de Prisma**
```bash
pnpm prisma migrate dev
```

5. **Generar cliente de Prisma**
```bash
pnpm prisma generate
```

6. **Iniciar el servidor**
```bash
# Modo desarrollo
pnpm run start:dev

# Modo producción
pnpm run build
pnpm run start:prod
```

El servidor estará disponible en `http://localhost:3000`

## 📚 API Endpoints

### 🏥 Health Check

#### GET /health
Verifica el estado de la API y la conexión a la base de datos.

**Response:**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-11-11T10:30:00.000Z"
}
```

---

### 🔐 Autenticación

La API utiliza **cookies HttpOnly** para almacenar tokens JWT de forma segura, protegiendo contra ataques XSS y CSRF.

#### Configuración de Cookies

Todas las cookies tienen los siguientes atributos de seguridad:
- **HttpOnly**: `true` - No accesibles desde JavaScript (previene XSS)
- **Secure**: `true` en producción - Solo se envían por HTTPS
- **SameSite**: `strict` - Previene ataques CSRF
- **Path**: `/` - Disponibles en toda la aplicación

**Cookies establecidas:**
- `accessToken`: Expira en 15 minutos
- `refreshToken`: Expira en 7 días

#### Configuración del Cliente

Para que las cookies funcionen correctamente, el cliente debe incluir credenciales en las peticiones:

**Fetch API:**
```javascript
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  credentials: 'include', // ← Importante
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password })
})
```

**Axios:**
```javascript
axios.post('http://localhost:3000/api/auth/login',
  { email, password },
  { withCredentials: true } // ← Importante
)
```

#### POST /auth/login
Iniciar sesión con email y contraseña. Los tokens se establecen automáticamente como cookies HttpOnly.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John",
    "lastName": "Doe"
  }
}
```

**Cookies establecidas:**
- `accessToken` (HttpOnly, 15 min)
- `refreshToken` (HttpOnly, 7 días)

#### POST /auth/refresh
Renovar access token. Lee el refreshToken desde la cookie automáticamente.

**Request:** No requiere body

**Response:**
```json
{
  "message": "Tokens refreshed successfully"
}
```

**Cookies actualizadas:**
- `accessToken` (nuevo token, 15 min)
- `refreshToken` (nuevo token, 7 días)

#### POST /auth/logout
Cerrar sesión. Elimina las cookies de tokens.

**Request:** No requiere body (lee cookies automáticamente)

**Response:** 204 No Content

**Cookies eliminadas:**
- `accessToken`
- `refreshToken`

---

### 👥 Usuarios

#### POST /users
Crear un nuevo usuario.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John",
  "lastName": "Doe",
  "documentNumber": "1234567890",
  "documentType": "CC",
  "phone": "+573001234567",
  "companyId": "company-uuid"
}
```

**Response:**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "documentNumber": "1234567890",
  "documentType": "CC",
  "phone": "+573001234567",
  "companyId": "company-uuid",
  "roles": [],
  "signature": null,
  "createdAt": "2024-11-11T10:30:00.000Z",
  "updatedAt": "2024-11-11T10:30:00.000Z"
}
```

#### GET /users/:id
Obtener un usuario por ID.

**Response:**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "name": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "documentNumber": "1234567890",
  "documentType": "CC",
  "phone": "+573001234567",
  "companyId": "company-uuid",
  "roles": [
    {
      "id": "role-uuid",
      "roleId": "admin-role-uuid",
      "companyId": "company-uuid",
      "createdAt": "2024-11-11T10:30:00.000Z"
    }
  ],
  "signature": {
    "id": "signature-uuid",
    "signature": "base64-signature-data",
    "createdAt": "2024-11-11T10:30:00.000Z",
    "updatedAt": "2024-11-11T10:30:00.000Z"
  },
  "createdAt": "2024-11-11T10:30:00.000Z",
  "updatedAt": "2024-11-11T10:30:00.000Z"
}
```

#### GET /users
Listar usuarios con filtros opcionales.

**Query params:**
- `companyId` (opcional): Filtrar por empresa
- `email` (opcional): Buscar por email (parcial)
- `documentNumber` (opcional): Buscar por número de documento

**Example:** `GET /users?companyId=company-uuid&email=john`

**Response:**
```json
[
  {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "documentNumber": "1234567890",
    "documentType": "CC",
    "phone": "+573001234567",
    "companyId": "company-uuid",
    "roles": [],
    "signature": null,
    "createdAt": "2024-11-11T10:30:00.000Z",
    "updatedAt": "2024-11-11T10:30:00.000Z"
  }
]
```

#### PUT /users/:id
Actualizar un usuario.

**Request:**
```json
{
  "name": "Jane",
  "lastName": "Smith",
  "phone": "+573009876543",
  "email": "newemail@example.com"
}
```

**Response:** Igual que GET /users/:id

#### POST /users/:id/roles
Asignar un rol a un usuario en una empresa.

**Request:**
```json
{
  "roleId": "role-uuid",
  "companyId": "company-uuid"
}
```

#### POST /users/:id/signature
Asignar o actualizar la firma de un usuario.

**Request:**
```json
{
  "signature": "base64-encoded-signature-image"
}
```

---

### 🏢 Empresas

#### POST /companies
Crear una nueva empresa.

**Request:**
```json
{
  "name": "ACME Corporation",
  "nit": "900123456-7",
  "address": "Calle 123 #45-67",
  "phone": "+573001234567",
  "parentId": "parent-company-uuid"
}
```

**Response:**
```json
{
  "id": "company-uuid",
  "name": "ACME Corporation",
  "nit": "900123456-7",
  "address": "Calle 123 #45-67",
  "phone": "+573001234567",
  "parentId": "parent-company-uuid",
  "deletedAt": null,
  "createdAt": "2024-11-11T10:30:00.000Z",
  "updatedAt": "2024-11-11T10:30:00.000Z",
  "parent": {
    "id": "parent-company-uuid",
    "name": "Parent Company",
    "nit": "900000000-0",
    "address": "...",
    "phone": "...",
    "parentId": null,
    "deletedAt": null,
    "createdAt": "2024-11-11T10:00:00.000Z",
    "updatedAt": "2024-11-11T10:00:00.000Z"
  },
  "children": []
}
```

#### GET /companies/:id
Obtener una empresa por ID.

**Query params:**
- `includeDeleted` (opcional): `true` para incluir empresas eliminadas

**Example:** `GET /companies/uuid?includeDeleted=true`

**Response:** Igual que POST /companies

#### GET /companies
Listar empresas con filtros opcionales.

**Query params:**
- `parentId` (opcional): Filtrar por empresa padre (usar vacío para empresas raíz)
- `name` (opcional): Buscar por nombre (parcial)
- `includeDeleted` (opcional): `true` para incluir empresas eliminadas

**Example:** `GET /companies?parentId=&name=ACME&includeDeleted=false`

**Response:**
```json
[
  {
    "id": "company-uuid",
    "name": "ACME Corporation",
    "nit": "900123456-7",
    "address": "Calle 123 #45-67",
    "phone": "+573001234567",
    "parentId": null,
    "deletedAt": null,
    "createdAt": "2024-11-11T10:30:00.000Z",
    "updatedAt": "2024-11-11T10:30:00.000Z",
    "children": [
      {
        "id": "child-company-uuid",
        "name": "ACME Subsidiary",
        "nit": "900999999-9",
        "address": "...",
        "phone": "...",
        "parentId": "company-uuid",
        "deletedAt": null,
        "createdAt": "2024-11-11T11:00:00.000Z",
        "updatedAt": "2024-11-11T11:00:00.000Z"
      }
    ]
  }
]
```

#### GET /companies/:id/hierarchy
Obtener el árbol completo de jerarquía de una empresa (incluye hijos, nietos, etc.).

**Response:**
```json
{
  "id": "company-uuid",
  "name": "ACME Corporation",
  "nit": "900123456-7",
  "address": "Calle 123 #45-67",
  "phone": "+573001234567",
  "parentId": null,
  "deletedAt": null,
  "createdAt": "2024-11-11T10:30:00.000Z",
  "updatedAt": "2024-11-11T10:30:00.000Z",
  "children": [
    {
      "id": "child-1-uuid",
      "name": "ACME Subsidiary 1",
      "nit": "900111111-1",
      "children": [
        {
          "id": "grandchild-uuid",
          "name": "ACME Sub-subsidiary",
          "nit": "900222222-2",
          "children": []
        }
      ]
    },
    {
      "id": "child-2-uuid",
      "name": "ACME Subsidiary 2",
      "nit": "900333333-3",
      "children": []
    }
  ]
}
```

#### PUT /companies/:id
Actualizar una empresa.

**Request:**
```json
{
  "name": "ACME Corp Updated",
  "address": "Nueva dirección",
  "phone": "+573009999999",
  "parentId": "new-parent-uuid"
}
```

**Response:** Igual que GET /companies/:id

#### DELETE /companies/:id
Eliminar una empresa (soft delete).

**Response:** 204 No Content

**Nota:** La empresa no se elimina físicamente, solo se marca con `deletedAt`.

#### PATCH /companies/:id/restore
Restaurar una empresa eliminada.

**Response:** 204 No Content

---

## 🔒 Autenticación y Autorización

### Proteger rutas

Para proteger un endpoint, usa el guard `JwtAuthGuard`:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@context/auth/infrastructure/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('protected')
getProtectedResource() {
  return 'This is protected';
}
```

### Obtener usuario actual

Usa el decorador `@CurrentUser()`:

```typescript
import { CurrentUser } from '@context/auth/infrastructure/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@CurrentUser() user) {
  return user; // { sub, email, companyId, roles }
}
```

### Proteger por roles

Usa el guard `RolesGuard` y el decorador `@Roles()`:

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@context/auth/infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from '@context/auth/infrastructure/guards/roles.guard';
import { Roles } from '@context/auth/infrastructure/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager')
@Get('admin-only')
adminOnly() {
  return 'Only admins and managers';
}
```

---

## 🗄️ Base de Datos

### Modelos principales

- **User**: Usuarios del sistema
- **Company**: Empresas (con jerarquía padre-hijo)
- **Role**: Roles del sistema
- **Permission**: Permisos
- **UserRole**: Asignación de roles a usuarios por empresa
- **Signature**: Firmas digitales de usuarios
- **RefreshToken**: Tokens de refresco para autenticación
- **EnlacedRecords**: Registros enlazados

### Tipos de documento

```typescript
enum typeDocument {
  CC  // Cédula de Ciudadanía
  CE  // Cédula de Extranjería
  TI  // Tarjeta de Identidad
}
```

### Comandos útiles de Prisma

```bash
# Crear una nueva migración
pnpm prisma migrate dev --name migration_name

# Aplicar migraciones en producción
pnpm prisma migrate deploy

# Abrir Prisma Studio (GUI)
pnpm prisma studio

# Resetear la base de datos
pnpm prisma migrate reset

# Generar cliente de Prisma
pnpm prisma generate
```

---

## 🧪 Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov
```

---

## 📦 Tecnologías

- **NestJS** - Framework backend
- **Prisma** - ORM
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **bcrypt** - Hash de contraseñas
- **class-validator** - Validación de DTOs
- **class-transformer** - Transformación de objetos

---

## 🎯 Principios aplicados

- **Arquitectura Hexagonal**: Separación clara entre dominio, aplicación e infraestructura
- **SOLID**: Principios de diseño orientado a objetos
- **DDD**: Domain-Driven Design en las entidades
- **Clean Code**: Código limpio y mantenible
- **Dependency Injection**: Inversión de dependencias con NestJS

---

## 📝 Licencia

MIT
