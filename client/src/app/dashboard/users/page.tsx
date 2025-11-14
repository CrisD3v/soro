'use client';

/**
 * Users Page
 * Página de gestión de usuarios con Dialog, Form y Context Menu
 */

import { DataTable } from '@/components/organisms/DataTable';
import { UserForm } from '@/components/organisms/UserForm';
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
import { useToast } from '@/hooks/use-toast';
import type { CreateUserDto, User } from '@/lib/api/user.types';
import { useCreateUser, useUsers } from '@/lib/queries/user.queries';
import type { ColDef } from 'ag-grid-community';
import { Edit, Eye, FileSignature, Shield, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function UsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: users = [], isLoading, error } = useUsers();
  const createUserMutation = useCreateUser();

  // Estado del dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Usuario seleccionado para context menu
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number } | null>(null);

  // Definición de columnas para ag-grid
  const columnDefs = useMemo<ColDef<User>[]>(
    () => [
      {
        headerName: 'Nombre Completo',
        field: 'fullName',
        filter: 'agTextColumnFilter',
        minWidth: 200,
      },
      {
        headerName: 'Email',
        field: 'email',
        filter: 'agTextColumnFilter',
        minWidth: 200,
      },
      {
        headerName: 'Documento',
        field: 'documentNumber',
        filter: 'agTextColumnFilter',
        width: 150,
      },
      {
        headerName: 'Tipo Doc.',
        field: 'documentType',
        filter: 'agTextColumnFilter',
        width: 120,
      },
      {
        headerName: 'Teléfono',
        field: 'phone',
        filter: 'agTextColumnFilter',
        width: 150,
      },
      {
        headerName: 'Roles',
        valueGetter: (params) => params.data?.roles?.length || 0,
        filter: 'agNumberColumnFilter',
        width: 100,
      },
      {
        headerName: 'Firma',
        valueGetter: (params) => (params.data?.signature ? 'Sí' : 'No'),
        filter: 'agTextColumnFilter',
        width: 100,
      },
      {
        headerName: 'Fecha Creación',
        field: 'createdAt',
        filter: 'agDateColumnFilter',
        valueFormatter: (params) => {
          if (!params.value) return '';
          return new Date(params.value).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        },
        width: 150,
      },
    ],
    []
  );

  // Handler para click en fila
  const handleRowClick = (user: User) => {
    router.push(`/dashboard/users/${user.id}`);
  };

  // Handler para context menu (click derecho)
  const handleContextMenu = (user: User) => {
    setSelectedUser(user);
  };

  // Handler para crear usuario
  const handleCreateUser = () => {
    setIsDialogOpen(true);
  };

  // Handler para enviar formulario
  const handleSubmitUser = async (data: CreateUserDto) => {
    try {
      await createUserMutation.mutateAsync(data);
      toast({
        title: 'Usuario creado',
        description: `${data.name} ${data.lastName} ha sido creado exitosamente.`,
      });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error al crear usuario',
        description: error.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    }
  };

  // Handlers del context menu
  const handleViewUser = (user: User) => {
    router.push(`/dashboard/users/${user.id}`);
  };

  const handleEditUser = (user: User) => {
    router.push(`/dashboard/users/${user.id}/edit`);
  };

  const handleAssignRole = (user: User) => {
    router.push(`/dashboard/users/${user.id}/roles`);
  };

  const handleAssignSignature = (user: User) => {
    router.push(`/dashboard/users/${user.id}/signature`);
  };

  const handleDeleteUser = (user: User) => {
    // TODO: Implementar confirmación y eliminación
    toast({
      title: 'Función no disponible',
      description: 'La eliminación de usuarios estará disponible próximamente.',
    });
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500">Error al cargar usuarios: {(error as Error).message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Usuarios</h1>
          <p className="text-gray-600 dark:text-white/60 mt-1">
            Gestiona los usuarios del sistema
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateUser}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Crear Usuario
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Total Usuarios</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{users.length}</p>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Con Firma</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {users.filter((u) => u.signature).length}
          </p>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Con Roles</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {users.filter((u) => u.roles.length > 0).length}
          </p>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Sin Roles</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {users.filter((u) => u.roles.length === 0).length}
          </p>
        </div>
      </motion.div>

      {/* Table con Context Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      >
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div>
              <DataTable
                data={users}
                columnDefs={columnDefs}
                loading={isLoading}
                emptyMessage="No hay usuarios registrados"
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
          <ContextMenuContent className="w-56">
            <ContextMenuItem
              onClick={() => selectedUser && handleViewUser(selectedUser)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              Ver Detalles
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => selectedUser && handleEditUser(selectedUser)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              Editar
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => selectedUser && handleAssignRole(selectedUser)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              Asignar Rol
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => selectedUser && handleAssignSignature(selectedUser)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FileSignature className="w-4 h-4" />
              Asignar Firma
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => selectedUser && handleDeleteUser(selectedUser)}
              className="flex items-center gap-2 text-red-600 dark:text-red-400 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </motion.div>

      {/* Dialog para crear usuario */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Completa el formulario para crear un nuevo usuario en el sistema.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSubmit={handleSubmitUser}
            isSubmitting={createUserMutation.isPending}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
