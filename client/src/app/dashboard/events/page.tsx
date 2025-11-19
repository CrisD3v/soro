'use client';

/**
 * Events Page
 * Página de eventos del sistema con timeline
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Event, EventFilters } from '@/lib/api/event.types';
import {
  EVENT_CATEGORIES,
  EVENT_STATUS_COLORS,
  EVENT_STATUS_LABELS,
  EVENT_TYPE_LABELS,
  EventStatus,
  EventType,
} from '@/lib/api/event.types';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader,
  XCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

// Mock data hasta que el backend esté implementado
const mockEvents: Event[] = [
  {
    id: '1',
    type: EventType.USER_CREATED,
    entityType: 'User',
    entityId: 'user-123',
    payload: { email: 'nuevo@example.com', name: 'Usuario Nuevo' },
    status: EventStatus.COMPLETED,
    processedAt: new Date(Date.now() - 3600000).toISOString(),
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    companyId: 'company-1',
  },
  {
    id: '2',
    type: EventType.PROJECT_CREATED,
    entityType: 'Project',
    entityId: 'project-456',
    payload: { name: 'Nuevo Proyecto', status: 'ACTIVE' },
    status: EventStatus.COMPLETED,
    processedAt: new Date(Date.now() - 7200000).toISOString(),
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    companyId: 'company-1',
  },
  {
    id: '3',
    type: EventType.INVOICE_PAID,
    entityType: 'Invoice',
    entityId: 'invoice-789',
    payload: { amount: 5000, currency: 'USD' },
    status: EventStatus.COMPLETED,
    processedAt: new Date(Date.now() - 10800000).toISOString(),
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
    companyId: 'company-1',
  },
  {
    id: '4',
    type: EventType.TASK_COMPLETED,
    entityType: 'Task',
    entityId: 'task-321',
    payload: { title: 'Tarea Importante', completedBy: 'user-123' },
    status: EventStatus.COMPLETED,
    processedAt: new Date(Date.now() - 14400000).toISOString(),
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
    companyId: 'company-1',
  },
  {
    id: '5',
    type: EventType.DEAL_WON,
    entityType: 'Deal',
    entityId: 'deal-654',
    payload: { value: 25000, client: 'Cliente ABC' },
    status: EventStatus.COMPLETED,
    processedAt: new Date(Date.now() - 18000000).toISOString(),
    createdAt: new Date(Date.now() - 18000000).toISOString(),
    updatedAt: new Date(Date.now() - 18000000).toISOString(),
    companyId: 'company-1',
  },
  {
    id: '6',
    type: EventType.DOCUMENT_UPLOADED,
    entityType: 'Document',
    entityId: 'doc-987',
    payload: { filename: 'contrato.pdf', size: 2048000 },
    status: EventStatus.PROCESSING,
    processedAt: null,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    companyId: 'company-1',
  },
  {
    id: '7',
    type: EventType.NOTIFICATION_SENT,
    entityType: 'Notification',
    entityId: 'notif-111',
    payload: { type: 'EMAIL', recipient: 'user@example.com' },
    status: EventStatus.PENDING,
    processedAt: null,
    createdAt: new Date(Date.now() - 900000).toISOString(),
    updatedAt: new Date(Date.now() - 900000).toISOString(),
    companyId: 'company-1',
  },
];

export default function EventsPage() {
  const [statusFilter, setStatusFilter] = useState<EventStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filters: EventFilters = {
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
  };

  // Usar mock data en lugar de la API
  const events = mockEvents;
  const isLoading = false;

  // Filtrar por categoría en el cliente
  const filteredEvents = events?.filter((event) => {
    if (categoryFilter === 'ALL') return true;
    const categoryEvents = EVENT_CATEGORIES[categoryFilter];
    return categoryEvents?.includes(event.type);
  });

  // Función para obtener icono de estado
  const getStatusIcon = (status: EventStatus) => {
    switch (status) {
      case EventStatus.COMPLETED:
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case EventStatus.PROCESSING:
        return <Loader className="w-5 h-5 text-blue-400 animate-spin" />;
      case EventStatus.FAILED:
        return <XCircle className="w-5 h-5 text-red-400" />;
      case EventStatus.PENDING:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  // Calcular stats
  const totalEvents = events?.length || 0;
  const pendingEvents = events?.filter((e) => e.status === EventStatus.PENDING).length || 0;
  const completedEvents = events?.filter((e) => e.status === EventStatus.COMPLETED).length || 0;
  const failedEvents = events?.filter((e) => e.status === EventStatus.FAILED).length || 0;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-white/5 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-purple-400" />
            Eventos del Sistema
          </h1>
          <p className="text-white/60 mt-1">
            Timeline de eventos y actividades
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total</p>
              <p className="text-2xl font-bold text-white mt-1">{totalEvents}</p>
            </div>
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Pendientes</p>
              <p className="text-2xl font-bold text-white mt-1">{pendingEvents}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Completados</p>
              <p className="text-2xl font-bold text-white mt-1">{completedEvents}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Fallidos</p>
              <p className="text-2xl font-bold text-white mt-1">{failedEvents}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </motion.div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <Select
          value={categoryFilter}
          onValueChange={setCategoryFilter}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas las categorías</SelectItem>
            {Object.keys(EVENT_CATEGORIES).map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as EventStatus | 'ALL')}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los estados</SelectItem>
            {Object.values(EventStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {EVENT_STATUS_LABELS[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Timeline de Eventos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-400" />
          Timeline de Eventos
        </h2>

        {filteredEvents && filteredEvents.length > 0 ? (
          <div className="space-y-4">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex gap-4 pb-4 border-b border-white/10 last:border-0"
              >
                {/* Icono de estado */}
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(event.status)}
                </div>

                {/* Contenido del evento */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">
                        {EVENT_TYPE_LABELS[event.type]}
                      </h3>
                      <p className="text-white/60 text-sm mt-1">
                        {event.entityType} • ID: {event.entityId.substring(0, 8)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium border ${EVENT_STATUS_COLORS[event.status]
                          }`}
                      >
                        {EVENT_STATUS_LABELS[event.status]}
                      </span>
                    </div>
                  </div>

                  {/* Payload (si existe) */}
                  {event.payload && Object.keys(event.payload).length > 0 && (
                    <div className="mt-2 p-3 bg-white/5 rounded-md">
                      <p className="text-white/40 text-xs mb-1">Datos del evento:</p>
                      <pre className="text-white/60 text-xs overflow-x-auto">
                        {JSON.stringify(event.payload, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                    <span>
                      Creado: {new Date(event.createdAt).toLocaleString('es-ES')}
                    </span>
                    {event.processedAt && (
                      <span>
                        Procesado: {new Date(event.processedAt).toLocaleString('es-ES')}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No hay eventos
            </h3>
            <p className="text-white/60">
              No se encontraron eventos con los filtros seleccionados
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
