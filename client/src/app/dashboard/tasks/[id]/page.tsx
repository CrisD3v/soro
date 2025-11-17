'use client';

/**
 * Task Detail Page
 * Página de detalle de una tarea
 */

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { Button } from '@/components/ui/button';
import type { TaskPriority, TaskStatus } from '@/lib/api/task.types';
import { useDeleteTask, useTask } from '@/lib/queries/task.queries';
import { motion } from 'motion/react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const statusLabels: Record<TaskStatus, string> = {
  TODO: 'Por Hacer',
  IN_PROGRESS: 'En Progreso',
  IN_REVIEW: 'En Revisión',
  DONE: 'Completada',
  CANCELLED: 'Cancelada',
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  URGENT: 'Urgente',
};

const statusColors: Record<TaskStatus, string> = {
  TODO: 'bg-gray-500/20 text-gray-300',
  IN_PROGRESS: 'bg-blue-500/20 text-blue-300',
  IN_REVIEW: 'bg-yellow-500/20 text-yellow-300',
  DONE: 'bg-green-500/20 text-green-300',
  CANCELLED: 'bg-red-500/20 text-red-300',
};

const priorityColors: Record<TaskPriority, string> = {
  LOW: 'bg-gray-500/20 text-gray-300',
  MEDIUM: 'bg-blue-500/20 text-blue-300',
  HIGH: 'bg-orange-500/20 text-orange-300',
  URGENT: 'bg-red-500/20 text-red-300',
};

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const { data: task, isLoading } = useTask(taskId);
  const deleteMutation = useDeleteTask();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(taskId, {
      onSuccess: () => {
        toast.success('Tarea eliminada exitosamente');
        router.push('/dashboard/tasks');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al eliminar tarea');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-400">Tarea no encontrada</p>
          <Button onClick={() => router.push('/dashboard/tasks')} className="mt-4">
            Volver a Tareas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex justify-between items-start"
      >
        <div>
          <h1 className="text-3xl font-bold">{task.title}</h1>
          <p className="text-gray-400 mt-1">Detalles de la tarea</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/tasks/${taskId}/edit`)}
          >
            Editar
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            Eliminar
          </Button>
        </div>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Estado</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${statusColors[task.status]
              }`}
          >
            {statusLabels[task.status]}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Prioridad</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${priorityColors[task.priority]
              }`}
          >
            {priorityLabels[task.priority]}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Fecha Límite</p>
          <p className="text-xl font-semibold mt-2">
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
              : 'Sin fecha límite'}
          </p>
        </motion.div>
      </div>

      {/* Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 space-y-6"
      >
        <div>
          <h2 className="text-xl font-semibold mb-4">Información General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm">Descripción</p>
              <p className="mt-1">{task.description}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">ID del Proyecto</p>
              <p className="mt-1 font-mono text-sm">{task.projectId}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Asignado a</p>
              <p className="mt-1">{task.assignedToId || 'Sin asignar'}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Fecha de Creación</p>
              <p className="mt-1">
                {new Date(task.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Última Actualización</p>
              <p className="mt-1">
                {new Date(task.updatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="¿Eliminar tarea?"
        description={`¿Estás seguro de que deseas eliminar la tarea "${task.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
