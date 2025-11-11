# SORO API

API REST construida con NestJS, Prisma y PostgreSQL siguiendo arquitectura hexagonal y principios SOLID.

## 🏗️ Arquitectura

El proyecto sigue **Arquitectura Hexagonal (Ports & Adapters)** con la siguiente estructura:

```
src/context/
├── auth/           # Módulo de autenticación JWT
├── user/           # Módulo de usuarios
├── company/        # Módulo de empresas
└── health/         # Health check
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

#### POST /auth/login
Iniciar sesión con email y contraseña.

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
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a1b2c3d4e5f6...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John",
    "lastName": "Doe"
  }
}
```

#### POST /auth/refresh
Renovar access token usando refresh token.

**Request:**
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "new-refresh-token..."
}
```

#### POST /auth/logout
Cerrar sesión (requiere autenticación).

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request:**
```json
{
  "refreshToken": "a1b2c3d4e5f6..."
}
```

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
