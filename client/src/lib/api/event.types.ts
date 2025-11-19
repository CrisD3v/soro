/**
 * Event Types
 * Tipos para el módulo de eventos del sistema
 */

export interface Event {
  id: string;
  type: EventType;
  entityType: string;
  entityId: string;
  payload: Record<string, any>;
  status: EventStatus;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
  companyId: string;
}

export enum EventType {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  COMPANY_CREATED = 'COMPANY_CREATED',
  COMPANY_UPDATED = 'COMPANY_UPDATED',
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  PROJECT_COMPLETED = 'PROJECT_COMPLETED',
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  DEAL_CREATED = 'DEAL_CREATED',
  DEAL_WON = 'DEAL_WON',
  DEAL_LOST = 'DEAL_LOST',
  INVOICE_CREATED = 'INVOICE_CREATED',
  INVOICE_SENT = 'INVOICE_SENT',
  INVOICE_PAID = 'INVOICE_PAID',
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  NOTIFICATION_SENT = 'NOTIFICATION_SENT',
}

export enum EventStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface CreateEventDto {
  type: EventType;
  entityType: string;
  entityId: string;
  payload: Record<string, any>;
  companyId: string;
}

export interface EventFilters {
  companyId?: string;
  type?: EventType;
  status?: EventStatus;
  entityType?: string;
  startDate?: string;
  endDate?: string;
}

// Labels en español para tipos de eventos
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  [EventType.USER_CREATED]: 'Usuario Creado',
  [EventType.USER_UPDATED]: 'Usuario Actualizado',
  [EventType.USER_DELETED]: 'Usuario Eliminado',
  [EventType.COMPANY_CREATED]: 'Empresa Creada',
  [EventType.COMPANY_UPDATED]: 'Empresa Actualizada',
  [EventType.PROJECT_CREATED]: 'Proyecto Creado',
  [EventType.PROJECT_UPDATED]: 'Proyecto Actualizado',
  [EventType.PROJECT_COMPLETED]: 'Proyecto Completado',
  [EventType.TASK_CREATED]: 'Tarea Creada',
  [EventType.TASK_UPDATED]: 'Tarea Actualizada',
  [EventType.TASK_COMPLETED]: 'Tarea Completada',
  [EventType.DEAL_CREATED]: 'Deal Creado',
  [EventType.DEAL_WON]: 'Deal Ganado',
  [EventType.DEAL_LOST]: 'Deal Perdido',
  [EventType.INVOICE_CREATED]: 'Factura Creada',
  [EventType.INVOICE_SENT]: 'Factura Enviada',
  [EventType.INVOICE_PAID]: 'Factura Pagada',
  [EventType.DOCUMENT_UPLOADED]: 'Documento Subido',
  [EventType.NOTIFICATION_SENT]: 'Notificación Enviada',
};

// Labels en español para estados
export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  [EventStatus.PENDING]: 'Pendiente',
  [EventStatus.PROCESSING]: 'Procesando',
  [EventStatus.COMPLETED]: 'Completado',
  [EventStatus.FAILED]: 'Fallido',
};

// Colores para estados
export const EVENT_STATUS_COLORS: Record<EventStatus, string> = {
  [EventStatus.PENDING]: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  [EventStatus.PROCESSING]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  [EventStatus.COMPLETED]: 'bg-green-500/10 text-green-400 border-green-500/20',
  [EventStatus.FAILED]: 'bg-red-500/10 text-red-400 border-red-500/20',
};

// Categorías de eventos
export const EVENT_CATEGORIES: Record<string, EventType[]> = {
  Usuarios: [EventType.USER_CREATED, EventType.USER_UPDATED, EventType.USER_DELETED],
  Empresas: [EventType.COMPANY_CREATED, EventType.COMPANY_UPDATED],
  Proyectos: [EventType.PROJECT_CREATED, EventType.PROJECT_UPDATED, EventType.PROJECT_COMPLETED],
  Tareas: [EventType.TASK_CREATED, EventType.TASK_UPDATED, EventType.TASK_COMPLETED],
  Deals: [EventType.DEAL_CREATED, EventType.DEAL_WON, EventType.DEAL_LOST],
  Facturas: [EventType.INVOICE_CREATED, EventType.INVOICE_SENT, EventType.INVOICE_PAID],
  Documentos: [EventType.DOCUMENT_UPLOADED],
  Notificaciones: [EventType.NOTIFICATION_SENT],
};
