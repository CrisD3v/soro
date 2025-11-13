# Guía Completa de la API

## 🚀 Base URL

```
Development: http://localhost:3000
Production: https://api.yourdomain.com
```

## 🔐 Autenticación

Todos los endpoints (excepto `/auth/login` y `/auth/refresh`) requieren un JWT token:

```http
Authorization: Bearer <access_token>
```

## 📚 Endpoints Principales

### Auth
- `POST /auth/login` - Iniciar sesión
- `POST /auth/refresh` - Renovar token
- `POST /auth/logout` - Cerrar sesión

### Users
- `POST /users` - Crear usuario
- `GET /users` - Listar usuarios
- `GET /users/:id` - Obtener usuario
- `PUT /users/:id` - Actualizar usuario
- `POST /users/:id/roles` - Asignar rol
- `POST /users/:id/signature` - Asignar firma

### Companies
- `POST /companies` - Crear empresa
- `GET /companies` - Listar empresas
- `GET /companies/:id` - Obtener empresa
- `GET /companies/:id/hierarchy` - Obtener jerarquía
- `PUT /companies/:id` - Actualizar empresa
- `DELETE /companies/:id` - Eliminar (soft delete)
- `PATCH /companies/:id/restore` - Restaurar empresa

### Roles
- `POST /roles` - Crear rol
- `GET /roles` - Listar roles
- `GET /roles/:id` - Obtener rol
- `PUT /roles/:id` - Actualizar rol
- `DELETE /roles/:id` - Eliminar rol
- `POST /roles/:id/permissions` - Asignar permiso
- `DELETE /roles/:id/permissions/:permissionId` - Remover permiso
- `GET /roles/:id/permissions` - Listar permisos del rol

### Projects
- `POST /projects` - Crear proyecto
- `GET /projects` - Listar proyectos
- `GET /projects/:id` - Obtener proyecto
- `PUT /projects/:id` - Actualizar proyecto
- `DELETE /projects/:id` - Eliminar proyecto

### Tasks
- `POST /projects/:projectId/tasks` - Crear tarea
- `GET /projects/:projectId/tasks` - Listar tareas
- `GET /tasks/:id` - Obtener tarea
- `PUT /tasks/:id` - Actualizar tarea
- `DELETE /tasks/:id` - Eliminar tarea

### Contacts (CRM)
- `POST /contacts` - Crear contacto
- `GET /contacts` - Listar contactos
- `GET /contacts/:id` - Obtener contacto
- `PUT /contacts/:id` - Actualizar contacto
- `DELETE /contacts/:id` - Eliminar contacto

### Deals
- `POST /deals` - Crear oportunidad
- `GET /deals` - Listar oportunidades
- `GET /deals/:id` - Obtener oportunidad
- `PUT /deals/:id` - Actualizar oportunidad
- `DELETE /deals/:id` - Eliminar oportunidad

### Invoices
- `POST /invoices` - Crear factura
- `GET /invoices` - Listar facturas
- `GET /invoices/:id` - Obtener factura
- `PUT /invoices/:id` - Actualizar factura
- `POST /invoices/:id/send` - Enviar factura
- `POST /invoices/:id/payments` - Registrar pago

### Documents
- `POST /documents` - Subir documento
- `GET /documents` - Listar documentos
- `GET /documents/:id` - Obtener documento
- `DELETE /documents/:id` - Eliminar documento

### Notifications
- `GET /notifications` - Listar notificaciones
- `PATCH /notifications/:id/read` - Marcar como leída
- `DELETE /notifications/:id` - Eliminar notificación

### Custom Fields
- `POST /custom-fields` - Crear campo personalizado
- `GET /custom-fields` - Listar campos
- `PUT /custom-fields/:id` - Actualizar campo
- `DELETE /custom-fields/:id` - Eliminar campo

## 📖 Ejemplos Detallados

Ver README.md para ejemplos completos de requests y responses.

## 🔗 Paginación

```http
GET /users?page=1&limit=20
```

Response:
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

## 🔍 Filtros

```http
GET /projects?status=active&startDate[gte]=2024-01-01
```

## 📊 Ordenamiento

```http
GET /users?sortBy=createdAt&sortOrder=desc
```

## ⚠️ Códigos de Error

- `400` - Bad Request (validación fallida)
- `401` - Unauthorized (token inválido/expirado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found
- `409` - Conflict (recurso duplicado)
- `500` - Internal Server Error
