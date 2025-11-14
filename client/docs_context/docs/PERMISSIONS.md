# Sistema de Permisos Jerárquico

## 🔐 Arquitectura de Permisos

El sistema implementa **RBAC (Role-Based Access Control)** con **scopes jerárquicos**:

```
GLOBAL (Sistema)
  ↓
COMPANY (Empresa/Tenant)
  ↓
PROJECT (Proyecto específico)
  ↓
RESOURCE (Recurso individual)
```

## 📊 Modelo de Datos

### Permission Model

```prisma
model Permission {
  id          String          @id
  name        String          @unique  // "users.create"
  description String?
  resource    String          // "users", "projects", "invoices"
  action      String          // "create", "read", "update", "delete"
  scope       PermissionScope // GLOBAL, COMPANY, PROJECT, RESOURCE
}

enum PermissionScope {
  GLOBAL    // Acceso a nivel sistema (super admin)
  COMPANY   // Acceso a nivel empresa/tenant
  PROJECT   // Acceso a nivel proyecto
  RESOURCE  // Acceso a recurso específico
}
```

### Role Model con Jerarquía

```prisma
model Role {
  id          String  @id
  name        String  @unique
  description String?
  isGlobal    Boolean @default(false) // Rol global vs company-scoped
  level       Int     @default(0)     // Nivel jerárquico
  parentId    String?
  parent      Role?   @relation("RoleHierarchy", fields: [parentId], references: [id])
  children    Role[]  @relation("RoleHierarchy")
}
```

## 🎯 Scopes de Permisos

### 1. GLOBAL Scope

Permisos a nivel sistema (super admin):

```typescript
// Ejemplos de permisos GLOBAL
{
  name: "system.manage",
  resource: "system",
  action: "manage",
  scope: PermissionScope.GLOBAL
}

{
  name: "tenants.create",
  resource: "tenants",
  action: "create",
  scope: PermissionScope.GLOBAL
}
```

**Uso:**
```typescript
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermission('system.manage', PermissionScope.GLOBAL)
@Get('admin/system')
async getSystemInfo() {
  // Solo super admins
}
```

### 2. COMPANY Scope

Permisos a nivel empresa/tenant:

```typescript
// Ejemplos de permisos COMPANY
{
  name: "users.create",
  resource: "users",
  action: "create",
  scope: PermissionScope.COMPANY
}

{
  name: "projects.read",
  resource: "projects",
  action: "read",
  scope: PermissionScope.COMPANY
}
```

**Uso:**
```typescript
@UseGuards(JwtAuthGuard, PermissionGuard)
@RequirePermission('users.create', PermissionScope.COMPANY)
@Post('users')
async createUser(@Body() dto: CreateUserDto) {
  // Puede crear usuarios en su empresa
}
```

### 3. PROJECT Scope

Permisos a nivel proyecto específico:

```typescript
// Ejemplos de permisos PROJECT
{
  name: "tasks.create",
  resource: "tasks",
  action: "create",
  scope: PermissionScope.PROJECT
}

{
  name: "documents.upload",
  resource: "documents",
  action: "upload",
  scope: PermissionScope.PROJECT
}
```

**Uso:**
```typescript
@UseGuards(JwtAuthGuard, ProjectPermissionGuard)
@RequirePermission('tasks.create', PermissionScope.PROJECT)
@Post('projects/:projectId/tasks')
async createTask(
  @Param('projectId') projectId: string,
  @Body() dto: CreateTaskDto
) {
  // Puede crear tareas en este proyecto específico
}
```

### 4. RESOURCE Scope

Permisos a nivel recurso individual:

```typescript
// Ejemplos de permisos RESOURCE
{
  name: "invoice.approve",
  resource: "invoice",
  action: "approve",
  scope: PermissionScope.RESOURCE
}
```

## 🏗️ Jerarquía de Roles

### Herencia de Permisos

Los roles hijos heredan permisos de sus padres:

