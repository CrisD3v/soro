'use client';

/**
 * Edit Deal Page
 * Página de edición de deal
 */

import { DealForm } from '@/components/organisms/DealForm';
import { Button } from '@/components/ui/button';
import type { CreateDealDto } from '@/lib/api/deal.types';
import { useDeal, useUpdateDeal } from '@/lib/queries/deal.queries';
import { motion } from 'motion/react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function EditDealPage() {
  const params = useParams();
  const router = useRouter();
  const dealId = params.id as string;

  const { data: deal, isLoading } = useDeal(dealId);
  const updateMutation = useUpdateDeal();

  const handleSubmit = (data: CreateDealDto) => {
    updateMutation.mutate(
      { id: dealId, data },
      {
        onSuccess: () => {
          toast.success('Deal actualizado exitosamente');
          router.push(`/dashboard/deals/${dealId}`);
        },
        onError: (error: any) => {
          toast.error(error.message || 'Error al actualizar deal');
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
      >
        <h1 className="text-3xl font-bold">Editar Deal</h1>
        <p className="text-gray-400 mt-1">Actualiza la información del deal</p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
      >
        <DealForm
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          initialData={deal}
          onCancel={() => router.push(`/dashboard/deals/${dealId}`)}
        />
      </motion.div>
    </div>
  );
}
