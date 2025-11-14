# Multi-tenant Architecture

## 🏢 Estrategia Multi-tenant

El sistema implementa **multi-tenancy a nivel de fila (Row-Level)** donde:
- Todos los tenants comparten la misma base de datos
- Cada registro tiene un `companyId` que identifica al tenant
- El aislamiento se garantiza mediante queries filtradas automáticamente

### Ventajas de Row-Level Multi-tenancy
✅ **Costo-efectivo**: Una sola base de datos para todos los tenants
✅ **Mantenimiento simple**: Una migración aplica a todos
✅ **Escalabilidad**: Fácil agregar nuevos tenants
✅ **Backup unificado**: Un solo proceso de respaldo

### Desventajas y Mitigaciones
⚠️ **Riesgo de data leakage**: Mitigado con middleware y guards
⚠️ **Performance compartida**: Mitigado con índices y connection pooling
⚠️ **Límites de escala**: Plan de migración a DB por tenant si es necesario

## 🔐 Aislamiento de Datos

### 1. Tenant Context Middleware

Extrae el `companyId` del JWT y lo inyecta en el request:

```typescript
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user as TokenPayload;

    if (user && user.companyId) {
      req['tenantId'] = user.companyId;
    }

    next();
  }
}
```

### 2. Tenant Guard

Valida que el usuario tenga acceso al tenant solicitado:

```typescript
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const requestedCompanyId = request.params.companyId || request.body.companyId;

    // Validar que el usuario pertenece al tenant
    if (requestedCompanyId && user.companyId !== requestedCompanyId) {
      throw new ForbiddenException('Access denied to this tenant');
    }

    return true;
  }
}
```

### 3. Repository Pattern con Tenant Filtering

Todos los repositories filtran automáticamente por `companyId`:

```typescript
@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  private get tenantId(): string {
    return this.request['tenantId'];
  }

  async list(filters?: ListUsersFilters): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        companyId: this.tenantId, // ✅ Filtro automático por tenant
        ...filters,
      },
    });

    return UserMapper.toDomainList(users);
  }
}
```

## 🏗️ Schema Design para Multi-tenancy

### Entidades con Tenant Scope

Todas las entidades principales tienen `companyId`:

```prisma
model User {
  id        String  @id @default(uuid())
  email     String  @unique
  companyId String  // ✅ Tenant identifier

  company   Company @relation(fields: [companyId], references: [id])

  @@index([companyId]) // ✅ Índice para performance
}

model Project {
  id        String  @id @default(uuid())
  name      String
  companyId String  // ✅ Tenant identifier

  company   Company @relation(fields: [companyId], references: [id])

  @@index([companyId])
}
```

### Índices Compuestos

Para queries eficientes por tenant:

```prisma
model Task {
  id        String @id
  projectId String
  status    String
  companyId String // Denormalizado para performance

  @@index([companyId, status]) // ✅ Query rápida por tenant + status
  @@index([companyId, projectId])
}
```

## ⚙️ Configuración por Tenant

### TenantConfig Model

Cada tenant tiene configuración personalizada:

```prisma
model TenantConfig {
  id           String  @id @default(uuid())
  companyId    String  @unique
  maxUsers     Int     @default(10)
  maxProjects  Int     @default(5)
  maxStorage   BigInt  @default(1073741824) // 1GB
  features     Json    @default("{}") // Feature flags
  customDomain String?
  timezone     String  @default("UTC")
  locale       String  @default("en")

  company Company @relation(fields: [companyId], references: [id])
}
```

### Feature Flags por Tenant

```typescript
// Verificar si un tenant tiene acceso a una feature
async hasFeature(companyId: string, feature: string): Promise<boolean> {
  const config = await this.prisma.tenantConfig.findUnique({
    where: { companyId },
  });

  const features = config?.features as Record<string, boolean>;
  return features[feature] === true;
}

// Uso en guards
@Injectable()
export class FeatureGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const feature = this.reflector.get<string>('feature', context.getHandler());

    const hasAccess = await this.tenantService.hasFeature(
      request.tenantId,
      feature,
    );

    if (!hasAccess) {
      throw new ForbiddenException(`Feature ${feature} not available`);
    }

    return true;
  }
}

// Uso en controllers
@UseGuards(FeatureGuard)
@Feature('advanced_reports')
@Get('reports/advanced')
async getAdvancedReports() {
  // Solo tenants con la feature habilitada
}
```

## 📊 Límites y Quotas

### Validación de Límites

```typescript
@Injectable()
export class QuotaService {
  async checkUserLimit(companyId: string): Promise<void> {
    const config = await this.prisma.tenantConfig.findUnique({
      where: { companyId },
    });

    const userCount = await this.prisma.user.count({
      where: { companyId },
    });

    if (userCount >= config.maxUsers) {
      throw new ConflictException('User limit reached for this tenant');
    }
  }

  async checkStorageLimit(companyId: string, fileSize: number): Promise<void> {
    const config = await this.prisma.tenantConfig.findUnique({
      where: { companyId },
    });

    const usedStorage = await this.prisma.document.aggregate({
      where: { companyId },
      _sum: { fileSize: true },
    });

    const totalUsed = (usedStorage._sum.fileSize || 0) + fileSize;

    if (totalUsed > config.maxStorage) {
      throw new ConflictException('Storage limit exceeded');
    }
  }
}

// Uso en use cases
async execute(dto: CreateUserDto): Promise<User> {
  await this.quotaService.checkUserLimit(dto.companyId); // ✅ Validar límite

  return await this.userRepository.create(dto);
}
```

## 🔄 Onboarding de Nuevos Tenants

### Proceso de Registro

