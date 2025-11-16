'use client';

/**
 * Roles Page
 * Página de gestión de roles
 */

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { DataTable } from '@/components/organisms/DataTable';
import { RoleForm } from '@/components/organisms/RoleForm';
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
import type { CreateRoleDto, Role } from '@/lib/api/role.types';
import { useCreateRole, useDeleteRole, useRoles } from '@/lib/queries/role.queries';
import type { ColDef } from 'ag-grid-community';
import { Edit, Eye, Shield, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function RolesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: roles = [], isLoading, error } = useRoles();
  const createRoleMutation = useCreateRole();
  const deleteRoleMutation = useDeleteRole();

  // Estado del dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Rol seleccionado para context menu
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Estado del dialog de confirmación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // Definición de columnas para ag-grid
  const columnDefs = useMemo<ColDef<Role>[]>(
    () => [
      {
        headerName: 'Nombre',
        field: 'name',
        filter: 'agTextColumnFilter',
        minWidth: 200,
      },
      {
        headerName: 'Descripción',
        field: 'description',
        filter: 'agTextColumnFilter',
        minWidth: 300,
      },
      {
        headerName: 'Permisos',
        valueGetter: (params) => params.data?.permissions?.length || 0,
        filter: 'agNumberColumnFilter',
        width: 120,
      },
      {
        headerName: 'Estado',
        valueGetter: (params) => params.data?.deletedAt ? 'Eliminado' : 'Activo',
        filter: 'agTextColumnFilter',
        width: 100,
        cellStyle: (params) => {
          if (params.data?.deletedAt) {
            return { color: '#ef4444' };
          }
          return { color: '#22c55e' };
        },
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
  const handleRowClick = (role: Role) => {
    router.push(`/dashboard/roles/${role.id}`);
  };

  // Handler para context menu (click derecho)
  const handleContextMenu = (role: Role) => {
    setSelectedRole(role);
  };

  // Handler para crear rol
  const handleCreateRole = () => {
    setIsDialogOpen(true);
  };

  // Handler para enviar formulario
  const handleSubmitRole = async (data: CreateRoleDto) => {
    try {
      await createRoleMutation.mutateAsync(data);
      toast({
        title: 'Rol creado',
        description: `${data.name} ha sido creado exitosamente.`,
      });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error al crear rol',
        description: error.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    }
  };

  // Handlers del context menu
  const handleViewRole = (role: Role) => {
    router.push(`/dashboard/roles/${role.id}`);
  };

  const handleEditRole = (role: Role) => {
    router.push(`/dashboard/roles/${role.id}/edit`);
  };

  const handleManagePermissions = (role: Role) => {
    router.push(`/dashboard/roles/${role.id}/permissions`);
  };

  const handleDeleteRole = (role: Role) => {
    setRoleToDelete(role);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteRole = async () => {
    if (!roleToDelete) return;

    try {
      await deleteRoleMutation.mutateAsync(roleToDelete.id);
      toast({
        title: 'Rol eliminado',
        description: `${roleToDelete.name} ha sido eliminado exitosamente.`,
      });
      setDeleteDialogOpen(false);
      setRoleToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Error al eliminar rol',
        description: error.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500">Error al cargar roles: {(error as Error).message}</p>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Roles</h1>
          <p className="text-gray-600 dark:text-white/60 mt-1">
            Gestiona los roles y permisos del sistema
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateRole}
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
          Crear Rol
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
          <p className="text-gray-600 dark:text-white/60 text-sm">Total Roles</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{roles.length}</p>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Activos</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {roles.filter((r) => !r.deletedAt).length}
          </p>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Con Permisos</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {roles.filter((r) => r.permissions && r.permissions.length > 0).length}
          </p>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Eliminados</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {roles.filter((r) => r.deletedAt).length}
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
                data={roles}
                columnDefs={columnDefs}
                loading={isLoading}
                emptyMessage="No hay roles registrados"
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
              onClick={() => selectedRole && handleViewRole(selectedRole)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              Ver Detalles
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => selectedRole && handleEditRole(selectedRole)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              Editar
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => selectedRole && handleManagePermissions(selectedRole)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              Gestionar Permisos
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => selectedRole && handleDeleteRole(selectedRole)}
              className="flex items-center gap-2 text-red-600 dark:text-red-400 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </motion.div>

      {/* Dialog para crear rol */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Rol</DialogTitle>
            <DialogDescription>
              Completa el formulario para crear un nuevo rol en el sistema.
            </DialogDescription>
          </DialogHeader>
          <RoleForm
            onSubmit={handleSubmitRole}
            isSubmitting={createRoleMutation.isPending}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar Rol"
        description={`¿Estás seguro de que deseas eliminar el rol ${roleToDelete?.name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteRole}
        variant="destructive"
        isLoading={deleteRoleMutation.isPending}
      />
    </div>
  );
}
