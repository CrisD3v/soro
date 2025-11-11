# 📚 SORO API - Documentación Completa

## 🔗 Base URL
```
http://localhost:3000/api
```

## 📋 Tabla de Contenidos
- [Autenticación](#autenticación)
- [Usuarios](#usuarios)
- [Empresas](#empresas)
- [Roles](#roles)
- [Permisos](#permisos)
- [Códigos de Estado](#códigos-de-estado)
- [Errores Comunes](#errores-comunes)

---

## 🔐 Autenticación

### Login

Obtener tokens de acceso y refresco.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "Test123456!"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLXV1aWQiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJjb21wYW55SWQiOiJjb21wYW55LXV1aWQiLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE3MzE0MjAwMDAsImV4cCI6MTczMTQyMDkwMH0.signature",
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "test@example.com",
    "name": "Test",
    "lastName": "User"
  }
}
```

**Errores:**
- `401 Unauthorized` - Credenciales inválidas

---

### Refresh Token

Renovar el access token usando el refresh token.

**Endpoint:** `POST /auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
}
```

**Response:** `200 OK`
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "new-refresh-token-here"
}
```

**Errores:**
- `401 Unauthorized` - Refresh token inválido o expirado

---

### Logout

Cerrar sesión e invalidar el refresh token.

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "refreshToken": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
}
```

**Response:** `204 No Content`

---

## 👥 Usuarios

### Crear Usuario

**Endpoint:** `POST /users`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "name": "John",
  "lastName": "Doe",
  "documentNumber": "1234567890",
  "documentType": "CC",
  "phone": "+573001234567",
  "companyId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Tipos de documento válidos:**
- `CC` - Cédula de Ciudadanía
- `CE` - Cédula de Extranjería
- `TI` - Tarjeta de Identidad

**Response:** `201 Created`
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "email": "newuser@example.com",
  "name": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "documentNumber": "1234567890",
  "documentType": "CC",
  "phone": "+573001234567",
  "companyId": "550e8400-e29b-41d4-a716-446655440000",
  "roles": [],
  "signature": null,
  "createdAt": "2024-11-11T10:30:00.000Z",
  "updatedAt": "2024-11-11T10:30:00.000Z"
}
```

**Errores:**
- `409 Conflict` - Email o documento ya existe
- `404 Not Found` - Empresa no encontrada

---

### Obtener Usuario

**Endpoint:** `GET /users/:id`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:** `200 OK`
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "email": "newuser@example.com",
  "name": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "documentNumber": "1234567890",
  "documentType": "CC",
  "phone": "+573001234567",
  "companyId": "550e8400-e29b-41d4-a716-446655440000",
  "roles": [
    {
      "id": "role-assignment-uuid",
      "roleId": "admin-role-uuid",
      "companyId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2024-11-11T10:30:00.000Z"
    }
  ],
  "signature": {
    "id": "signature-uuid",
    "signature": "data:image/png;base64,iVBORw0KGgo...",
    "createdAt": "2024-11-11T10:30:00.000Z",
    "updatedAt": "2024-11-11T10:30:00.000Z"
  },
  "createdAt": "2024-11-11T10:30:00.000Z",
  "updatedAt": "2024-11-11T10:30:00.000Z"
}
```

**Errores:**
- `404 Not Found` - Usuario no encontrado

---

### Listar Usuarios

**Endpoint:** `GET /users`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `companyId` (opcional) - Filtrar por empresa
- `email` (opcional) - Buscar por email (búsqueda parcial)
- `documentNumber` (opcional) - Buscar por número de documento

**Ejemplos:**
```
GET /users
GET /users?companyId=550e8400-e29b-41d4-a716-446655440000
GET /users?email=john
GET /users?documentNumber=1234567890
```

**Response:** `200 OK`
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "email": "newuser@example.com",
    "name": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "documentNumber": "1234567890",
    "documentType": "CC",
    "phone": "+573001234567",
    "companyId": "550e8400-e29b-41d4-a716-446655440000",
    "roles": [],
    "signature": null,
    "createdAt": "2024-11-11T10:30:00.000Z",
    "updatedAt": "2024-11-11T10:30:00.000Z"
  }
]
```

---

### Actualizar Usuario

**Endpoint:** `PUT /users/:id`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:** (todos los campos son opcionales)
```json
{
  "name": "Jane",
  "lastName": "Smith",
  "email": "newemail@example.com",
  "phone": "+573009876543",
  "password": "NewPassword123!"
}
```

**Response:** `200 OK`
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "email": "newemail@example.com",
  "name": "Jane",
  "lastName": "Smith",
  "fullName": "Jane Smith",
  "documentNumber": "1234567890",
  "documentType": "CC",
  "phone": "+573009876543",
  "companyId": "550e8400-e29b-41d4-a716-446655440000",
  "roles": [],
  "signature": null,
  "createdAt": "2024-11-11T10:30:00.000Z",
  "updatedAt": "2024-11-11T11:00:00.000Z"
}
```

**Errores:**
- `404 Not Found` - Usuario no encontrado
- `409 Conflict` - Email ya existe

---

### Asignar Rol a Usuario

**Endpoint:** `POST /users/:id/roles`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "roleId": "admin-role-uuid",
  "companyId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:** `204 No Content`

**Errores:**
- `404 Not Found` - Usuario no encontrado

---

### Asignar/Actualizar Firma

**Endpoint:** `POST /users/:id/signature`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "signature": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
}
```

**Response:** `204 No Content`

**Errores:**
- `404 Not Found` - Usuario no encontrado

---

## 🏢 Empresas

### Crear Empresa

**Endpoint:** `POST /companies`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "name": "ACME Corporation",
  "nit": "900123456-7",
  "address": "Calle 100 #15-20, Bogotá",
  "phone": "+573001234567",
  "parentId": null
}
```

**Response:** `201 Created`
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "name": "ACME Corporation",
  "nit": "900123456-7",
  "address": "Calle 100 #15-20, Bogotá",
  "phone": "+573001234567",
  "parentId": null,
  "deletedAt": null,
  "createdAt": "2024-11-11T10:30:00.000Z",
  "updatedAt": "2024-11-11T10:30:00.000Z",
  "parent": null,
  "children": []
}
```

