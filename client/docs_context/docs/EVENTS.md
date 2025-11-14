# Sistema de Eventos y Procesamiento Asíncrono

## 🔄 Event-Driven Architecture

El sistema implementa un **Event Bus** para desacoplar operaciones y procesamiento asíncrono:

```
Action → Event Published → Event Handlers → Side Effects
```

### Beneficios
✅ **Desacoplamiento**: Los módulos no dependen directamente entre sí
✅ **Escalabilidad**: Procesamiento asíncrono de tareas pesadas
✅ **Auditabilidad**: Registro completo de eventos del sistema
✅ **Extensibilidad**: Agregar handlers sin modificar código existente

## 📊 Modelo de Datos

### Event Model

```prisma
model Event {
  id          String    @id @default(uuid())
  type        String    // "user.created", "invoice.paid", etc.
  entity      String    // "user", "invoice", "project"
  entityId    String    // ID de la entidad afectada
  payload     Json      // Datos del evento
  status      String    @default("pending") // pending, processing, completed, failed
  processedAt DateTime?
  createdAt   DateTime  @default(now())

  @@index([type])
  @@index([status])
  @@index([createdAt])
}
```

### EventLog Model

```prisma
model EventLog {
  id          String   @id @default(uuid())
  eventId     String   // Referencia al evento original
  action      String   // Acción ejecutada por el handler
  performedBy String?  // Usuario que ejecutó (si aplica)
  result      String   // "success" o "failure"
  error       String?  // Mensaje de error si falló
  createdAt   DateTime @default(now())

  performer User? @relation(fields: [performedBy], references: [id])

  @@index([eventId])
  @@index([performedBy])
}
```

## 🎯 Tipos de Eventos

### Domain Events

Eventos del dominio de negocio:

```typescript
// User events
user.created
user.updated
user.deleted
user.activated
user.deactivated

// Company events
company.created
company.updated
company.deleted

// Project events
project.created
project.updated
project.completed
project.archived

// Task events
task.created
task.assigned
task.completed
task.overdue

// Invoice events
invoice.created
invoice.sent
invoice.paid
invoice.overdue

// Document events
document.uploaded
document.deleted
document.shared
```

### Integration Events

Eventos para integraciones externas:

```typescript
// Payment events
payment.received
payment.failed
payment.refunded

// Email events
email.sent
email.failed
email.opened

// Notification events
notification.sent
notification.read
```

## 🏗️ Implementación

### Event Publisher

```typescript
@Injectable()
export class EventPublisher {
  constructor(private readonly prisma: PrismaService) {}

  async publish(event: {
    type: string;
    entity: string;
    entityId: string;
    payload: any;
  }): Promise<void> {
    await this.prisma.event.create({
      data: {
        type: event.type,
        entity: event.entity,
        entityId: event.entityId,
        payload: event.payload,
        status: 'pending',
      },
    });
  }
}
```

### Event Handler Interface

```typescript
export interface EventHandler<T = any> {
  handle(event: Event<T>): Promise<void>;
  getEventType(): string;
}

export interface Event<T = any> {
  id: string;
  type: string;
  entity: string;
  entityId: string;
  payload: T;
  createdAt: Date;
}
```

### Event Processor

```typescript
@Injectable()
export class EventProcessor {
  private handlers = new Map<string, EventHandler[]>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventLog: EventLogService,
  ) {}

  // Registrar handlers
  registerHandler(eventType: string, handler: EventHandler): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType).push(handler);
  }

  // Procesar eventos pendientes
  async processPendingEvents(): Promise<void> {
    const events = await this.prisma.event.findMany({
      where: { status: 'pending' },
      take: 100, // Batch de 100 eventos
      orderBy: { createdAt: 'asc' },
    });

    for (const event of events) {
      await this.processEvent(event);
    }
  }

  private async processEvent(event: any): Promise<void> {
    try {
      // Marcar como procesando
      await this.prisma.event.update({
        where: { id: event.id },
        data: { status: 'processing' },
      });

      // Obtener handlers para este tipo de evento
      const handlers = this.handlers.get(event.type) || [];

      // Ejecutar todos los handlers
      await Promise.all(
        handlers.map(async (handler) => {
          try {
            await handler.handle(event);

            // Log de éxito
            await this.eventLog.log({
              eventId: event.id,
              action: handler.constructor.name,
              result: 'success',
            });
          } catch (error) {
            // Log de error
            await this.eventLog.log({
              eventId: event.id,
              action: handler.constructor.name,
              result: 'failure',
              error: error.message,
            });

            throw error; // Re-throw para marcar el evento como fallido
          }
        }),
      );

      // Marcar como completado
      await this.prisma.event.update({
        where: { id: event.id },
        data: {
          status: 'completed',
          processedAt: new Date(),
        },
      });
    } catch (error) {
      // Marcar como fallido
      await this.prisma.event.update({
        where: { id: event.id },
        data: { status: 'failed' },
      });
    }
  }
}
```

