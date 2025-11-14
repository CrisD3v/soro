'use client';

/**
 * Companies Page
 * Página de gestión de empresas
 */

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { CompanyForm } from '@/components/organisms/CompanyForm';
import { DataTable } from '@/components/organisms/DataTable';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { Company, CreateCompanyDto } from '@/lib/api/company.types';
import { useCompanies, useCreateCompany, useDeleteCompany } from '@/lib/queries/company.queries';
import type { ColDef } from 'ag-grid-community';
import { Edit, Eye, Trash2, TreePine } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

export default function CompaniesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: companies = [], isLoading, error } = useCompanies();
  const createCompanyMutation = useCreateCompany();
  const deleteCompanyMutation = useDeleteCompany();

  // Estado del dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Empresa seleccionada para context menu
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Estado del dialog de confirmación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<Company | null>(null);

  // Definición de columnas para ag-grid
  const columnDefs = useMemo<ColDef<Company>[]>(
    () => [
      {
        headerName: 'Nombre',
        field: 'name',
        filter: 'agTextColumnFilter',
        minWidth: 200,
      },
      {
        headerName: 'NIT',
        field: 'nit',
        filter: 'agTextColumnFilter',
        width: 150,
      },
      {
        headerName: 'Dirección',
        field: 'address',
        filter: 'agTextColumnFilter',
        minWidth: 200,
      },
      {
        headerName: 'Teléfono',
        field: 'phone',
        filter: 'agTextColumnFilter',
        width: 150,
      },
      {
        headerName: 'Empresa Padre',
        valueGetter: (params) => params.data?.parentId ? 'Sí' : 'No',
        filter: 'agTextColumnFilter',
        width: 130,
      },
      {
        headerName: 'Estado',
        valueGetter: (params) => params.data?.deletedAt ? 'Eliminada' : 'Activa',
        filter: 'agTextColumnFilter',
        width: 100,
        cellStyle: (params) => {
          if (params.data?.deletedAt) {
            return { color: '#ef4444' }; // text-red-500
          }
          return { color: '#22c55e' }; // text-green-500
        },
      },
      {
        headerName: 'Fecha Creación',
        field: 'createdAt',
        filter: 'agDateColumnFilter',
        valueFormatter: (params) => {
          if (!params.value) return '';
          return new Date(params.value).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
        },
        width: 150,
      },
    ],
    []
  );

  // Handler para click en fila
  const handleRowClick = (company: Company) => {
    router.push(`/dashboard/companies/${company.id}`);
  };

  // Handler para context menu (click derecho)
  const handleContextMenu = (company: Company) => {
    setSelectedCompany(company);
  };

  // Handler para crear empresa
  const handleCreateCompany = () => {
    setIsDialogOpen(true);
  };

  // Handler para enviar formulario
  const handleSubmitCompany = async (data: CreateCompanyDto) => {
    try {
      await createCompanyMutation.mutateAsync(data);
      toast({
        title: 'Empresa creada',
        description: `${data.name} ha sido creada exitosamente.`,
      });
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error al crear empresa',
        description: error.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    }
  };

  // Handlers del context menu
  const handleViewCompany = (company: Company) => {
    router.push(`/dashboard/companies/${company.id}`);
  };

  const handleEditCompany = (company: Company) => {
    router.push(`/dashboard/companies/${company.id}/edit`);
  };

  const handleViewHierarchy = (company: Company) => {
    router.push(`/dashboard/companies/${company.id}/hierarchy`);
  };

  const handleDeleteCompany = (company: Company) => {
    setCompanyToDelete(company);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCompany = async () => {
    if (!companyToDelete) return;

    try {
      await deleteCompanyMutation.mutateAsync(companyToDelete.id);
      toast({
        title: 'Empresa eliminada',
        description: `${companyToDelete.name} ha sido eliminada exitosamente.`,
      });
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
    } catch (error: any) {
      toast({
        title: 'Error al eliminar empresa',
        description: error.message || 'Ocurrió un error inesperado',
        variant: 'destructive',
      });
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500">Error al cargar empresas: {(error as Error).message}</p>
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Empresas</h1>
          <p className="text-gray-600 dark:text-white/60 mt-1">
            Gestiona las empresas del sistema
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateCompany}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Crear Empresa
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Total Empresas</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{companies.length}</p>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Activas</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {companies.filter((c) => !c.deletedAt).length}
          </p>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Con Jerarquía</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {companies.filter((c) => c.parentId).length}
          </p>
        </div>
        <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
          <p className="text-gray-600 dark:text-white/60 text-sm">Eliminadas</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {companies.filter((c) => c.deletedAt).length}
          </p>
        </div>
      </motion.div>

      {/* Table con Context Menu */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.2 }}
      >
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <div>
              <DataTable
                data={companies}
                columnDefs={columnDefs}
                loading={isLoading}
                emptyMessage="No hay empresas registradas"
                onRowClick={handleRowClick}
                onRowContextMenu={handleContextMenu}
                pagination={true}
                pageSize={20}
                enableFilters={true}
                enableSorting={true}
                height={600}
                darkMode={true}
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56">
            <ContextMenuItem
              onClick={() => selectedCompany && handleViewCompany(selectedCompany)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              Ver Detalles
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => selectedCompany && handleEditCompany(selectedCompany)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              Editar
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => selectedCompany && handleViewHierarchy(selectedCompany)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <TreePine className="w-4 h-4" />
              Ver Jerarquía
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              onClick={() => selectedCompany && handleDeleteCompany(selectedCompany)}
              className="flex items-center gap-2 text-red-600 dark:text-red-400 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </motion.div>

      {/* Dialog para crear empresa */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nueva Empresa</DialogTitle>
            <DialogDescription>
              Completa el formulario para crear una nueva empresa en el sistema.
            </DialogDescription>
          </DialogHeader>
          <CompanyForm
            onSubmit={handleSubmitCompany}
            isSubmitting={createCompanyMutation.isPending}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Eliminar Empresa"
        description={`¿Estás seguro de que deseas eliminar a ${companyToDelete?.name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDeleteCompany}
        variant="destructive"
        isLoading={deleteCompanyMutation.isPending}
      />
    </div>
  );
}
