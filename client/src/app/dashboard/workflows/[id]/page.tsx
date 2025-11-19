'use client';

/**
 * Workflow Detail Page
 * Página de detalle de un workflow
 */

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { Button } from '@/components/ui/button';
import {
  WORKFLOW_TRIGGER_COLORS,
  WORKFLOW_TRIGGER_LABELS,
} from '@/lib/api/workflow.types';
import { useDeleteWorkflow, useWorkflow } from '@/lib/queries/workflow.queries';
import { ArrowLeft, Edit, Power, PowerOff, Trash2, Workflow as WorkflowIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';

interface WorkflowDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function WorkflowDetailPage({ params }: WorkflowDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: workflow, isLoading } = useWorkflow(id);
  const deleteMutation = useDeleteWorkflow();

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        router.push('/dashboard/workflows');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="h-64 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <WorkflowIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Workflow no encontrado
          </h2>
          <p className="text-white/60 mb-6">
            El workflow que buscas no existe o fue eliminado
          </p>
          <Button onClick={() => router.push('/dashboard/workflows')}>
            Volver a Workflows
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/workflows')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <WorkflowIcon className="w-8 h-8 text-purple-400" />
              {workflow.name}
            </h1>
            <p className="text-white/60 mt-1">Detalle del workflow</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/dashboard/workflows/${id}/edit`)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button
            onClick={() => setIsDeleteDialogOpen(true)}
            variant="destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Información Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 space-y-6"
      >
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Información General
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-white/60 text-sm mb-1">Nombre</p>
              <p className="text-white font-medium">{workflow.name}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Tipo de Trigger</p>
              <span
                className={`inline-block px-3 py-1 rounded-md text-sm font-medium border ${WORKFLOW_TRIGGER_COLORS[workflow.triggerType]
                  }`}
              >
                {WORKFLOW_TRIGGER_LABELS[workflow.triggerType]}
              </span>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Estado</p>
              <div className="flex items-center gap-2">
                {workflow.isActive ? (
                  <>
                    <Power className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium">Activo</span>
                  </>
                ) : (
                  <>
                    <PowerOff className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 font-medium">Inactivo</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {workflow.description && (
          <div>
            <p className="text-white/60 text-sm mb-1">Descripción</p>
            <p className="text-white">{workflow.description}</p>
          </div>
        )}

        <div>
          <p className="text-white/60 text-sm mb-2">Configuración</p>
          <div className="bg-black/20 rounded-lg p-4 overflow-x-auto">
            <pre className="text-white/80 text-sm font-mono">
              {JSON.stringify(workflow.config, null, 2)}
            </pre>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-white/60 text-sm mb-1">Fecha de Creación</p>
              <p className="text-white">
                {new Date(workflow.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Última Actualización</p>
              <p className="text-white">
                {new Date(workflow.updatedAt).toLocaleDateString('es-ES', {
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

      {/* Dialog de Confirmar Eliminación */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Eliminar Workflow"
        description={`¿Estás seguro de que deseas eliminar el workflow "${workflow.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
