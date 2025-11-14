'use client';

/**
 * Company Detail Page
 * Página de detalle de una empresa específica
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCompany } from '@/lib/queries/company.queries';
import { ArrowLeft, Building, Edit, Hash, MapPin, Phone, TreePine } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface CompanyDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CompanyDetailPage({ params }: CompanyDetailPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: company, isLoading, error } = useCompany(id);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-600 dark:text-white/60">Cargando empresa...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500">Error al cargar empresa: {error?.message || 'Empresa no encontrada'}</p>
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
              {company.name}
            </h1>
            <p className="text-gray-600 dark:text-white/60 mt-1">
              Detalles de la empresa
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/companies/${id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/companies/${id}/hierarchy`)}
            >
              <TreePine className="w-4 h-4 mr-2" />
              Jerarquía
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60">Nombre</label>
                <p className="text-gray-900 dark:text-white font-medium">{company.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60">NIT</label>
                <p className="text-gray-900 dark:text-white font-medium font-mono">{company.nit}</p>
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
                <MapPin className="w-5 h-5 text-gray-500 dark:text-white/60" />
                <div>
                  <label className="text-sm text-gray-600 dark:text-white/60">Dirección</label>
                  <p className="text-gray-900 dark:text-white font-medium">{company.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500 dark:text-white/60" />
                <div>
                  <label className="text-sm text-gray-600 dark:text-white/60">Teléfono</label>
                  <p className="text-gray-900 dark:text-white font-medium">{company.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Jerarquía */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Jerarquía Empresarial
              </h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/dashboard/companies/${id}/hierarchy`)}
              >
                <TreePine className="w-4 h-4 mr-2" />
                Ver Completa
              </Button>
            </div>
            {company.parentId ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-white/60">Empresa Padre:</p>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="font-mono text-sm">{company.parentId}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-white/60 text-sm">
                Esta es una empresa independiente (sin empresa padre)
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
                <Badge variant={company.deletedAt ? 'destructive' : 'default'}>
                  {company.deletedAt ? 'Eliminada' : 'Activa'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-white/60">Tipo</span>
                <Badge variant="secondary">
                  {company.parentId ? 'Subsidiaria' : 'Independiente'}
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
                    {company.id}
                  </p>
                </div>
              </div>
              {company.parentId && (
                <div className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-gray-500 dark:text-white/60 mt-0.5" />
                  <div>
                    <label className="text-sm text-gray-600 dark:text-white/60">ID Empresa Padre</label>
                    <p className="text-sm text-gray-900 dark:text-white font-mono break-all">
                      {company.parentId}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fechas */}
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Información del Sistema
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60">Creada</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {new Date(company.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-white/60">Última actualización</label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {new Date(company.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              {company.deletedAt && (
                <div>
                  <label className="text-sm text-gray-600 dark:text-white/60">Eliminada</label>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {new Date(company.deletedAt).toLocaleDateString('es-ES', {
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