```typescript
@Injectable()
export class TenantOnboardingService {
  async createTenant(data: CreateTenantDto): Promise<Company> {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Crear la empresa
      const company = await tx.company.create({
        data: {
          name: data.companyName,
          nit: data.nit,
          email: data.email,
          phone: data.phone,
        },
      });

      // 2. Crear configuración del tenant
      await tx.tenantConfig.create({
        data: {
          companyId: company.id,
          maxUsers: 10, // Plan free
          maxProjects: 5,
          maxStorage: 1073741824, // 1GB
          features: {
            projects: true,
            crm: false,
            invoicing: false,
          },
        },
      });

      // 3. Crear usuario admin
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const adminUser = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.adminName,
          lastName: data.adminLastName,
          documentNumber: data.documentNumber,
          documentType: data.documentType,
          phone: data.phone,
          companyId: company.id,
        },
      });

      // 4. Asignar rol de admin
      const adminRole = await tx.role.findUnique({
        where: { name: 'admin' },
      });

      await tx.userRole.create({
        data: {
          userId: adminUser.id,
          roleId: adminRole.id,
          companyId: company.id,
        },
      });

      // 5. Crear settings por defecto
      await tx.setting.createMany({
        data: [
          {
            companyId: company.id,
            key: 'theme',
            value: { mode: 'light', primaryColor: '#3b82f6' },
          },
          {
            companyId: company.id,
            key: 'notifications',
            value: { email: true, push: false },
          },
        ],
      });

      // 6. Crear suscripción trial
      const freePlan = await tx.plan.findUnique({
        where: { name: 'Free' },
      });

      await tx.subscription.create({
        data: {
          companyId: company.id,
          planId: freePlan.id,
          status: 'trial',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 días
        },
      });

      return company;
    });
  }
}
```

## 🔍 Queries Cross-Tenant (Admin)

Para usuarios super admin que necesitan ver datos de múltiples tenants:

```typescript
@Injectable()
export class AdminUserRepository {
  // Query sin filtro de tenant (solo para super admins)
  async listAllTenants(): Promise<Company[]> {
    return await this.prisma.company.findMany({
      include: {
        _count: {
          select: {
            users: true,
            projects: true,
          },
        },
      },
    });
  }

  async getUsersAcrossTenants(filters: AdminFilters): Promise<User[]> {
    // Sin filtro de companyId - acceso global
    return await this.prisma.user.findMany({
      where: filters,
      include: {
        company: true,
      },
    });
  }
}

// Guard para super admin
@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Verificar que tiene rol global de super admin
    const isSuperAdmin = user.roles?.includes('super_admin');

    if (!isSuperAdmin) {
      throw new ForbiddenException('Super admin access required');
    }

    return true;
  }
}
```

## 📈 Migración a Database-per-Tenant

Si un tenant crece mucho, puede migrarse a su propia DB:

```typescript
@Injectable()
export class TenantMigrationService {
  async migrateToDedicatedDB(companyId: string): Promise<void> {
    // 1. Crear nueva base de datos
    const dbName = `tenant_${companyId}`;
    await this.createDatabase(dbName);

    // 2. Ejecutar migraciones en la nueva DB
    await this.runMigrations(dbName);

    // 3. Copiar datos del tenant
    await this.copyTenantData(companyId, dbName);

    // 4. Actualizar configuración del tenant
    await this.prisma.tenantConfig.update({
      where: { companyId },
      data: {
        features: {
          dedicatedDatabase: true,
          databaseUrl: `postgresql://.../${dbName}`,
        },
      },
    });

    // 5. Eliminar datos de la DB compartida
    await this.cleanupSharedDB(companyId);
  }
}
```

## 🛡️ Seguridad Multi-tenant

### Checklist de Seguridad

- ✅ Middleware valida `tenantId` en cada request
- ✅ Guards verifican acceso al tenant
- ✅ Repositories filtran automáticamente por `companyId`
- ✅ Índices en `companyId` para performance
- ✅ Auditoría de accesos cross-tenant
- ✅ Tests de aislamiento de datos
- ✅ Rate limiting por tenant
- ✅ Backup y restore por tenant

### Testing de Aislamiento

```typescript
describe('Tenant Isolation', () => {
  it('should not access data from other tenant', async () => {
    const tenant1User = await createUser({ companyId: 'tenant1' });
    const tenant2User = await createUser({ companyId: 'tenant2' });

    // Login como tenant1
    const token1 = await login(tenant1User);

    // Intentar acceder a datos de tenant2
    const response = await request(app)
      .get(`/users/${tenant2User.id}`)
      .set('Authorization', `Bearer ${token1}`);

    expect(response.status).toBe(403); // ✅ Acceso denegado
  });
});
```

## 📊 Métricas por Tenant

```typescript
@Injectable()
export class TenantMetricsService {
  async getTenantMetrics(companyId: string) {
    const [users, projects, storage, activeUsers] = await Promise.all([
      this.prisma.user.count({ where: { companyId } }),
      this.prisma.project.count({ where: { companyId } }),
      this.prisma.document.aggregate({
        where: { companyId },
        _sum: { fileSize: true },
      }),
      this.prisma.user.count({
        where: {
          companyId,
          lastLoginAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      users,
      projects,
      storageUsed: storage._sum.fileSize || 0,
      activeUsers,
    };
  }
}
```

## 🔗 Referencias

- [Multi-tenancy Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/multi-tenancy)
- [Prisma Multi-tenant](https://www.prisma.io/docs/guides/database/multi-tenant)
- [SaaS Tenant Isolation](https://aws.amazon.com/blogs/apn/saas-tenant-isolation-strategies/)
