'use client';

/**
 * Invoices Page
 * Página principal de gestión de facturas
 */

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { DataTable } from '@/components/organisms/DataTable';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import type { Invoice, InvoiceStatus } from '@/lib/api/invoice.types';
import {
  useDeleteInvoice,
  useInvoices,
} from '@/lib/queries/invoice.queries';
import type { ColDef } from 'ag-grid-community';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const statusLabels: Record<InvoiceStatus, string> = {
  DRAFT: 'Borrador',
  SENT: 'Enviada',
  PAID: 'Pagada',
  OVERDUE: 'Vencida',
  CANCELLED: 'Cancelada',
};

export default function InvoicesPage() {
  const router = useRouter();
  const { data: invoices, isLoading } = useInvoices();
  const deleteMutation = useDeleteInvoice();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  // Columnas de la tabla
  const columns: ColDef<Invoice>[] = [
    {
      field: 'invoiceNumber',
      headerName: 'Número',
      flex: 1,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'issueDate',
      headerName: 'Fecha Emisión',
      flex: 1,
      filter: 'agDateColumnFilter',
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      field: 'dueDate',
      headerName: 'Fecha Vencimiento',
      flex: 1,
      filter: 'agDateColumnFilter',
      valueFormatter: (params) =>
        new Date(params.value).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
    },
    {
      field: 'status',
      headerName: 'Estado',
      flex: 1,
      filter: 'agSetColumnFilter',
      valueFormatter: (params) => statusLabels[params.value as InvoiceStatus] || params.value,
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1,
      filter: 'agNumberColumnFilter',
      valueFormatter: (params) =>
        new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'USD',
        }).format(params.value),
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
  const handleDelete = () => {
    if (!invoiceToDelete) return;

    deleteMutation.mutate(invoiceToDelete.id, {
      onSuccess: () => {
        toast.success('Factura eliminada exitosamente');
        setInvoiceToDelete(null);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al eliminar factura');
      },
    });
  };

  const handleRowClick = (invoice: Invoice) => {
    router.push(`/dashboard/invoices/${invoice.id}`);
  };

  const handleContextMenu = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  // Stats
  const totalInvoices = invoices?.length || 0;
  const totalAmount = invoices?.reduce((sum, inv) => sum + inv.total, 0) || 0;
  const paidInvoices = invoices?.filter((i) => i.status === 'PAID').length || 0;
  const overdueInvoices = invoices?.filter((i) => i.status === 'OVERDUE').length || 0;

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
          <h1 className="text-3xl font-bold">Facturas</h1>
          <p className="text-gray-400 mt-1">Gestiona las facturas y pagos del sistema</p>
        </div>
        <Button disabled>
          Nueva Factura
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
          <p className="text-gray-400 text-sm">Total de Facturas</p>
          <p className="text-3xl font-bold mt-2">{totalInvoices}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Monto Total</p>
          <p className="text-3xl font-bold mt-2">
            {new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'USD',
              notation: 'compact',
            }).format(totalAmount)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Pagadas</p>
          <p className="text-3xl font-bold mt-2">{paidInvoices}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.25 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Vencidas</p>
          <p className="text-3xl font-bold mt-2 text-red-400">{overdueInvoices}</p>
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
              <DataTable<Invoice>
                data={invoices || []}
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
            <ContextMenuItem onClick={() => selectedInvoice && router.push(`/dashboard/invoices/${selectedInvoice.id}`)}>
              Ver Detalles
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="text-red-500"
              onClick={() => selectedInvoice && setInvoiceToDelete(selectedInvoice)}
            >
              Eliminar
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </motion.div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!invoiceToDelete}
        onOpenChange={(open) => !open && setInvoiceToDelete(null)}
        onConfirm={handleDelete}
        title="¿Eliminar factura?"
        description={`¿Estás seguro de que deseas eliminar la factura "${invoiceToDelete?.invoiceNumber}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
