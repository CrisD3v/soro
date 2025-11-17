'use client';

/**
 * Edit Task Page
 * Página de edición de tarea
 */

import { TaskForm } from '@/components/organisms/TaskForm';
import { Button } from '@/components/ui/button';
import type { CreateTaskDto } from '@/lib/api/task.types';
import { useTask, useUpdateTask } from '@/lib/queries/task.queries';
import { motion } from 'motion/react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;

  const { data: task, isLoading } = useTask(taskId);
  const updateMutation = useUpdateTask();

  const handleSubmit = (data: CreateTaskDto) => {
    updateMutation.mutate(
      { id: taskId, data },
      {
        onSuccess: () => {
          toast.success('Tarea actualizada exitosamente');
          router.push(`/dashboard/tasks/${taskId}`);
        },
        onError: (error: any) => {
          toast.error(error.message || 'Error al actualizar tarea');
        },
      }
    );
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
      >
        <h1 className="text-3xl font-bold">Editar Tarea</h1>
        <p className="text-gray-400 mt-1">Actualiza la información de la tarea</p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
      >
        <TaskForm
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          initialData={task}
          onCancel={() => router.push(`/dashboard/tasks/${taskId}`)}
        />
      </motion.div>
    </div>
  );
}