**Errores:**
- `409 Conflict` - NIT ya existe
- `404 Not Found` - Empresa padre no encontrada (si se proporciona parentId)

---

### Obtener Empresa

**Endpoint:** `GET /companies/:id`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `includeDeleted` (opcional) - `true` para incluir empresas eliminadas

**Ejemplo:**
```
GET /companies/770e8400-e29b-41d4-a716-446655440002?includeDeleted=true
```

**Response:** `200 OK`
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "name": "ACME Corporation",
  "nit": "900123456-7",
  "address": "Calle 100 #15-20, Bogotá",
  "phone": "+573001234567",
  "parentId": null,
  "deletedAt": null,
  "createdAt": "2024-11-11T10:30:00.000Z",
  "updatedAt": "2024-11-11T10:30:00.000Z",
  "parent": null,
  "children": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "name": "ACME Tech Solutions",
      "nit": "900234567-8",
      "address": "Carrera 7 #71-21, Bogotá",
      "phone": "+573002345678",
      "parentId": "770e8400-e29b-41d4-a716-446655440002",
      "deletedAt": null,
      "createdAt": "2024-11-11T10:35:00.000Z",
      "updatedAt": "2024-11-11T10:35:00.000Z"
    }
  ]
}
```

**Errores:**
- `404 Not Found` - Empresa no encontrada

---

### Listar Empresas

**Endpoint:** `GET /companies`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Query Parameters:**
- `parentId` (opcional) - Filtrar por empresa padre (vacío para empresas raíz)
- `name` (opcional) - Buscar por nombre (búsqueda parcial)
- `includeDeleted` (opcional) - `true` para incluir empresas eliminadas

**Ejemplos:**
```
GET /companies
GET /companies?parentId=770e8400-e29b-41d4-a716-446655440002
GET /companies?parentId=&name=ACME
GET /companies?includeDeleted=true
```

**Response:** `200 OK`
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "name": "ACME Corporation",
    "nit": "900123456-7",
    "address": "Calle 100 #15-20, Bogotá",
    "phone": "+573001234567",
    "parentId": null,
    "deletedAt": null,
    "createdAt": "2024-11-11T10:30:00.000Z",
    "updatedAt": "2024-11-11T10:30:00.000Z",
    "children": []
  }
]
```

---

### Obtener Jerarquía de Empresa

Obtiene el árbol completo de una empresa con todas sus subsidiarias.

