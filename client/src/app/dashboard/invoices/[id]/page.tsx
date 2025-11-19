'use client';

/**
 * Invoice Detail Page
 * Página de detalle de una factura
 */

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { Button } from '@/components/ui/button';
import type { InvoiceStatus } from '@/lib/api/invoice.types';
import { useDeleteInvoice, useInvoice } from '@/lib/queries/invoice.queries';
import { motion } from 'motion/react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const statusLabels: Record<InvoiceStatus, string> = {
  DRAFT: 'Borrador',
  SENT: 'Enviada',
  PAID: 'Pagada',
  OVERDUE: 'Vencida',
  CANCELLED: 'Cancelada',
};

const statusColors: Record<InvoiceStatus, string> = {
  DRAFT: 'bg-gray-500/20 text-gray-300',
  SENT: 'bg-blue-500/20 text-blue-300',
  PAID: 'bg-green-500/20 text-green-300',
  OVERDUE: 'bg-red-500/20 text-red-300',
  CANCELLED: 'bg-gray-500/20 text-gray-300',
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id as string;

  const { data: invoice, isLoading } = useInvoice(invoiceId);
  const deleteMutation = useDeleteInvoice();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(invoiceId, {
      onSuccess: () => {
        toast.success('Factura eliminada exitosamente');
        router.push('/dashboard/invoices');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al eliminar factura');
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

  if (!invoice) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-400">Factura no encontrada</p>
          <Button onClick={() => router.push('/dashboard/invoices')} className="mt-4">
            Volver a Facturas
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
          <h1 className="text-3xl font-bold">Factura {invoice.invoiceNumber}</h1>
          <p className="text-gray-400 mt-1">Detalles de la factura</p>
        </div>
        <div className="flex gap-3">
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
          <p className="text-gray-400 text-sm">Estado</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${statusColors[invoice.status]
              }`}
          >
            {statusLabels[invoice.status]}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Total</p>
          <p className="text-2xl font-bold mt-2">
            {new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'USD',
            }).format(invoice.total)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Fecha Emisión</p>
          <p className="text-xl font-semibold mt-2">
            {new Date(invoice.issueDate).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.25 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Fecha Vencimiento</p>
          <p className="text-xl font-semibold mt-2">
            {new Date(invoice.dueDate).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
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
              <p className="text-gray-400 text-sm">Subtotal</p>
              <p className="mt-1 text-lg font-semibold">
                {new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'USD',
                }).format(invoice.subtotal)}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Impuestos</p>
              <p className="mt-1 text-lg font-semibold">
                {new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'USD',
                }).format(invoice.tax)}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">ID del Contacto</p>
              <p className="mt-1 font-mono text-sm">{invoice.contactId}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Fecha de Creación</p>
              <p className="mt-1">
                {new Date(invoice.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        {invoice.items && invoice.items.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Items de la Factura</h2>
            <div className="space-y-2">
              {invoice.items.map((item, index) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-4 bg-white/5 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-gray-400">
                      {item.quantity} x{' '}
                      {new Intl.NumberFormat('es-ES', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(item.unitPrice)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(item.total)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {invoice.notes && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Notas</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{invoice.notes}</p>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="¿Eliminar factura?"
        description={`¿Estás seguro de que deseas eliminar la factura "${invoice.invoiceNumber}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