## 📝 Ejemplos de Handlers

### UserCreatedHandler

```typescript
@Injectable()
export class UserCreatedHandler implements EventHandler {
  constructor(
    private readonly emailService: EmailService,
    private readonly notificationService: NotificationService,
  ) {}

  getEventType(): string {
    return 'user.created';
  }

  async handle(event: Event<UserCreatedPayload>): Promise<void> {
    const { user } = event.payload;

    // Enviar email de bienvenida
    await this.emailService.sendWelcomeEmail({
      to: user.email,
      name: user.name,
    });

    // Crear notificación
    await this.notificationService.create({
      userId: user.id,
      title: 'Bienvenido',
      message: `Hola ${user.name}, bienvenido al sistema`,
      type: 'info',
    });
  }
}

interface UserCreatedPayload {
  user: {
    id: string;
    email: string;
    name: string;
    companyId: string;
  };
}
```

### InvoicePaidHandler

```typescript
@Injectable()
export class InvoicePaidHandler implements EventHandler {
  constructor(
    private readonly emailService: EmailService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  getEventType(): string {
    return 'invoice.paid';
  }

  async handle(event: Event<InvoicePaidPayload>): Promise<void> {
    const { invoice } = event.payload;

    // Enviar recibo por email
    await this.emailService.sendReceipt({
      to: invoice.customerEmail,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.total,
    });

    // Si es pago de suscripción, extender el plan
    if (invoice.type === 'subscription') {
      await this.subscriptionService.extend({
        companyId: invoice.companyId,
        months: 1,
      });
    }

    // Generar reporte de pago
    await this.generatePaymentReport(invoice);
  }

  private async generatePaymentReport(invoice: any): Promise<void> {
    // Lógica para generar reporte
  }
}
```

### TaskOverdueHandler

```typescript
@Injectable()
export class TaskOverdueHandler implements EventHandler {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly emailService: EmailService,
  ) {}

  getEventType(): string {
    return 'task.overdue';
  }

  async handle(event: Event<TaskOverduePayload>): Promise<void> {
    const { task, assignee } = event.payload;

    // Notificar al asignado
    if (assignee) {
      await this.notificationService.create({
        userId: assignee.id,
        title: 'Tarea vencida',
        message: `La tarea "${task.title}" está vencida`,
        type: 'warning',
        entityType: 'task',
        entityId: task.id,
      });

      await this.emailService.send({
        to: assignee.email,
        subject: 'Tarea vencida',
        template: 'task-overdue',
        data: { task, assignee },
      });
    }

    // Notificar al manager del proyecto
    await this.notifyProjectManager(task.projectId, task);
  }

  private async notifyProjectManager(projectId: string, task: any): Promise<void> {
    // Lógica para notificar al manager
  }
}
```

## ⚙️ Configuración de Handlers

### Event Module

```typescript
@Module({
  providers: [
    EventPublisher,
    EventProcessor,
    EventLogService,

    // Handlers
    UserCreatedHandler,
    InvoicePaidHandler,
    TaskOverdueHandler,
    DocumentUploadedHandler,
    ProjectCompletedHandler,
  ],
  exports: [EventPublisher],
})
export class EventModule implements OnModuleInit {
  constructor(
    private readonly eventProcessor: EventProcessor,
    private readonly userCreatedHandler: UserCreatedHandler,
    private readonly invoicePaidHandler: InvoicePaidHandler,
    private readonly taskOverdueHandler: TaskOverdueHandler,
    // ... otros handlers
  ) {}

  onModuleInit() {
    // Registrar todos los handlers
    this.eventProcessor.registerHandler(
      'user.created',
      this.userCreatedHandler,
    );
    this.eventProcessor.registerHandler(
      'invoice.paid',
      this.invoicePaidHandler,
    );
    this.eventProcessor.registerHandler(
      'task.overdue',
      this.taskOverdueHandler,
    );
    // ... registrar otros handlers
  }
}
```

