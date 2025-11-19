'use client';

/**
 * Edit Setting Page
 * Página para editar una configuración
 */

import { SettingForm } from '@/components/organisms/SettingForm';
import { Button } from '@/components/ui/button';
import type { CreateSettingDto } from '@/lib/api/setting.types';
import { useSetting, useUpdateSetting } from '@/lib/queries/setting.queries';
import { ArrowLeft, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface EditSettingPageProps {
  params: Promise<{ id: string }>;
}

export default function EditSettingPage({ params }: EditSettingPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data: setting, isLoading } = useSetting(id);
  const updateMutation = useUpdateSetting();

  const handleSubmit = (data: CreateSettingDto) => {
    updateMutation.mutate(
      { id, data },
      {
        onSuccess: () => {
          router.push(`/dashboard/settings/${id}`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-white/5 rounded w-1/3" />
          <div className="h-96 bg-white/5 rounded" />
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
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/dashboard/settings/${id}`)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-purple-400" />
            Editar Configuración
          </h1>
          <p className="text-white/60 mt-1">
            Actualiza la información de la configuración
          </p>
        </div>
      </div>

      {/* Formulario */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
      >
        <SettingForm
          setting={setting}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
        />
      </motion.div>
    </div>
  );
}
