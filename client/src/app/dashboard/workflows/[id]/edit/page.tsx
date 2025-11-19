'use client';

/**
 * Edit Workflow Page
 * Página para editar un workflow
 */

import { WorkflowForm } from '@/components/organisms/WorkflowForm';
import { Button } from '@/components/ui/button';
import type { CreateWorkflowDto } from '@/lib/api/workflow.types';
import { useUpdateWorkflow, useWorkflow } from '@/lib/queries/workflow.queries';
import { ArrowLeft, Workflow as WorkflowIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface EditWorkflowPageProps {
  params: Promise<{ id: string }>;
}

export default function EditWorkflowPage({ params }: EditWorkflowPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: workflow, isLoading } = useWorkflow(id);
  const updateMutation = useUpdateWorkflow();

  const handleSubmit = (data: CreateWorkflowDto) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          router.push(`/dashboard/workflows/${id}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="h-96 bg-white/5 rounded" />
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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/dashboard/workflows/${id}`)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <WorkflowIcon className="w-8 h-8 text-purple-400" />
            Editar Workflow
          </h1>
          <p className="text-white/60 mt-1">
            Actualiza la información del workflow
          </p>
        </div>
      </div>

      {/* Formulario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
      >
        <WorkflowForm
          workflow={workflow}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
        />
      </motion.div>
    </div>
  );
}
