'use client';

/**
 * Edit Contact Page
 * Página de edición de contacto
 */

import { ContactForm } from '@/components/organisms/ContactForm';
import { Button } from '@/components/ui/button';
import type { CreateContactDto } from '@/lib/api/contact.types';
import { useContact, useUpdateContact } from '@/lib/queries/contact.queries';
import { motion } from 'motion/react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function EditContactPage() {
  const params = useParams();
  const router = useRouter();
  const contactId = params.id as string;

  const { data: contact, isLoading } = useContact(contactId);
  const updateMutation = useUpdateContact();

  const handleSubmit = (data: CreateContactDto) => {
    updateMutation.mutate(
      { id: contactId, data },
      {
        onSuccess: () => {
          toast.success('Contacto actualizado exitosamente');
          router.push(`/dashboard/contacts/${contactId}`);
        },
        onError: (error: any) => {
          toast.error(error.message || 'Error al actualizar contacto');
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
      >
        <h1 className="text-3xl font-bold">Editar Contacto</h1>
        <p className="text-gray-400 mt-1">Actualiza la información del contacto</p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
      >
        <ContactForm
          onSubmit={handleSubmit}
          isSubmitting={updateMutation.isPending}
          initialData={contact}
          onCancel={() => router.push(`/dashboard/contacts/${contactId}`)}
        />
      </motion.div>
    </div>
  );
}