```
SuperAdmin (level 0)
  ↓ hereda todos los permisos
Admin (level 1)
  ↓ hereda permisos de Admin
Manager (level 2)
  ↓ hereda permisos de Manager
Employee (level 3)
```

```typescript
// Verificar permisos con herencia
async hasPermission(
  userId: string,
  permission: string,
  scope: PermissionScope
): Promise<boolean> {
  const userRoles = await this.getUserRolesWithHierarchy(userId);

  // Verificar en el rol y todos sus ancestros
  for (const role of userRoles) {
    const hasDirectPermission = await this.roleHasPermission(role.id, permission);
    if (hasDirectPermission) return true;

    // Verificar roles padres recursivamente
    if (role.parent) {
      const hasInheritedPermission = await this.checkParentRoles(
        role.parent,
        permission
      );
      if (hasInheritedPermission) return true;
    }
  }

  return false;
}
```

## 🛡️ Guards de Permisos

### PermissionGuard (Company Scope)

```typescript
@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    const requiredScope = this.reflector.get<PermissionScope>(
      'permissionScope',
      context.getHandler(),
    );

    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasPermission = await this.permissionService.hasPermission(
      user.sub,
      requiredPermission,
      requiredScope,
      user.companyId,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Permission ${requiredPermission} required`
      );
    }

    return true;
  }
}
```

### ProjectPermissionGuard (Project Scope)

```typescript
@Injectable()
export class ProjectPermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
    private readonly projectService: ProjectService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(
      'permission',
      context.getHandler(),
    );

    if (!requiredPermission) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const projectId = request.params.projectId;

    // Verificar que el proyecto pertenece al tenant del usuario
    const project = await this.projectService.findById(projectId);
    if (project.companyId !== user.companyId) {
      throw new ForbiddenException('Access denied to this project');
    }

    // Verificar permiso en el proyecto
    const hasPermission = await this.permissionService.hasProjectPermission(
      user.sub,
      projectId,
      requiredPermission,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Permission ${requiredPermission} required for this project`
      );
    }

    return true;
  }
}
```

## 🎨 Decorators

### @RequirePermission

```typescript
export const RequirePermission = (
  permission: string,
  scope: PermissionScope = PermissionScope.COMPANY,
) => {
  return applyDecorators(
    SetMetadata('permission', permission),
    SetMetadata('permissionScope', scope),
    UseGuards(JwtAuthGuard, PermissionGuard),
  );
};

// Uso
@RequirePermission('users.create', PermissionScope.COMPANY)
@Post('users')
async createUser() { }
```

### @RequireAnyPermission

```typescript
export const RequireAnyPermission = (...permissions: string[]) => {
  return applyDecorators(
    SetMetadata('anyPermissions', permissions),
    UseGuards(JwtAuthGuard, AnyPermissionGuard),
  );
};

// Uso - requiere al menos uno de los permisos
@RequireAnyPermission('users.read', 'users.create', 'users.update')
@Get('users')
async listUsers() { }
```

### @RequireAllPermissions

```typescript
export const RequireAllPermissions = (...permissions: string[]) => {
  return applyDecorators(
    SetMetadata('allPermissions', permissions),
    UseGuards(JwtAuthGuard, AllPermissionsGuard),
  );
};

// Uso - requiere todos los permisos
@RequireAllPermissions('invoices.read', 'invoices.approve')
@Post('invoices/:id/approve')
async approveInvoice() { }
```

## 📋 Permisos Predefinidos

### Core Permissions

```typescript
// Users
users.create      // COMPANY
users.read        // COMPANY
users.update      // COMPANY
users.delete      // COMPANY

// Companies
companies.create  // GLOBAL
companies.read    // COMPANY
companies.update  // COMPANY
companies.delete  // GLOBAL

// Projects
projects.create   // COMPANY
projects.read     // COMPANY / PROJECT
projects.update   // PROJECT
projects.delete   // COMPANY

// Tasks
tasks.create      // PROJECT
tasks.read        // PROJECT
tasks.update      // PROJECT / RESOURCE
tasks.delete      // PROJECT

// Invoices
invoices.create   // COMPANY
invoices.read     // COMPANY
invoices.update   // COMPANY
invoices.delete   // COMPANY
invoices.approve  // RESOURCE

// Documents
documents.upload  // PROJECT
documents.read    // PROJECT
documents.delete  // PROJECT

// Roles
roles.create      // GLOBAL / COMPANY
roles.read        // COMPANY
roles.update      // GLOBAL / COMPANY
roles.delete      // GLOBAL
```

## 🔄 Asignación Dinámica de Permisos

### Asignar Permiso a Rol

```typescript
@Injectable()
export class PermissionService {
  async assignPermissionToRole(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    await this.prisma.rolePermission.create({
      data: { roleId, permissionId },
    });

    // Invalidar cache de permisos
    await this.cacheService.del(`role:${roleId}:permissions`);
  }

  async removePermissionFromRole(
    roleId: string,
    permissionId: string,
  ): Promise<void> {
    await this.prisma.rolePermission.deleteMany({
      where: { roleId, permissionId },
    });

    await this.cacheService.del(`role:${roleId}:permissions`);
  }
}
```

### Verificar Permisos con Cache

```typescript
async hasPermission(
  userId: string,
  permission: string,
  scope: PermissionScope,
  companyId: string,
): Promise<boolean> {
  // Intentar obtener del cache
  const cacheKey = `user:${userId}:permissions:${companyId}`;
  const cached = await this.cacheService.get(cacheKey);

  if (cached) {
    return cached.includes(permission);
  }

  // Obtener de la DB
  const userPermissions = await this.getUserPermissions(userId, companyId);

  // Guardar en cache (5 minutos)
  await this.cacheService.set(cacheKey, userPermissions, 300);

  return userPermissions.some(p =>
    p.name === permission && p.scope === scope
  );
}
```

## 🧪 Testing de Permisos

```typescript
describe('Permission System', () => {
  it('should allow user with permission', async () => {
    const user = await createUserWithPermission('users.create');
    const token = await login(user);

    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(createUserDto);

    expect(response.status).toBe(201);
  });

  it('should deny user without permission', async () => {
    const user = await createUserWithoutPermission('users.create');
    const token = await login(user);

    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send(createUserDto);

    expect(response.status).toBe(403);
  });

  it('should inherit permissions from parent role', async () => {
    const parentRole = await createRole('manager', ['users.read']);
    const childRole = await createRole('employee', [], parentRole.id);
    const user = await createUserWithRole(childRole.id);

    const hasPermission = await permissionService.hasPermission(
      user.id,
      'users.read',
      PermissionScope.COMPANY,
      user.companyId,
    );

    expect(hasPermission).toBe(true); // ✅ Hereda del padre
  });
});
```

## 📊 UI de Gestión de Permisos

### Endpoint para listar permisos disponibles

```typescript
@Get('permissions')
async listPermissions(
  @Query('resource') resource?: string,
  @Query('scope') scope?: PermissionScope,
) {
  return await this.permissionService.list({ resource, scope });
}

// Response
[
  {
    id: "uuid",
    name: "users.create",
    description: "Create new users",
    resource: "users",
    action: "create",
    scope: "COMPANY"
  },
  // ...
]
```

### Endpoint para permisos de un rol

```typescript
@Get('roles/:id/permissions')
async getRolePermissions(@Param('id') roleId: string) {
  return await this.permissionService.getRolePermissions(roleId);
}
```

## 🔗 Referencias

- [RBAC Pattern](https://en.wikipedia.org/wiki/Role-based_access_control)
- [ABAC vs RBAC](https://www.okta.com/identity-101/role-based-access-control-vs-attribute-based-access-control/)
- [NestJS Guards](https://docs.nestjs.com/guards)
