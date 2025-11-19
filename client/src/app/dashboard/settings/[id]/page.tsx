'use client';

/**
 * Setting Detail Page
 * Página de detalle de una configuración
 */

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { Button } from '@/components/ui/button';
import {
  SETTING_CATEGORY_COLORS,
  SETTING_CATEGORY_LABELS,
} from '@/lib/api/setting.types';
import { useDeleteSetting, useSetting } from '@/lib/queries/setting.queries';
import { ArrowLeft, Edit, Eye, EyeOff, Settings, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';

interface SettingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function SettingDetailPage({ params }: SettingDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: setting, isLoading } = useSetting(id);
  const deleteMutation = useDeleteSetting();

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        router.push('/dashboard/settings');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="h-64 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  if (!setting) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Settings className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Configuración no encontrada
          </h2>
          <p className="text-white/60 mb-6">
            La configuración que buscas no existe o fue eliminada
          </p>
          <Button onClick={() => router.push('/dashboard/settings')}>
            Volver a Configuraciones
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard/settings')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Settings className="w-8 h-8 text-purple-400" />
              {setting.key}
            </h1>
            <p className="text-white/60 mt-1">Detalle de la configuración</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/dashboard/settings/${id}/edit`)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button
            onClick={() => setIsDeleteDialogOpen(true)}
            variant="destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </Button>
        </div>
      </div>

      {/* Información Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 space-y-6"
      >
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            Información General
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-white/60 text-sm mb-1">Clave</p>
              <p className="text-white font-medium">{setting.key}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Categoría</p>
              <span
                className={`inline-block px-3 py-1 rounded-md text-sm font-medium border ${SETTING_CATEGORY_COLORS[setting.category]
                  }`}
              >
                {SETTING_CATEGORY_LABELS[setting.category]}
              </span>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Valor</p>
              <p className="text-white font-medium break-all">{setting.value}</p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Visibilidad</p>
              <div className="flex items-center gap-2">
                {setting.isPublic ? (
                  <>
                    <Eye className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-medium">Pública</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 font-medium">Privada</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {setting.description && (
          <div>
            <p className="text-white/60 text-sm mb-1">Descripción</p>
            <p className="text-white">{setting.description}</p>
          </div>
        )}

        <div className="pt-4 border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-white/60 text-sm mb-1">Fecha de Creación</p>
              <p className="text-white">
                {new Date(setting.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-white/60 text-sm mb-1">Última Actualización</p>
              <p className="text-white">
                {new Date(setting.updatedAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dialog de Confirmar Eliminación */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Eliminar Configuración"
        description={`¿Estás seguro de que deseas eliminar la configuración "${setting.key}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
