'use client';

/**
 * Deal Detail Page
 * Página de detalle de un deal
 */

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { Button } from '@/components/ui/button';
import type { DealStage } from '@/lib/api/deal.types';
import { useDeal, useDeleteDeal } from '@/lib/queries/deal.queries';
import { motion } from 'motion/react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const stageLabels: Record<DealStage, string> = {
  LEAD: 'Lead',
  QUALIFIED: 'Calificado',
  PROPOSAL: 'Propuesta',
  NEGOTIATION: 'Negociación',
  CLOSED_WON: 'Ganado',
  CLOSED_LOST: 'Perdido',
};

const stageColors: Record<DealStage, string> = {
  LEAD: 'bg-blue-500/20 text-blue-300',
  QUALIFIED: 'bg-green-500/20 text-green-300',
  PROPOSAL: 'bg-yellow-500/20 text-yellow-300',
  NEGOTIATION: 'bg-orange-500/20 text-orange-300',
  CLOSED_WON: 'bg-purple-500/20 text-purple-300',
  CLOSED_LOST: 'bg-red-500/20 text-red-300',
};

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;

  const { data: deal, isLoading } = useDeal(dealId);
  const deleteMutation = useDeleteDeal();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(dealId, {
      onSuccess: () => {
        toast.success('Deal eliminado exitosamente');
        router.push('/dashboard/deals');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al eliminar deal');
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

  if (!deal) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-400">Deal no encontrado</p>
          <Button onClick={() => router.push('/dashboard/deals')} className="mt-4">
            Volver a Deals
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
          <h1 className="text-3xl font-bold">{deal.title}</h1>
          <p className="text-gray-400 mt-1">Detalles del deal</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/deals/${dealId}/edit`)}
          >
            Editar
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            Eliminar
          </Button>
        </div>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Etapa</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${stageColors[deal.stage]
              }`}
          >
            {stageLabels[deal.stage]}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Valor</p>
          <p className="text-2xl font-bold mt-2">
            {new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'USD',
            }).format(deal.value)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Probabilidad</p>
          <p className="text-2xl font-bold mt-2">{deal.probability}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.25 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Cierre Esperado</p>
          <p className="text-xl font-semibold mt-2">
            {deal.expectedCloseDate
              ? new Date(deal.expectedCloseDate).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
              : 'Sin fecha'}
          </p>
        </motion.div>
      </div>

      {/* Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 space-y-6"
      >
        <div>
          <h2 className="text-xl font-semibold mb-4">Información General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm">ID del Contacto</p>
              <p className="mt-1 font-mono text-sm">{deal.contactId}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">ID de la Empresa</p>
              <p className="mt-1 font-mono text-sm">{deal.companyId}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Fecha de Creación</p>
              <p className="mt-1">
                {new Date(deal.createdAt).toLocaleDateString('es-ES', {
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
                {new Date(deal.updatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {deal.actualCloseDate && (
              <div>
                <p className="text-gray-400 text-sm">Fecha de Cierre Real</p>
                <p className="mt-1">
                  {new Date(deal.actualCloseDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {deal.description && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Descripción</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{deal.description}</p>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="¿Eliminar deal?"
        description={`¿Estás seguro de que deseas eliminar el deal "${deal.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
