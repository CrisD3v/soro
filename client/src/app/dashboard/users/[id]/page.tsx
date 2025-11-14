'use client';

/**
 * User Detail Page
 * Página de detalle de un usuario específico
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/queries/user.queries';
import { ArrowLeft, Building, Calendar, Edit, FileSignature, Mail, Phone, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: user, isLoading, error } = useUser(id);

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

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {user.fullName}
            </h1>
            <p className="text-gray-600 dark:text-white/60 mt-1">
              Detalles del usuario
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/users/${id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/users/${id}/roles`)}
            >
              <Shield className="w-4 h-4 mr-2" />
              Roles
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/users/${id}/signature`)}
            >
              <FileSignature className="w-4 h-4 mr-2" />
              Firma
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
          {/* Información Personal */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Información Personal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60">Nombre</label>
                <p className="text-gray-900 dark:text-white font-medium">{user.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60">Apellido</label>
                <p className="text-gray-900 dark:text-white font-medium">{user.lastName}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60">Tipo de Documento</label>
                <p className="text-gray-900 dark:text-white font-medium">{user.documentType}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60">Número de Documento</label>
                <p className="text-gray-900 dark:text-white font-medium">{user.documentNumber}</p>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Información de Contacto
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500 dark:text-white/60" />
                <div>
                  <label className="text-sm text-gray-600 dark:text-white/60">Email</label>
                  <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500 dark:text-white/60" />
                <div>
                  <label className="text-sm text-gray-600 dark:text-white/60">Teléfono</label>
                  <p className="text-gray-900 dark:text-white font-medium">{user.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-500 dark:text-white/60" />
                <div>
                  <label className="text-sm text-gray-600 dark:text-white/60">ID de Empresa</label>
                  <p className="text-gray-900 dark:text-white font-medium font-mono text-sm">{user.companyId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Roles */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Roles Asignados
              </h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/dashboard/users/${id}/roles`)}
              >
                <Shield className="w-4 h-4 mr-2" />
                Gestionar
              </Button>
            </div>
            {user.roles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {user.roles.map((role) => (
                  <Badge key={role.id} variant="secondary">
                    {role.roleId}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-white/60 text-sm">
                No tiene roles asignados
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
                <span className="text-sm text-gray-600 dark:text-white/60">Firma</span>
                <Badge variant={user.signature ? 'default' : 'secondary'}>
                  {user.signature ? 'Asignada' : 'Sin asignar'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-white/60">Roles</span>
                <Badge variant={user.roles.length > 0 ? 'default' : 'secondary'}>
                  {user.roles.length} {user.roles.length === 1 ? 'rol' : 'roles'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Firma */}
          {user.signature && (
            <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Firma Digital
              </h3>
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <img
                  src={user.signature.signature}
                  alt="Firma"
                  className="w-full h-auto"
                />
              </div>
              <p className="text-xs text-gray-600 dark:text-white/60 mt-2">
                Asignada el {new Date(user.signature.createdAt).toLocaleDateString('es-ES')}
              </p>
            </div>
          )}

          {/* Fechas */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Información del Sistema
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-white/60 mt-0.5" />
                <div>
                  <label className="text-sm text-gray-600 dark:text-white/60">Creado</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(user.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-white/60 mt-0.5" />
                <div>
                  <label className="text-sm text-gray-600 dark:text-white/60">Última actualización</label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(user.updatedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
