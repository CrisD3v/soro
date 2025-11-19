'use client';

/**
 * Contact Detail Page
 * Página de detalle de un contacto
 */

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { Button } from '@/components/ui/button';
import type { ContactSource, ContactStatus } from '@/lib/api/contact.types';
import { useContact, useDeleteContact } from '@/lib/queries/contact.queries';
import { motion } from 'motion/react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const statusLabels: Record<ContactStatus, string> = {
  LEAD: 'Lead',
  QUALIFIED: 'Calificado',
  CUSTOMER: 'Cliente',
  INACTIVE: 'Inactivo',
};

const sourceLabels: Record<ContactSource, string> = {
  WEBSITE: 'Sitio Web',
  REFERRAL: 'Referido',
  SOCIAL_MEDIA: 'Redes Sociales',
  EMAIL: 'Email',
  PHONE: 'Teléfono',
  OTHER: 'Otro',
};

const statusColors: Record<ContactStatus, string> = {
  LEAD: 'bg-blue-500/20 text-blue-300',
  QUALIFIED: 'bg-green-500/20 text-green-300',
  CUSTOMER: 'bg-purple-500/20 text-purple-300',
  INACTIVE: 'bg-gray-500/20 text-gray-300',
};

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const contactId = params.id as string;

  const { data: contact, isLoading } = useContact(contactId);
  const deleteMutation = useDeleteContact();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    deleteMutation.mutate(contactId, {
      onSuccess: () => {
        toast.success('Contacto eliminado exitosamente');
        router.push('/dashboard/contacts');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al eliminar contacto');
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

  if (!contact) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-400">Contacto no encontrado</p>
          <Button onClick={() => router.push('/dashboard/contacts')} className="mt-4">
            Volver a Contactos
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
          <h1 className="text-3xl font-bold">{contact.name}</h1>
          <p className="text-gray-400 mt-1">Detalles del contacto</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/contacts/${contactId}/edit`)}
          >
            Editar
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
            Eliminar
          </Button>
        </div>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Estado</p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${statusColors[contact.status]
              }`}
          >
            {statusLabels[contact.status]}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Fuente</p>
          <p className="text-xl font-semibold mt-2">{sourceLabels[contact.source]}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Fecha de Creación</p>
          <p className="text-xl font-semibold mt-2">
            {new Date(contact.createdAt).toLocaleDateString('es-ES', {
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
        transition={{ duration: 0.3, delay: 0.25 }}
        className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 space-y-6"
      >
        <div>
          <h2 className="text-xl font-semibold mb-4">Información de Contacto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm">Email</p>
              <p className="mt-1">{contact.email}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Teléfono</p>
              <p className="mt-1">{contact.phone}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Cargo</p>
              <p className="mt-1">{contact.position || 'Sin cargo'}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Empresa</p>
              <p className="mt-1">{contact.companyName || 'Sin empresa'}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Última Actualización</p>
              <p className="mt-1">
                {new Date(contact.updatedAt).toLocaleDateString('es-ES', {
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

        {contact.notes && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Notas</h2>
            <p className="text-gray-300 whitespace-pre-wrap">{contact.notes}</p>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        title="¿Eliminar contacto?"
        description={`¿Estás seguro de que deseas eliminar el contacto "${contact.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
