'use client';

/**
 * Deals Page
 * Página principal de gestión de deals CRM
 */

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { DataTable } from '@/components/organisms/DataTable';
import { DealForm } from '@/components/organisms/DealForm';
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
import type { CreateDealDto, Deal, DealStage } from '@/lib/api/deal.types';
import {
  useCreateDeal,
  useDeals,
  useDeleteDeal,
} from '@/lib/queries/deal.queries';
import type { ColDef } from 'ag-grid-community';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
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

export default function DealsPage() {
  const router = useRouter();
  const { data: deals, isLoading } = useDeals();
  const createMutation = useCreateDeal();
  const deleteMutation = useDeleteDeal();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [dealToDelete, setDealToDelete] = useState<Deal | null>(null);

  // Columnas de la tabla
  const columns: ColDef<Deal>[] = [
    {
      field: 'title',
      headerName: 'Título',
      flex: 2,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'value',
      headerName: 'Valor',
      flex: 1,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'USD',
        }).format(params.value),
    },
    {
      field: 'stage',
      headerName: 'Etapa',
      flex: 1,
      filter: 'agSetColumnFilter',
      valueFormatter: (params) => stageLabels[params.value as DealStage] || params.value,
    },
    {
      field: 'probability',
      headerName: 'Probabilidad',
      flex: 1,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) => `${params.value}%`,
    },
    {
      field: 'expectedCloseDate',
      headerName: 'Cierre Esperado',
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
      headerName: 'Creado',
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
  const handleCreate = (data: CreateDealDto) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Deal creado exitosamente');
        setIsCreateDialogOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al crear deal');
      },
    });
  };

  const handleDelete = () => {
    if (!dealToDelete) return;

    deleteMutation.mutate(dealToDelete.id, {
      onSuccess: () => {
        toast.success('Deal eliminado exitosamente');
        setDealToDelete(null);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al eliminar deal');
      },
    });
  };

  const handleRowClick = (deal: Deal) => {
    router.push(`/dashboard/deals/${deal.id}`);
  };

  const handleContextMenu = (deal: Deal) => {
    setSelectedDeal(deal);
  };

  // Stats
  const totalDeals = deals?.length || 0;
  const totalValue = deals?.reduce((sum, deal) => sum + deal.value, 0) || 0;
  const wonDeals = deals?.filter((d) => d.stage === 'CLOSED_WON').length || 0;
  const activeDeals = deals?.filter((d) => d.stage !== 'CLOSED_WON' && d.stage !== 'CLOSED_LOST').length || 0;

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
          <h1 className="text-3xl font-bold">Deals</h1>
          <p className="text-gray-400 mt-1">Gestiona tu pipeline de ventas</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Nuevo Deal
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
          <p className="text-gray-400 text-sm">Total de Deals</p>
          <p className="text-3xl font-bold mt-2">{totalDeals}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Valor Total</p>
          <p className="text-3xl font-bold mt-2">
            {new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
            }).format(totalValue)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Deals Activos</p>
          <p className="text-3xl font-bold mt-2">{activeDeals}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.25 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Deals Ganados</p>
          <p className="text-3xl font-bold mt-2">{wonDeals}</p>
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
              <DataTable<Deal>
                data={deals || []}
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
            <ContextMenuItem onClick={() => selectedDeal && router.push(`/dashboard/deals/${selectedDeal.id}`)}>
              Ver Detalles
            </ContextMenuItem>
            <ContextMenuItem onClick={() => selectedDeal && router.push(`/dashboard/deals/${selectedDeal.id}/edit`)}>
              Editar
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="text-red-500"
              onClick={() => selectedDeal && setDealToDelete(selectedDeal)}
            >
              Eliminar
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo Deal</DialogTitle>
            <DialogDescription>
              Crea un nuevo deal en el pipeline de ventas
            </DialogDescription>
          </DialogHeader>
          <DealForm
            onSubmit={handleCreate}
            isSubmitting={createMutation.isPending}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!dealToDelete}
        onOpenChange={(open) => !open && setDealToDelete(null)}
        onConfirm={handleDelete}
        title="¿Eliminar deal?"
        description={`¿Estás seguro de que deseas eliminar el deal "${dealToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
