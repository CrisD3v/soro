'use client';

/**
 * Settings Page
 * Página principal de configuraciones del sistema
 */

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { DataTable } from '@/components/organisms/DataTable';
import { SettingForm } from '@/components/organisms/SettingForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CreateSettingDto, Setting } from '@/lib/api/setting.types';
import {
  SETTING_CATEGORY_COLORS,
  SETTING_CATEGORY_LABELS,
  SettingCategory,
} from '@/lib/api/setting.types';
import {
  useCreateSetting,
  useDeleteSetting,
  useSettings,
} from '@/lib/queries/setting.queries';
import type { ColDef } from 'ag-grid-community';
import { Filter, Plus, Search, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SettingCategory | 'ALL'>('ALL');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [settingToDelete, setSettingToDelete] = useState<Setting | null>(null);

  // Queries
  const { data: settings, isLoading } = useSettings({
    category: categoryFilter !== 'ALL' ? categoryFilter : undefined,
    search: search || undefined,
  });

  const createMutation = useCreateSetting();
  const deleteMutation = useDeleteSetting();

  // Handlers
  const handleCreate = (data: CreateSettingDto) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
      },
    });
  };

  const handleDelete = () => {
    if (settingToDelete) {
      deleteMutation.mutate(settingToDelete.id, {
        onSuccess: () => {
          setSettingToDelete(null);
        },
      });
    }
  };

  const handleRowClick = (setting: Setting) => {
    router.push(`/dashboard/settings/${setting.id}`);
  };

  // Calcular stats
  const totalSettings = settings?.length || 0;
  const publicSettings = settings?.filter((s) => s.isPublic).length || 0;
  const privateSettings = totalSettings - publicSettings;
  const categoriesCount = new Set(settings?.map((s) => s.category)).size;

  // Columnas de la tabla
  const columnDefs: ColDef<Setting>[] = [
    {
      field: 'key',
      headerName: 'Clave',
      filter: 'agTextColumnFilter',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'value',
      headerName: 'Valor',
      filter: 'agTextColumnFilter',
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: any) => {
        const value = params.value;
        return (
          <span className="truncate" title={value}>
            {value.length > 50 ? `${value.substring(0, 50)}...` : value}
          </span>
        );
      },
    },
    {
      field: 'category',
      headerName: 'Categoría',
      filter: 'agTextColumnFilter',
      width: 150,
      cellRenderer: (params: any) => {
        const category = params.value as SettingCategory;
        return (
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium border ${SETTING_CATEGORY_COLORS[category]}`}
          >
            {SETTING_CATEGORY_LABELS[category]}
          </span>
        );
      },
    },
    {
      field: 'isPublic',
      headerName: 'Visibilidad',
      filter: 'agTextColumnFilter',
      width: 120,
      cellRenderer: (params: any) => {
        const isPublic = params.value;
        return (
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium border ${isPublic
              ? 'bg-green-500/10 text-green-400 border-green-500/20'
              : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
              }`}
          >
            {isPublic ? 'Pública' : 'Privada'}
          </span>
        );
      },
    },
    {
      field: 'description',
      headerName: 'Descripción',
      filter: 'agTextColumnFilter',
      flex: 1,
      minWidth: 200,
      cellRenderer: (params: any) => {
        const description = params.value;
        if (!description) return <span className="text-white/40">Sin descripción</span>;
        return (
          <span className="truncate" title={description}>
            {description.length > 60 ? `${description.substring(0, 60)}...` : description}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-purple-400" />
            Configuraciones
          </h1>
          <p className="text-white/60 mt-1">
            Gestiona las configuraciones del sistema
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Configuración
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total</p>
              <p className="text-2xl font-bold text-white mt-1">{totalSettings}</p>
            </div>
            <Settings className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Públicas</p>
              <p className="text-2xl font-bold text-white mt-1">{publicSettings}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Privadas</p>
              <p className="text-2xl font-bold text-white mt-1">{privateSettings}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-gray-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Categorías</p>
              <p className="text-2xl font-bold text-white mt-1">{categoriesCount}</p>
            </div>
            <Filter className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Buscar configuraciones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as SettingCategory | 'ALL')}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todas las categorías</SelectItem>
            {Object.values(SettingCategory).map((category) => (
              <SelectItem key={category} value={category}>
                {SETTING_CATEGORY_LABELS[category]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <DataTable
          data={settings || []}
          columnDefs={columnDefs}
          loading={isLoading}
          onRowClick={handleRowClick}
        />
      </motion.div>

      {/* Dialog de Crear */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Configuración</DialogTitle>
            <DialogDescription>
              Crea una nueva configuración del sistema
            </DialogDescription>
          </DialogHeader>
          <SettingForm
            onSubmit={handleCreate}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmar Eliminación */}
      <ConfirmDialog
        open={!!settingToDelete}
        onOpenChange={(open) => !open && setSettingToDelete(null)}
        onConfirm={handleDelete}
        title="Eliminar Configuración"
        description={`¿Estás seguro de que deseas eliminar la configuración "${settingToDelete?.key}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
