'use client';

/**
 * Role Detail Page
 * Página de detalle de un rol específico
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRole } from '@/lib/queries/role.queries';
import { ArrowLeft, Edit, Hash, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface RoleDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RoleDetailPage({ params }: RoleDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: role, isLoading, error } = useRole(id);

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

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {role.name}
            </h1>
            <p className="text-gray-600 dark:text-white/60 mt-1">
              Detalles del rol
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/roles/${id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/roles/${id}/permissions`)}
            >
              <Shield className="w-4 h-4 mr-2" />
              Permisos
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Información Básica */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Información Básica
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60">Nombre</label>
                <p className="text-gray-900 dark:text-white font-medium">{role.name}</p>
              </div>
              {role.description && (
                <div>
                  <label className="text-sm text-gray-600 dark:text-white/60">Descripción</label>
                  <p className="text-gray-900 dark:text-white">{role.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Permisos */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Permisos Asignados
              </h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/dashboard/roles/${id}/permissions`)}
              >
                <Shield className="w-4 h-4 mr-2" />
                Gestionar
              </Button>
            </div>
            {role.permissions && role.permissions.length > 0 ? (
              <div className="space-y-2">
                {role.permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {permission.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-white/60">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-white/60 text-sm">
                Este rol no tiene permisos asignados
              </p>
            )}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Estado */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Estado
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-white/60">Estado</span>
                <Badge variant={role.deletedAt ? 'destructive' : 'default'}>
                  {role.deletedAt ? 'Eliminado' : 'Activo'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-white/60">Permisos</span>
                <Badge variant="secondary">
                  {role.permissionCount || role.permissions?.length || 0}
                </Badge>
              </div>
            </div>
          </div>

          {/* Identificación */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Identificación
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Hash className="w-4 h-4 text-gray-500 dark:text-white/60 mt-0.5" />
                <div>
                  <label className="text-sm text-gray-600 dark:text-white/60">ID del Sistema</label>
                  <p className="text-sm text-gray-900 dark:text-white font-mono break-all">
                    {role.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Información del Sistema
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60">Creado</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {new Date(role.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60">Última actualización</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {new Date(role.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {role.deletedAt && (
                <div>
                  <label className="text-sm text-gray-600 dark:text-white/60">Eliminado</label>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {new Date(role.deletedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
