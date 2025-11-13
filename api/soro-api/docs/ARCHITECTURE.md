# Arquitectura del Sistema

## 📐 Arquitectura Hexagonal (Ports & Adapters)

El sistema está construido siguiendo **Arquitectura Hexagonal** combinada con **Domain-Driven Design (DDD)** para garantizar:

- ✅ **Independencia de frameworks**: El domain no depende de NestJS, Prisma u otras librerías
- ✅ **Testabilidad**: Cada capa puede testearse de forma aislada
- ✅ **Mantenibilidad**: Cambios en infraestructura no afectan la lógica de negocio
- ✅ **Escalabilidad**: Módulos independientes que pueden crecer sin acoplamiento

## 🏗️ Estructura de Capas

```
src/context/[module]/
├── domain/                    # Capa de Dominio (Core Business Logic)
│   ├── entities/             # Entidades del dominio con lógica de negocio
│   ├── value-objects/        # Value Objects inmutables
│   └── ports/                # Interfaces (contratos) - Dependency Inversion
│       ├── *.repository.port.ts
│       └── *.service.port.ts
│
├── application/              # Capa de Aplicación (Use Cases)
│   ├── use-cases/           # Casos de uso (orquestación de dominio)
│   │   ├── create-*.use-case.ts
│   │   ├── update-*.use-case.ts
│   │   └── get-*.use-case.ts
│   └── dto/                 # Data Transfer Objects (validación)
│       ├── create-*.dto.ts
│       └── *-response.dto.ts
│
└── infrastructure/          # Capa de Infraestructura (Adapters)
    ├── persistence/        # Implementación de repositories
    │   └── prisma-*.repository.ts
    ├── controllers/        # REST API controllers
    │   └── *.controller.ts
    ├── mappers/           # Conversión Prisma ↔ Domain
    │   └── *.mapper.ts
    ├── services/          # Servicios externos (email, storage, etc.)
    └── guards/            # Guards de autenticación/autorización
```

## 🔄 Flujo de Datos

```
HTTP Request
    ↓
Controller (Infrastructure)
    ↓
Use Case (Application) ← DTO validation
    ↓
Domain Entity (Domain) ← Business Logic
    ↓
Repository Port (Domain) ← Interface
    ↓
Repository Implementation (Infrastructure) ← Prisma
    ↓
Database
```

## 📦 Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
Cada use case tiene una única responsabilidad:
```typescript
// ✅ Correcto
CreateUserUseCase  // Solo crea usuarios
UpdateUserUseCase  // Solo actualiza usuarios

// ❌ Incorrecto
UserManagementUseCase // Hace todo
```

### Open/Closed Principle (OCP)
Los ports permiten extender sin modificar:
```typescript
// Port (interface) - cerrado para modificación
export abstract class UserRepositoryPort {
  abstract create(data: CreateUserData): Promise<User>;
}

// Implementación - abierto para extensión
export class PrismaUserRepository implements UserRepositoryPort { }
export class MongoUserRepository implements UserRepositoryPort { }
```

### Liskov Substitution Principle (LSP)
Cualquier implementación de un port puede sustituirse:
```typescript
// Ambas implementaciones son intercambiables
providers: [
  { provide: UserRepositoryPort, useClass: PrismaUserRepository }
  // { provide: UserRepositoryPort, useClass: MongoUserRepository }
]
```

### Interface Segregation Principle (ISP)
Interfaces específicas en lugar de genéricas:
```typescript
// ✅ Correcto - interfaces segregadas
export abstract class UserRepositoryPort { }
export abstract class UserSearchPort { }

// ❌ Incorrecto - interface monolítica
export abstract class UserServicePort { } // Hace todo
```

### Dependency Inversion Principle (DIP)
Las capas superiores no dependen de las inferiores:
```typescript
// Use Case depende del Port (abstracción)
constructor(private readonly userRepository: UserRepositoryPort) {}

// NO depende de la implementación concreta
// constructor(private readonly userRepository: PrismaUserRepository) {} ❌
```

## 🎯 Domain-Driven Design (DDD)

### Entidades (Entities)
Objetos con identidad única que contienen lógica de negocio:
```typescript
export class User {
  constructor(
    public readonly id: string,
    public email: string,
    // ...
  ) {}

  // Lógica de negocio en el dominio
  hasPermission(permission: string): boolean {
    return this.roles?.some(r => r.hasPermission(permission)) ?? false;
  }

  isActive(): boolean {
    return this.isActive && !this.deletedAt;
  }
}
```

### Value Objects
Objetos inmutables sin identidad:
```typescript
export class Document {
  constructor(
    public readonly number: string,
    public readonly type: DocumentType,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.number) throw new Error('Document number required');
  }
}
```

