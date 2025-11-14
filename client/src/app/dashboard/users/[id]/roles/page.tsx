'use client';

/**
 * User Roles Page
 * Página para gestionar roles de un usuario
 */

import { CompanySelect } from '@/components/molecules/CompanySelect';
import { RoleSelect } from '@/components/molecules/RoleSelect';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAssignRole, useUser } from '@/lib/queries/user.queries';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';

interface UserRolesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserRolesPage({ params }: UserRolesPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = use(params);
  const { data: user, isLoading, error } = useUser(id);
  const assignRoleMutation = useAssignRole();

  const [roleId, setRoleId] = useState('');
  const [companyId, setCompanyId] = useState('');

  const handleAssignRole = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleId || !companyId) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }

    try {
      await assignRoleMutation.mutateAsync({
        id,
        data: { roleId, companyId },
      });
      toast({
        title: 'Rol asignado',
        description: 'El rol ha sido asignado exitosamente.',
      });
      setRoleId('');
      setCompanyId('');
    } catch (error: any) {
      toast({
        title: 'Error al asignar rol',
        description: error.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-600 dark:text-white/60">Cargando usuario...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500">Error al cargar usuario: {error?.message || 'Usuario no encontrado'}</p>
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

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Gestionar Roles
          </h1>
          <p className="text-gray-600 dark:text-white/60 mt-1">
            Asigna roles a {user.fullName}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario para asignar rol */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Asignar Nuevo Rol
          </h2>
          <form onSubmit={handleAssignRole} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="roleId">Rol</Label>
              <RoleSelect
                value={roleId}
                onValueChange={setRoleId}
                disabled={assignRoleMutation.isPending}
                placeholder="Selecciona un rol"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyId">Empresa</Label>
              <CompanySelect
                value={companyId}
                onValueChange={setCompanyId}
                disabled={assignRoleMutation.isPending}
                placeholder="Selecciona una empresa"
              />
            </div>

            <Button
              type="submit"
              disabled={assignRoleMutation.isPending}
              className="w-full"
            >
              {assignRoleMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Asignando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Asignar Rol
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Lista de roles actuales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Roles Actuales
          </h2>
          {user.roles.length > 0 ? (
            <div className="space-y-3">
              {user.roles.map((role) => (
                <div
                  key={role.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {role.roleId}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-white/60">
                      Empresa: {role.companyId}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-white/50 mt-1">
                      Asignado el {new Date(role.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-white/60">
                No tiene roles asignados
              </p>
              <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
                Usa el formulario para asignar un rol
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