## 🔄 Procesamiento con Cron

### Event Processor Cron Job

```typescript
@Injectable()
export class EventProcessorCron {
  constructor(private readonly eventProcessor: EventProcessor) {}

  // Ejecutar cada minuto
  @Cron('*/1 * * * *')
  async processEvents() {
    await this.eventProcessor.processPendingEvents();
  }

  // Limpiar eventos antiguos cada día
  @Cron('0 0 * * *')
  async cleanupOldEvents() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    await this.prisma.event.deleteMany({
      where: {
        status: 'completed',
        processedAt: { lt: thirtyDaysAgo },
      },
    });
  }
}
```

## 📤 Publicar Eventos desde Use Cases

```typescript
@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(dto: CreateUserDto): Promise<User> {
    // Crear usuario
    const user = await this.userRepository.create(dto);

    // Publicar evento
    await this.eventPublisher.publish({
      type: 'user.created',
      entity: 'user',
      entityId: user.id,
      payload: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          companyId: user.companyId,
        },
      },
    });

    return user;
  }
}
```

## 🔁 Retry Logic

### Event Retry Handler

```typescript
@Injectable()
export class EventRetryService {
  constructor(private readonly prisma: PrismaService) {}

  async retryFailedEvents(maxRetries = 3): Promise<void> {
    const failedEvents = await this.prisma.event.findMany({
      where: { status: 'failed' },
      include: {
        _count: {
          select: {
            logs: {
              where: { result: 'failure' },
            },
          },
        },
      },
    });

    for (const event of failedEvents) {
      const retryCount = event._count.logs;

      if (retryCount < maxRetries) {
        // Reintentar
        await this.prisma.event.update({
          where: { id: event.id },
          data: { status: 'pending' },
        });
      } else {
        // Marcar como dead letter (no reintentar más)
        await this.prisma.event.update({
          where: { id: event.id },
          data: { status: 'dead_letter' },
        });
      }
    }
  }
}
```

## 📊 Monitoreo de Eventos

### Event Metrics

```typescript
@Injectable()
export class EventMetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics() {
    const [pending, processing, completed, failed] = await Promise.all([
      this.prisma.event.count({ where: { status: 'pending' } }),
      this.prisma.event.count({ where: { status: 'processing' } }),
      this.prisma.event.count({ where: { status: 'completed' } }),
      this.prisma.event.count({ where: { status: 'failed' } }),
    ]);

    const avgProcessingTime = await this.prisma.event.aggregate({
      where: { status: 'completed' },
      _avg: {
        // Calcular diferencia entre createdAt y processedAt
      },
    });

    return {
      pending,
      processing,
      completed,
      failed,
      avgProcessingTime: avgProcessingTime._avg,
    };
  }

  async getEventsByType(startDate: Date, endDate: Date) {
    return await this.prisma.event.groupBy({
      by: ['type'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: true,
    });
  }
}
```

## 🧪 Testing de Eventos

```typescript
describe('Event System', () => {
  let eventPublisher: EventPublisher;
  let eventProcessor: EventProcessor;
  let mockHandler: jest.Mocked<EventHandler>;

  beforeEach(() => {
    mockHandler = {
      handle: jest.fn(),
      getEventType: jest.fn().mockReturnValue('test.event'),
    };

    eventProcessor.registerHandler('test.event', mockHandler);
  });

  it('should publish and process event', async () => {
    // Publicar evento
    await eventPublisher.publish({
      type: 'test.event',
      entity: 'test',
      entityId: '123',
      payload: { data: 'test' },
    });

    // Procesar eventos
    await eventProcessor.processPendingEvents();

    // Verificar que el handler fue llamado
    expect(mockHandler.handle).toHaveBeenCalled();
  });

  it('should retry failed events', async () => {
    mockHandler.handle.mockRejectedValueOnce(new Error('Test error'));

    await eventPublisher.publish({
      type: 'test.event',
      entity: 'test',
      entityId: '123',
      payload: {},
    });

    await eventProcessor.processPendingEvents();

    // Verificar que el evento está marcado como failed
    const event = await prisma.event.findFirst({
      where: { type: 'test.event' },
    });

    expect(event.status).toBe('failed');
  });
});
```

## 🔗 Referencias

- [Event-Driven Architecture](https://martinfowler.com/articles/201701-event-driven.html)
- [Domain Events Pattern](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/domain-events-design-implementation)
- [NestJS CQRS](https://docs.nestjs.com/recipes/cqrs)
