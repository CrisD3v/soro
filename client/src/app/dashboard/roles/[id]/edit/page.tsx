'use client';

/**
 * Role Edit Page
 * Página de edición de rol
 */

import { RoleForm } from '@/components/organisms/RoleForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { CreateRoleDto } from '@/lib/api/role.types';
import { useRole, useUpdateRole } from '@/lib/queries/role.queries';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface RoleEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RoleEditPage({ params }: RoleEditPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = use(params);
  const { data: role, isLoading, error } = useRole(id);
  const updateRoleMutation = useUpdateRole();

  const handleSubmit = async (data: CreateRoleDto) => {
    try {
      await updateRoleMutation.mutateAsync({ id, data });
      toast({
        title: 'Rol actualizado',
        description: 'Los cambios se han guardado exitosamente.',
      });
      router.push(`/dashboard/roles/${id}`);
    } catch (error: any) {
      toast({
        title: 'Error al actualizar rol',
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
            <p className="text-sm text-gray-600 dark:text-white/60">Cargando rol...</p>
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

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Editar Rol
          </h1>
          <p className="text-gray-600 dark:text-white/60 mt-1">
            Actualiza la información de {role.name}
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6"
      >
        <RoleForm
          onSubmit={handleSubmit}
          isSubmitting={updateRoleMutation.isPending}
          initialData={{
            name: role.name,
            description: role.description,
          }}
          onCancel={() => router.back()}
        />
      </motion.div>
    </div>
  );
}
