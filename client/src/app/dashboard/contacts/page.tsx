'use client';

/**
 * Contacts Page
 * Página principal de gestión de contactos CRM
 */

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { ContactForm } from '@/components/organisms/ContactForm';
import { DataTable } from '@/components/organisms/DataTable';
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
import type { Contact, ContactSource, ContactStatus, CreateContactDto } from '@/lib/api/contact.types';
import {
  useContacts,
  useCreateContact,
  useDeleteContact,
} from '@/lib/queries/contact.queries';
import type { ColDef } from 'ag-grid-community';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
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

export default function ContactsPage() {
  const router = useRouter();
  const { data: contacts, isLoading } = useContacts();
  const createMutation = useCreateContact();
  const deleteMutation = useDeleteContact();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  // Columnas de la tabla
  const columns: ColDef<Contact>[] = [
    {
      field: 'name',
      headerName: 'Nombre',
      flex: 2,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 2,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'phone',
      headerName: 'Teléfono',
      flex: 1,
      filter: 'agTextColumnFilter',
    },
    {
      field: 'position',
      headerName: 'Cargo',
      flex: 1,
      filter: 'agTextColumnFilter',
      valueFormatter: (params) => params.value || 'Sin cargo',
    },
    {
      field: 'companyName',
      headerName: 'Empresa',
      flex: 1,
      filter: 'agTextColumnFilter',
      valueFormatter: (params) => params.value || 'Sin empresa',
    },
    {
      field: 'status',
      headerName: 'Estado',
      flex: 1,
      filter: 'agSetColumnFilter',
      valueFormatter: (params) => statusLabels[params.value as ContactStatus] || params.value,
    },
    {
      field: 'source',
      headerName: 'Fuente',
      flex: 1,
      filter: 'agSetColumnFilter',
      valueFormatter: (params) => sourceLabels[params.value as ContactSource] || params.value,
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
  const handleCreate = (data: CreateContactDto) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Contacto creado exitosamente');
        setIsCreateDialogOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al crear contacto');
      },
    });
  };

  const handleDelete = () => {
    if (!contactToDelete) return;

    deleteMutation.mutate(contactToDelete.id, {
      onSuccess: () => {
        toast.success('Contacto eliminado exitosamente');
        setContactToDelete(null);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Error al eliminar contacto');
      },
    });
  };

  const handleRowClick = (contact: Contact) => {
    router.push(`/dashboard/contacts/${contact.id}`);
  };

  const handleContextMenu = (contact: Contact) => {
    setSelectedContact(contact);
  };

  // Stats
  const totalContacts = contacts?.length || 0;
  const leads = contacts?.filter((c) => c.status === 'LEAD').length || 0;
  const qualified = contacts?.filter((c) => c.status === 'QUALIFIED').length || 0;
  const customers = contacts?.filter((c) => c.status === 'CUSTOMER').length || 0;

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
          <h1 className="text-3xl font-bold">Contactos</h1>
          <p className="text-gray-400 mt-1">Gestiona tus contactos y leads del CRM</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Nuevo Contacto
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
          <p className="text-gray-400 text-sm">Total de Contactos</p>
          <p className="text-3xl font-bold mt-2">{totalContacts}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Leads</p>
          <p className="text-3xl font-bold mt-2">{leads}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Calificados</p>
          <p className="text-3xl font-bold mt-2">{qualified}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.25 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Clientes</p>
          <p className="text-3xl font-bold mt-2">{customers}</p>
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
              <DataTable<Contact>
                data={contacts || []}
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
            <ContextMenuItem onClick={() => selectedContact && router.push(`/dashboard/contacts/${selectedContact.id}`)}>
              Ver Detalles
            </ContextMenuItem>
            <ContextMenuItem onClick={() => selectedContact && router.push(`/dashboard/contacts/${selectedContact.id}/edit`)}>
              Editar
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              className="text-red-500"
              onClick={() => selectedContact && setContactToDelete(selectedContact)}
            >
              Eliminar
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nuevo Contacto</DialogTitle>
            <DialogDescription>
              Crea un nuevo contacto en el CRM
            </DialogDescription>
          </DialogHeader>
          <ContactForm
            onSubmit={handleCreate}
            isSubmitting={createMutation.isPending}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!contactToDelete}
        onOpenChange={(open) => !open && setContactToDelete(null)}
        onConfirm={handleDelete}
        title="¿Eliminar contacto?"
        description={`¿Estás seguro de que deseas eliminar el contacto "${contactToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