**Endpoint:** `GET /companies/:id/hierarchy`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:** `200 OK`
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "name": "ACME Corporation",
  "nit": "900123456-7",
  "address": "Calle 100 #15-20, Bogotá",
  "phone": "+573001234567",
  "parentId": null,
  "deletedAt": null,
  "createdAt": "2024-11-11T10:30:00.000Z",
  "updatedAt": "2024-11-11T10:30:00.000Z",
  "children": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "name": "ACME Tech Solutions",
      "nit": "900234567-8",
      "address": "Carrera 7 #71-21, Bogotá",
      "phone": "+573002345678",
      "parentId": "770e8400-e29b-41d4-a716-446655440002",
      "deletedAt": null,
      "createdAt": "2024-11-11T10:35:00.000Z",
      "updatedAt": "2024-11-11T10:35:00.000Z",
      "children": [
        {
          "id": "990e8400-e29b-41d4-a716-446655440004",
          "name": "ACME Tech Division",
          "nit": "900345678-9",
          "address": "...",
          "phone": "...",
          "parentId": "880e8400-e29b-41d4-a716-446655440003",
          "deletedAt": null,
          "createdAt": "2024-11-11T10:40:00.000Z",
          "updatedAt": "2024-11-11T10:40:00.000Z",
          "children": []
        }
      ]
    }
  ]
}
```

---

### Actualizar Empresa

**Endpoint:** `PUT /companies/:id`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:** (todos los campos son opcionales)
```json
{
  "name": "ACME Corp Updated",
  "address": "Nueva dirección",
  "phone": "+573009999999",
  "parentId": "new-parent-uuid"
}
```

**Response:** `200 OK`
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "name": "ACME Corp Updated",
  "nit": "900123456-7",
  "address": "Nueva dirección",
  "phone": "+573009999999",
  "parentId": "new-parent-uuid",
  "deletedAt": null,
  "createdAt": "2024-11-11T10:30:00.000Z",
  "updatedAt": "2024-11-11T11:00:00.000Z",
  "parent": null,
  "children": []
}
```

**Errores:**
- `404 Not Found` - Empresa no encontrada
- `409 Conflict` - Empresa no puede ser su propio padre

---

### Eliminar Empresa (Soft Delete)

**Endpoint:** `DELETE /companies/:id`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:** `204 No Content`

**Nota:** La empresa no se elimina físicamente, solo se marca con `deletedAt`.

**Errores:**
- `404 Not Found` - Empresa no encontrada
- `409 Conflict` - Empresa ya está eliminada

---

### Restaurar Empresa

**Endpoint:** `PATCH /companies/:id/restore`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:** `204 No Content`

**Errores:**
- `404 Not Found` - Empresa no encontrada
- `409 Conflict` - Empresa no está eliminada

---

## 🎭 Roles

### Crear Rol

**Endpoint:** `POST /roles`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "name": "supervisor"
}
```

**Response:** `201 Created`
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "name": "supervisor",
  "permissionCount": 0,
  "permissions": [],
  "createdAt": "2024-11-11T10:30:00.000Z",
  "updatedAt": "2024-11-11T10:30:00.000Z"
}
```

**Errores:**
- `409 Conflict` - Nombre de rol ya existe

---

### Obtener Rol

**Endpoint:** `GET /roles/:id`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:** `200 OK`
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "name": "supervisor",
  "permissionCount": 3,
  "permissions": [
    {
      "id": "perm-uuid-1",
      "name": "users.read",
      "description": "View users"
    },
    {
      "id": "perm-uuid-2",
      "name": "companies.read",
      "description": "View companies"
    },
    {
      "id": "perm-uuid-3",
      "name": "records.create",
      "description": "Create records"
    }
  ],
  "createdAt": "2024-11-11T10:30:00.000Z",
  "updatedAt": "2024-11-11T10:30:00.000Z"
}
```

**Errores:**
- `404 Not Found` - Rol no encontrado

---

### Listar Roles

**Endpoint:** `GET /roles`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:** `200 OK`
```json
[
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440005",
    "name": "admin",
    "permissionCount": 16,
    "permissions": [
      {
        "id": "perm-uuid-1",
        "name": "users.create",
        "description": "Create new users"
      }
    ],
    "createdAt": "2024-11-11T10:30:00.000Z",
    "updatedAt": "2024-11-11T10:30:00.000Z"
  },
  {
    "id": "bb0e8400-e29b-41d4-a716-446655440006",
    "name": "manager",
    "permissionCount": 12,
    "permissions": [],
    "createdAt": "2024-11-11T10:31:00.000Z",
    "updatedAt": "2024-11-11T10:31:00.000Z"
  }
]
```

---

### Actualizar Rol

**Endpoint:** `PUT /roles/:id`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "name": "super-admin"
}
```

**Response:** `200 OK`
```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440005",
  "name": "super-admin",
  "permissionCount": 16,
  "permissions": [],
  "createdAt": "2024-11-11T10:30:00.000Z",
  "updatedAt": "2024-11-11T11:00:00.000Z"
}
```

**Errores:**
- `404 Not Found` - Rol no encontrado
- `409 Conflict` - Nombre de rol ya existe

---

### Eliminar Rol

**Endpoint:** `DELETE /roles/:id`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:** `204 No Content`