### Aggregates
Grupos de entidades tratadas como una unidad:
```typescript
// Company es el aggregate root
Company
  ├── Users (entities)
  ├── Projects (entities)
  └── Settings (value objects)
```

### Repositories
Abstracción para persistencia:
```typescript
// Port en domain
export abstract class CompanyRepositoryPort {
  abstract findById(id: string): Promise<Company | null>;
}

// Implementación en infrastructure
export class PrismaCompanyRepository implements CompanyRepositoryPort {
  async findById(id: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({ where: { id } });
    return company ? CompanyMapper.toDomain(company) : null;
  }
}
```

## 🔌 Dependency Injection

NestJS maneja la inyección de dependencias:

```typescript
@Module({
  providers: [
    PrismaService,
    PrismaUserRepository,
    {
      provide: UserRepositoryPort,  // Token (abstracción)
      useClass: PrismaUserRepository // Implementación concreta
    },
    CreateUserUseCase,
  ],
})
export class UserModule {}
```

## 🧪 Testabilidad

La arquitectura facilita el testing:

```typescript
describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockRepository: jest.Mocked<UserRepositoryPort>;

  beforeEach(() => {
    // Mock del repository (no necesita DB real)
    mockRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    } as any;

    useCase = new CreateUserUseCase(mockRepository);
  });

  it('should create user', async () => {
    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(mockUser);

    const result = await useCase.execute(createUserDto);

    expect(result).toBeDefined();
    expect(mockRepository.create).toHaveBeenCalled();
  });
});
```

## 📊 Mappers

Los mappers convierten entre capas:

```typescript
export class UserMapper {
  // Prisma → Domain
  static toDomain(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.id,
      prismaUser.email,
      // ...
    );
  }

  // Domain → Prisma (si es necesario)
  static toPrisma(user: User): PrismaUserCreateInput {
    return {
      email: user.email,
      // ...
    };
  }
}
```

## 🔐 Guards y Decorators

Protección de rutas con guards:

```typescript
@Controller('users')
export class UserController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return await this.createUserUseCase.execute(dto);
  }
}
```

## 🌐 Multi-tenant Architecture

Cada request incluye el `companyId` del tenant:

```typescript
// Middleware extrae el companyId del JWT
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user; // Del JWT
    req.tenantId = user.companyId;
    next();
  }
}

// Repositories filtran por tenant automáticamente
async list(filters: ListUsersFilters): Promise<User[]> {
  const where = {
    companyId: this.tenantId, // Aislamiento por tenant
    ...filters
  };
  return await this.prisma.user.findMany({ where });
}
```

## 📈 Escalabilidad

### Horizontal Scaling
- Stateless API (JWT tokens)
- Database connection pooling
- Cache layer (Redis) para queries frecuentes

### Vertical Scaling
- Índices optimizados en Prisma
- Query optimization con `include` selectivo
- Paginación en listados

### Modular Scaling
- Cada módulo puede desplegarse independientemente
- Microservicios potenciales por bounded context

## 🔄 Event-Driven Architecture

Sistema de eventos para operaciones asíncronas:

```typescript
// Publicar evento
await this.eventBus.publish(new UserCreatedEvent(user));

// Subscriber procesa el evento
@EventHandler(UserCreatedEvent)
async handle(event: UserCreatedEvent) {
  await this.emailService.sendWelcomeEmail(event.user);
  await this.auditService.log('user.created', event.user.id);
}
```

## 📝 Convenciones de Código

### Naming
- **Entities**: PascalCase singular (`User`, `Company`)
- **Use Cases**: `VerbNounUseCase` (`CreateUserUseCase`)
- **DTOs**: `NounVerb.dto.ts` (`create-user.dto.ts`)
- **Ports**: `NounPort` (`UserRepositoryPort`)
- **Implementations**: `TechNounImplementation` (`PrismaUserRepository`)

### File Structure
```
feature.entity.ts
feature.repository.port.ts
prisma-feature.repository.ts
create-feature.use-case.ts
create-feature.dto.ts
feature-response.dto.ts
feature.controller.ts
feature.mapper.ts
feature.module.ts
```

## 🎨 Best Practices

1. **Domain puro**: Sin dependencias externas en `domain/`
2. **Use cases simples**: Una responsabilidad por use case
3. **DTOs validados**: Usar `class-validator` en todos los DTOs
4. **Mappers explícitos**: Nunca exponer entidades de Prisma directamente
5. **Errors tipados**: Usar excepciones de NestJS (`NotFoundException`, etc.)
6. **Async/await**: Siempre para operaciones I/O
7. **Transacciones**: Usar Prisma transactions para operaciones múltiples
8. **Logging**: Estructurado con contexto (userId, companyId, etc.)

## 🔗 Referencias

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
