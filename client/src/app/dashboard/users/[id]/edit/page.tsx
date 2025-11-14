'use client';

/**
 * User Edit Page
 * Página para editar un usuario existente
 */

import { UserForm } from '@/components/organisms/UserForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { CreateUserDto } from '@/lib/api/user.types';
import { useUpdateUser, useUser } from '@/lib/queries/user.queries';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface UserEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserEditPage({ params }: UserEditPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = use(params);
  const { data: user, isLoading, error } = useUser(id);
  const updateUserMutation = useUpdateUser();

  const handleSubmit = async (data: CreateUserDto) => {
    try {
      await updateUserMutation.mutateAsync({
        id,
        data,
      });
      toast({
        title: 'Usuario actualizado',
        description: `${data.name} ${data.lastName} ha sido actualizado exitosamente.`,
      });
      router.push(`/dashboard/users/${id}`);
    } catch (error: any) {
      toast({
        title: 'Error al actualizar usuario',
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
            Editar Usuario
          </h1>
          <p className="text-gray-600 dark:text-white/60 mt-1">
            Actualiza la información de {user.fullName}
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
        <UserForm
          onSubmit={handleSubmit}
          isSubmitting={updateUserMutation.isPending}
          initialData={{
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            documentNumber: user.documentNumber,
            documentType: user.documentType,
            phone: user.phone,
            companyId: user.companyId,
            password: '', // No mostramos la contraseña actual
          }}
          onCancel={() => router.back()}
        />
      </motion.div>
    </div>
  );
}