**Nota:** Elimina el rol y todas sus asignaciones (cascade).

**Errores:**
- `404 Not Found` - Rol no encontrado

---

### Asignar Permiso a Rol

**Endpoint:** `POST /roles/:id/permissions`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Request Body:**
```json
{
  "permissionId": "perm-uuid-1"
}
```

**Response:** `204 No Content`

**Errores:**
- `404 Not Found` - Rol no encontrado
- `409 Conflict` - Rol ya tiene este permiso

---

### Remover Permiso de Rol

**Endpoint:** `DELETE /roles/:id/permissions/:permissionId`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:** `204 No Content`

**Errores:**
- `404 Not Found` - Rol no encontrado o no tiene este permiso

---

### Listar Permisos de un Rol

**Endpoint:** `GET /roles/:id/permissions`

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:** `200 OK`
```json
[
  {
    "id": "perm-uuid-1",
    "name": "users.create",
    "description": "Create new users"
  },
  {
    "id": "perm-uuid-2",
    "name": "users.read",
    "description": "View users"
  },
  {
    "id": "perm-uuid-3",
    "name": "users.update",
    "description": "Update users"
  }
]
```

---

## 🔑 Permisos Disponibles

### Usuarios
- `users.create` - Crear usuarios
- `users.read` - Ver usuarios
- `users.update` - Actualizar usuarios
- `users.delete` - Eliminar usuarios

### Empresas
- `companies.create` - Crear empresas
- `companies.read` - Ver empresas
- `companies.update` - Actualizar empresas
- `companies.delete` - Eliminar empresas

### Roles
- `roles.create` - Crear roles
- `roles.read` - Ver roles
- `roles.update` - Actualizar roles
- `roles.delete` - Eliminar roles

### Registros
- `records.create` - Crear registros
- `records.read` - Ver registros
- `records.update` - Actualizar registros
- `records.delete` - Eliminar registros

---

## 📊 Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| `200 OK` | Solicitud exitosa |
| `201 Created` | Recurso creado exitosamente |
| `204 No Content` | Operación exitosa sin contenido de respuesta |
| `400 Bad Request` | Datos de entrada inválidos |
| `401 Unauthorized` | No autenticado o token inválido |
| `403 Forbidden` | No tiene permisos para esta acción |
| `404 Not Found` | Recurso no encontrado |
| `409 Conflict` | Conflicto con el estado actual (ej: duplicado) |
| `500 Internal Server Error` | Error del servidor |

---

## ⚠️ Errores Comunes

### Error de Validación (400)
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

### No Autorizado (401)
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Recurso No Encontrado (404)
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

### Conflicto (409)
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

---

## 🧪 Datos de Prueba

Después de ejecutar el seeder (`pnpm prisma:seed`), puedes usar estas credenciales:

### Usuario de Prueba
```
Email: test@example.com
Password: Test123456!
Role: Admin en ACME Corporation
```

### Otros Usuarios
```
admin@acme.com / Admin123456! (Admin)
manager@acmetech.com / Manager123456! (Manager)
employee@acmelogistics.com / Employee123456! (Employee)
viewer@globalservices.com / Viewer123456! (Viewer)
```

---

## 📝 Notas Importantes

1. **Autenticación**: Todos los endpoints excepto `/auth/login` y `/auth/refresh` requieren el header `Authorization: Bearer <token>`

2. **Access Token**: Expira en 15 minutos. Usa el refresh token para obtener uno nuevo.

3. **Refresh Token**: Expira en 7 días. Después de usarlo, se genera uno nuevo.

4. **Soft Delete**: Las empresas eliminadas no se borran físicamente, solo se marcan con `deletedAt`.

5. **Jerarquía de Empresas**: Una empresa puede tener múltiples subsidiarias, pero solo un padre.

6. **Roles por Empresa**: Un usuario puede tener diferentes roles en diferentes empresas.

7. **Validaciones**:
   - Email debe ser válido
   - Password mínimo 8 caracteres
   - NIT debe ser único
   - Documento debe ser único
   - Phone debe ser único para empresas

---

## 🔄 Flujo de Autenticación Típico

```
1. POST /auth/login
   → Obtener accessToken y refreshToken

2. Usar accessToken en headers para requests
   Authorization: Bearer <accessToken>

3. Cuando accessToken expire (15 min):
   POST /auth/refresh con refreshToken
   → Obtener nuevo accessToken y refreshToken

4. Al cerrar sesión:
   POST /auth/logout
   → Invalidar refreshToken
```

---

## 📞 Soporte

Para más información, consulta el README.md del proyecto o contacta al equipo de desarrollo.
