'use client';

/**
 * Tasks Page
 * Página principal de gestión de tareas
 */

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { DataTable } from '@/components/organisms/DataTable';
import { TaskForm } from '@/components/organisms/TaskForm';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CreateTaskDto, Task, TaskPriority, TaskStatus } from '@/lib/api/task.types';
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
} from '@/lib/queries/task.queries';
import type { ColDef } from 'ag-grid-community';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
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

export default function TasksPage() {
  const router = useRouter();
  const { data: tasks, isLoading } = useTasks();
  const createMutation = useCreateTask();
  const deleteMutation = useDeleteTask();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Columnas de la tabla
  const columns: ColDef<Task>[] = [
    {
      field: 'title',
      headerName: 'Título',
      flex: 2,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'description',
      headerName: 'Descripción',
      flex: 2,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'status',
      headerName: 'Estado',
      flex: 1,
      filter: 'agSetColumnFilter',
      valueFormatter: (params) => statusLabels[params.value as TaskStatus] || params.value,
    },
    {
      field: 'priority',
      headerName: 'Prioridad',
      flex: 1,
      filter: 'agSetColumnFilter',
      valueFormatter: (params) => priorityLabels[params.value as TaskPriority] || params.value,
    },
    {
      field: 'dueDate',
      headerName: 'Fecha Límite',
      flex: 1,
      filter: 'agDateColumnFilter',
      valueFormatter: (params) => {
        if (!params.value) return 'Sin fecha';
        return new Date(params.value).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
    },
    {
      field: 'createdAt',
      headerName: 'Creada',
      flex: 1,
      filter: 'agDateColumnFilter',
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
  ];

  // Handlers
  const handleCreate = (data: CreateTaskDto) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Tarea creada exitosamente');
        setIsCreateDialogOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al crear tarea');
      },
    });
  };

  const handleDelete = () => {
    if (!taskToDelete) return;

    deleteMutation.mutate(taskToDelete.id, {
      onSuccess: () => {
        toast.success('Tarea eliminada exitosamente');
        setTaskToDelete(null);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al eliminar tarea');
      },
    });
  };

  const handleRowClick = (task: Task) => {
    router.push(`/dashboard/tasks/${task.id}`);
  };

  const handleContextMenu = (task: Task) => {
    setSelectedTask(task);
  };

  // Stats
  const totalTasks = tasks?.length || 0;
  const todoTasks = tasks?.filter((t) => t.status === 'TODO').length || 0;
  const inProgressTasks = tasks?.filter((t) => t.status === 'IN_PROGRESS').length || 0;
  const doneTasks = tasks?.filter((t) => t.status === 'DONE').length || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold">Tareas</h1>
          <p className="text-gray-400 mt-1">Gestiona las tareas de tus proyectos</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Nueva Tarea
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Total de Tareas</p>
          <p className="text-3xl font-bold mt-2">{totalTasks}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Por Hacer</p>
          <p className="text-3xl font-bold mt-2">{todoTasks}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">En Progreso</p>
          <p className="text-3xl font-bold mt-2">{inProgressTasks}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.25 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Completadas</p>
          <p className="text-3xl font-bold mt-2">{doneTasks}</p>
        </motion.div>
      </div>

      {/* Table con Context Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div>
              <DataTable<Task>
                data={tasks || []}
                columnDefs={columns}
                loading={isLoading}
                onRowClick={handleRowClick}
                onRowContextMenu={handleContextMenu}
                pagination={true}
                pageSize={20}
                enableFilters={true}
                enableSorting={true}
                height={600}
                darkMode={true}
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem onClick={() => selectedTask && router.push(`/dashboard/tasks/${selectedTask.id}`)}>
              Ver Detalles
            </ContextMenuItem>
            <ContextMenuItem onClick={() => selectedTask && router.push(`/dashboard/tasks/${selectedTask.id}/edit`)}>
              Editar
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="text-red-500"
              onClick={() => selectedTask && setTaskToDelete(selectedTask)}
            >
              Eliminar
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nueva Tarea</DialogTitle>
            <DialogDescription>
              Crea una nueva tarea para un proyecto
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            onSubmit={handleCreate}
            isSubmitting={createMutation.isPending}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!taskToDelete}
        onOpenChange={(open) => !open && setTaskToDelete(null)}
        onConfirm={handleDelete}
        title="¿Eliminar tarea?"
        description={`¿Estás seguro de que deseas eliminar la tarea "${taskToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
