'use client';

/**
 * Project Detail Page
 * Página de detalle de un proyecto específico
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProjectStatus } from '@/lib/api/project.types';
import { useProject } from '@/lib/queries/project.queries';
import { ArrowLeft, Building, Calendar, Edit, Hash } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const statusLabels: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: 'Planificación',
  [ProjectStatus.IN_PROGRESS]: 'En Progreso',
  [ProjectStatus.ON_HOLD]: 'En Espera',
  [ProjectStatus.COMPLETED]: 'Completado',
  [ProjectStatus.CANCELLED]: 'Cancelado',
};

const statusColors: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: 'default',
  [ProjectStatus.IN_PROGRESS]: 'default',
  [ProjectStatus.ON_HOLD]: 'secondary',
  [ProjectStatus.COMPLETED]: 'default',
  [ProjectStatus.CANCELLED]: 'destructive',
};

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: project, isLoading, error } = useProject(id);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-600 dark:text-white/60">Cargando proyecto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500">Error al cargar proyecto: {error?.message || 'Proyecto no encontrado'}</p>
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
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {project.name}
            </h1>
            <p className="text-gray-600 dark:text-white/60 mt-1">
              Detalles del proyecto
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/projects/${id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Información Básica */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Información Básica
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60">Nombre</label>
                <p className="text-gray-900 dark:text-white font-medium">{project.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60">Descripción</label>
                <p className="text-gray-900 dark:text-white">{project.description}</p>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Cronograma
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500 dark:text-white/60" />
                <div>
                  <label className="text-sm text-gray-600 dark:text-white/60">Fecha de Inicio</label>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {new Date(project.startDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              {project.endDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 dark:text-white/60" />
                  <div>
                    <label className="text-sm text-gray-600 dark:text-white/60">Fecha de Fin</label>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {new Date(project.endDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Estado */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Estado
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-white/60">Estado del Proyecto</span>
                <Badge variant={statusColors[project.status] as any}>
                  {statusLabels[project.status]}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-white/60">Estado General</span>
                <Badge variant={project.deletedAt ? 'destructive' : 'default'}>
                  {project.deletedAt ? 'Eliminado' : 'Activo'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Empresa */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Empresa
            </h3>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-500 dark:text-white/60" />
              <span className="text-sm text-gray-900 dark:text-white font-mono">
                {project.companyId}
              </span>
            </div>
          </div>

          {/* Identificación */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Identificación
            </h3>
            <div className="flex items-start gap-2">
              <Hash className="w-4 h-4 text-gray-500 dark:text-white/60 mt-0.5" />
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60">ID del Sistema</label>
                <p className="text-sm text-gray-900 dark:text-white font-mono break-all">
                  {project.id}
                </p>
              </div>
            </div>
          </div>

          {/* Fechas del Sistema */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Información del Sistema
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60">Creado</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {new Date(project.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60">Última actualización</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {new Date(project.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {project.deletedAt && (
                <div>
                  <label className="text-sm text-gray-600 dark:text-white/60">Eliminado</label>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {new Date(project.deletedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
