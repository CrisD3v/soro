'use client';

/**
 * Projects Page
 * Página de gestión de proyectos
 */

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { DataTable } from '@/components/organisms/DataTable';
import { ProjectForm } from '@/components/organisms/ProjectForm';
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
import { useToast } from '@/hooks/use-toast';
import type { CreateProjectDto, Project, ProjectStatus } from '@/lib/api/project.types';
import { useCreateProject, useDeleteProject, useProjects } from '@/lib/queries/project.queries';
import type { ColDef } from 'ag-grid-community';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

const statusLabels: Record<ProjectStatus, string> = {
  PLANNING: 'Planificación',
  IN_PROGRESS: 'En Progreso',
  ON_HOLD: 'En Espera',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

export default function ProjectsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: projects = [], isLoading, error } = useProjects();
  const createProjectMutation = useCreateProject();
  const deleteProjectMutation = useDeleteProject();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const columnDefs = useMemo<ColDef<Project>[]>(
    () => [
      {
        headerName: 'Nombre',
        field: 'name',
        filter: 'agTextColumnFilter',
        minWidth: 200,
      },
      {
        headerName: 'Descripción',
        field: 'description',
        filter: 'agTextColumnFilter',
        minWidth: 250,
      },
      {
        headerName: 'Estado',
        field: 'status',
        filter: 'agTextColumnFilter',
        valueFormatter: (params) => statusLabels[params.value as ProjectStatus] || params.value,
        width: 150,
      },
      {
        headerName: 'Fecha Inicio',
        field: 'startDate',
        filter: 'agDateColumnFilter',
        valueFormatter: (params) => {
          if (!params.value) return '';
          return new Date(params.value).toLocaleDateString('es-ES');
        },
        width: 130,
      },
      {
        headerName: 'Fecha Fin',
        field: 'endDate',
        filter: 'agDateColumnFilter',
        valueFormatter: (params) => {
          if (!params.value) return 'Sin definir';
          return new Date(params.value).toLocaleDateString('es-ES');
        },
        width: 130,
      },
      {
        headerName: 'Estado',
        valueGetter: (params) => params.data?.deletedAt ? 'Eliminado' : 'Activo',
        filter: 'agTextColumnFilter',
        width: 100,
        cellStyle: (params) => {
          if (params.data?.deletedAt) {
            return { color: '#ef4444' };
          }
          return { color: '#22c55e' };
        },
      },
    ],
    []
  );

  const handleRowClick = (project: Project) => {
    router.push(`/dashboard/projects/${project.id}`);
  };

  const handleContextMenu = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCreateProject = () => {
    setIsDialogOpen(true);
  };

  const handleSubmitProject = async (data: CreateProjectDto) => {
    try {
      await createProjectMutation.mutateAsync(data);
      toast({
        title: 'Proyecto creado',
        description: `${data.name} ha sido creado exitosamente.`,
      });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error al crear proyecto',
        description: error.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    }
  };

  const handleViewProject = (project: Project) => {
    router.push(`/dashboard/projects/${project.id}`);
  };

  const handleEditProject = (project: Project) => {
    router.push(`/dashboard/projects/${project.id}/edit`);
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProjectMutation.mutateAsync(projectToDelete.id);
      toast({
        title: 'Proyecto eliminado',
        description: `${projectToDelete.name} ha sido eliminado exitosamente.`,
      });
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Error al eliminar proyecto',
        description: error.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500">Error al cargar proyectos: {(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Proyectos</h1>
          <p className="text-gray-600 dark:text-white/60 mt-1">
            Gestiona los proyectos del sistema
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateProject}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Proyecto
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{projects.length}</p>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">En Progreso</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {projects.filter((p) => p.status === 'IN_PROGRESS').length}
          </p>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Planificación</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {projects.filter((p) => p.status === 'PLANNING').length}
          </p>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Completados</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {projects.filter((p) => p.status === 'COMPLETED').length}
          </p>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Eliminados</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {projects.filter((p) => p.deletedAt).length}
          </p>
        </div>
      </motion.div>

      {/* Table con Context Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      >
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div>
              <DataTable
                data={projects}
                columnDefs={columnDefs}
                loading={isLoading}
                emptyMessage="No hay proyectos registrados"
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
          <ContextMenuContent className="w-56">
            <ContextMenuItem
              onClick={() => selectedProject && handleViewProject(selectedProject)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              Ver Detalles
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => selectedProject && handleEditProject(selectedProject)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              Editar
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => selectedProject && handleDeleteProject(selectedProject)}
              className="flex items-center gap-2 text-red-600 dark:text-red-400 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </motion.div>

      {/* Dialog para crear proyecto */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
            <DialogDescription>
              Completa el formulario para crear un nuevo proyecto en el sistema.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            onSubmit={handleSubmitProject}
            isSubmitting={createProjectMutation.isPending}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar Proyecto"
        description={`¿Estás seguro de que deseas eliminar el proyecto ${projectToDelete?.name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteProject}
        variant="destructive"
        isLoading={deleteProjectMutation.isPending}
      />
    </div>
  );
}
