'use client';

/**
 * User Signature Page
 * Página para asignar/actualizar firma de un usuario
 */

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAssignSignature, useUser } from '@/lib/queries/user.queries';
import { ArrowLeft, Check, Trash2, Upload } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { use, useRef, useState } from 'react';

interface UserSignaturePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserSignaturePage({ params }: UserSignaturePageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = use(params);
  const { data: user, isLoading, error } = useUser(id);
  const assignSignatureMutation = useAssignSignature();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewSignature, setPreviewSignature] = useState<string | null>(null);
  const [signatureFile, setSignatureFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Archivo inválido',
        description: 'Por favor selecciona una imagen',
        variant: 'destructive',
      });
      return;
    }

    // Validar tamaño (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'Archivo muy grande',
        description: 'La imagen no debe superar 2MB',
        variant: 'destructive',
      });
      return;
    }

    setSignatureFile(file);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewSignature(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSignature = async () => {
    if (!previewSignature) {
      toast({
        title: 'No hay firma',
        description: 'Por favor selecciona una imagen primero',
        variant: 'destructive',
      });
      return;
    }

    try {
      await assignSignatureMutation.mutateAsync({
        id,
        data: { signature: previewSignature },
      });
      toast({
        title: 'Firma asignada',
        description: 'La firma ha sido asignada exitosamente.',
      });
      setPreviewSignature(null);
      setSignatureFile(null);
    } catch (error: any) {
      toast({
        title: 'Error al asignar firma',
        description: error.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    }
  };

  const handleClearPreview = () => {
    setPreviewSignature(null);
    setSignatureFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
            Gestionar Firma
          </h1>
          <p className="text-gray-600 dark:text-white/60 mt-1">
            Asigna o actualiza la firma de {user.fullName}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subir nueva firma */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {user.signature ? 'Actualizar Firma' : 'Asignar Firma'}
          </h2>

          <div className="space-y-4">
            {/* Input de archivo */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="signature-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
                disabled={assignSignatureMutation.isPending}
              >
                <Upload className="w-4 h-4 mr-2" />
                Seleccionar Imagen
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Formatos: PNG, JPG, GIF. Máximo 2MB
              </p>
            </div>

            {/* Preview */}
            {previewSignature && (
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 p-4">
                  <img
                    src={previewSignature}
                    alt="Preview de firma"
                    className="w-full h-auto max-h-48 object-contain"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleUploadSignature}
                    disabled={assignSignatureMutation.isPending}
                    className="flex-1"
                  >
                    {assignSignatureMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Guardar Firma
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClearPreview}
                    disabled={assignSignatureMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Firma actual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Firma Actual
          </h2>
          {user.signature ? (
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <img
                  src={user.signature.signature}
                  alt="Firma actual"
                  className="w-full h-auto max-h-48 object-contain"
                />
              </div>
              <div className="text-sm text-gray-600 dark:text-white/60">
                <p>
                  <span className="font-medium">Asignada:</span>{' '}
                  {new Date(user.signature.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p>
                  <span className="font-medium">Última actualización:</span>{' '}
                  {new Date(user.signature.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-gray-400 dark:text-white/40" />
              </div>
              <p className="text-gray-600 dark:text-white/60">
                No tiene firma asignada
              </p>
              <p className="text-sm text-gray-500 dark:text-white/50 mt-1">
                Sube una imagen para asignar la firma
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
