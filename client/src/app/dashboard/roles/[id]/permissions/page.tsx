'use client';

/**
 * Role Permissions Page
 * Página de gestión de permisos de un rol
 */

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/lib/queries/permission.queries';
import { useAssignPermission, useRemovePermission, useRole } from '@/lib/queries/role.queries';
import { ArrowLeft, Plus, Shield, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';

interface RolePermissionsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RolePermissionsPage({ params }: RolePermissionsPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = use(params);
  const { data: role, isLoading: isLoadingRole, error } = useRole(id);
  const { data: allPermissions = [], isLoading: isLoadingPermissions } = usePermissions();
  const assignPermissionMutation = useAssignPermission();
  const removePermissionMutation = useRemovePermission();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPermissionId, setSelectedPermissionId] = useState<string>('');

  // Permisos disponibles (no asignados al rol)
  const availablePermissions = allPermissions.filter(
    (permission) => !role?.permissions?.some((p) => p.id === permission.id)
  );

  const handleAssignPermission = async () => {
    if (!selectedPermissionId) return;

    try {
      await assignPermissionMutation.mutateAsync({
        id,
        data: { permissionId: selectedPermissionId },
      });
      toast({
        title: 'Permiso asignado',
        description: 'El permiso ha sido asignado exitosamente.',
      });
      setIsDialogOpen(false);
      setSelectedPermissionId('');
    } catch (error: any) {
      toast({
        title: 'Error al asignar permiso',
        description: error.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    }
  };

  const handleRemovePermission = async (permissionId: string) => {
    try {
      await removePermissionMutation.mutateAsync({ id, permissionId });
      toast({
        title: 'Permiso removido',
        description: 'El permiso ha sido removido exitosamente.',
      });
    } catch (error: any) {
      toast({
        title: 'Error al remover permiso',
        description: error.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    }
  };

  if (isLoadingRole || isLoadingPermissions) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-600 dark:text-white/60">Cargando permisos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500">Error al cargar rol: {error?.message || 'Rol no encontrado'}</p>
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
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestionar Permisos
            </h1>
            <p className="text-gray-600 dark:text-white/60 mt-1">
              Permisos del rol {role.name}
            </p>
          </div>

          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Asignar Permiso
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Permisos Asignados</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {role.permissions?.length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Permisos Disponibles</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {availablePermissions.length}
          </p>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Total Permisos</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {allPermissions.length}
          </p>
        </div>
      </motion.div>

      {/* Permisos Asignados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
        className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Permisos Asignados
        </h2>
        {role.permissions && role.permissions.length > 0 ? (
          <div className="space-y-2">
            {role.permissions.map((permission) => (
              <div
                key={permission.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {permission.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-white/60">
                      {permission.description}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemovePermission(permission.id)}
                  disabled={removePermissionMutation.isPending}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Shield className="w-12 h-12 text-gray-400 dark:text-white/40 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-white/60">
              Este rol no tiene permisos asignados
            </p>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(true)}
              className="mt-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              Asignar Primer Permiso
            </Button>
          </div>
        )}
      </motion.div>

      {/* Dialog para asignar permiso */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Permiso</DialogTitle>
            <DialogDescription>
              Selecciona un permiso para asignar al rol {role.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="permission">Permiso</Label>
              <Select
                value={selectedPermissionId}
                onValueChange={setSelectedPermissionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un permiso" />
                </SelectTrigger>
                <SelectContent>
                  {availablePermissions.map((permission) => (
                    <SelectItem key={permission.id} value={permission.id}>
                      <div>
                        <p className="font-medium">{permission.name}</p>
                        <p className="text-sm text-gray-500">{permission.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssignPermission}
              disabled={!selectedPermissionId || assignPermissionMutation.isPending}
            >
              {assignPermissionMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Asignando...
                </>
              ) : (
                'Asignar Permiso'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
