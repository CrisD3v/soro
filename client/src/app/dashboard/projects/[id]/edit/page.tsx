'use client';

/**
 * Project Edit Page
 * Página de edición de proyecto
 */

import { ProjectForm } from '@/components/organisms/ProjectForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { CreateProjectDto } from '@/lib/api/project.types';
import { useProject, useUpdateProject } from '@/lib/queries/project.queries';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface ProjectEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProjectEditPage({ params }: ProjectEditPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = use(params);
  const { data: project, isLoading, error } = useProject(id);
  const updateProjectMutation = useUpdateProject();

  const handleSubmit = async (data: CreateProjectDto) => {
    try {
      await updateProjectMutation.mutateAsync({ id, data });
      toast({
        title: 'Proyecto actualizado',
        description: 'Los cambios se han guardado exitosamente.',
      });
      router.push(`/dashboard/projects/${id}`);
    } catch (error: any) {
      toast({
        title: 'Error al actualizar proyecto',
        description: error.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    }
  };

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

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Editar Proyecto
          </h1>
          <p className="text-gray-600 dark:text-white/60 mt-1">
            Actualiza la información de {project.name}
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6"
      >
        <ProjectForm
          onSubmit={handleSubmit}
          isSubmitting={updateProjectMutation.isPending}
          initialData={{
            name: project.name,
            description: project.description,
            status: project.status,
            startDate: project.startDate,
            endDate: project.endDate,
            companyId: project.companyId,
          }}
          onCancel={() => router.back()}
        />
      </motion.div>
    </div>
  );
}
