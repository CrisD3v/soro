'use client';

/**
 * Workflows Page
 * Página principal de workflows y automatizaciones
 */

import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { DataTable } from '@/components/organisms/DataTable';
import { WorkflowForm } from '@/components/organisms/WorkflowForm';
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
import type { CreateWorkflowDto, Workflow } from '@/lib/api/workflow.types';
import {
  WORKFLOW_TRIGGER_COLORS,
  WORKFLOW_TRIGGER_LABELS,
  WorkflowTriggerType,
} from '@/lib/api/workflow.types';
import {
  useCreateWorkflow,
  useDeleteWorkflow,
  useWorkflows,
} from '@/lib/queries/workflow.queries';
import type { ColDef } from 'ag-grid-community';
import { Filter, Plus, Power, PowerOff, Search, Workflow as WorkflowIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function WorkflowsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [triggerFilter, setTriggerFilter] = useState<WorkflowTriggerType | 'ALL'>('ALL');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<Workflow | null>(null);

  // Queries
  const { data: workflows, isLoading } = useWorkflows({
    triggerType: triggerFilter !== 'ALL' ? triggerFilter : undefined,
    search: search || undefined,
  });

  const createMutation = useCreateWorkflow();
  const deleteMutation = useDeleteWorkflow();

  // Handlers
  const handleCreate = (data: CreateWorkflowDto) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
      },
    });
  };

  const handleDelete = () => {
    if (workflowToDelete) {
      deleteMutation.mutate(workflowToDelete.id, {
        onSuccess: () => {
          setWorkflowToDelete(null);
        },
      });
    }
  };

  const handleRowClick = (workflow: Workflow) => {
    router.push(`/dashboard/workflows/${workflow.id}`);
  };

  // Calcular stats
  const totalWorkflows = workflows?.length || 0;
  const activeWorkflows = workflows?.filter((w) => w.isActive).length || 0;
  const inactiveWorkflows = totalWorkflows - activeWorkflows;
  const manualWorkflows = workflows?.filter((w) => w.triggerType === WorkflowTriggerType.MANUAL).length || 0;

  // Columnas de la tabla
  const columnDefs: ColDef<Workflow>[] = [
    {
      field: 'name',
      headerName: 'Nombre',
      filter: 'agTextColumnFilter',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'triggerType',
      headerName: 'Tipo de Trigger',
      filter: 'agTextColumnFilter',
      width: 180,
      cellRenderer: (params: any) => {
        const triggerType = params.value as WorkflowTriggerType;
        return (
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium border ${WORKFLOW_TRIGGER_COLORS[triggerType]}`}
          >
            {WORKFLOW_TRIGGER_LABELS[triggerType]}
          </span>
        );
      },
    },
    {
      field: 'isActive',
      headerName: 'Estado',
      filter: 'agTextColumnFilter',
      width: 120,
      cellRenderer: (params: any) => {
        const isActive = params.value;
        return (
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium border ${isActive
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
              }`}
          >
            {isActive ? 'Activo' : 'Inactivo'}
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
    {
      field: 'createdAt',
      headerName: 'Fecha de Creación',
      filter: 'agDateColumnFilter',
      width: 180,
      cellRenderer: (params: any) => {
        return new Date(params.value).toLocaleDateString('es-ES');
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <WorkflowIcon className="w-8 h-8 text-purple-400" />
            Workflows
          </h1>
          <p className="text-white/60 mt-1">
            Gestiona las automatizaciones del sistema
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Workflow
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
              <p className="text-2xl font-bold text-white mt-1">{totalWorkflows}</p>
            </div>
            <WorkflowIcon className="w-8 h-8 text-purple-400" />
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
              <p className="text-white/60 text-sm">Activos</p>
              <p className="text-2xl font-bold text-white mt-1">{activeWorkflows}</p>
            </div>
            <Power className="w-8 h-8 text-green-400" />
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
              <p className="text-white/60 text-sm">Inactivos</p>
              <p className="text-2xl font-bold text-white mt-1">{inactiveWorkflows}</p>
            </div>
            <PowerOff className="w-8 h-8 text-gray-400" />
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
              <p className="text-white/60 text-sm">Manuales</p>
              <p className="text-2xl font-bold text-white mt-1">{manualWorkflows}</p>
            </div>
            <Filter className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            placeholder="Buscar workflows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={triggerFilter}
          onValueChange={(value) => setTriggerFilter(value as WorkflowTriggerType | 'ALL')}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todos los tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los tipos</SelectItem>
            {Object.values(WorkflowTriggerType).map((type) => (
              <SelectItem key={type} value={type}>
                {WORKFLOW_TRIGGER_LABELS[type]}
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
          data={workflows || []}
          columnDefs={columnDefs}
          loading={isLoading}
          onRowClick={handleRowClick}
        />
      </motion.div>

      {/* Dialog de Crear */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo Workflow</DialogTitle>
            <DialogDescription>
              Crea un nuevo workflow de automatización
            </DialogDescription>
          </DialogHeader>
          <WorkflowForm
            onSubmit={handleCreate}
            isLoading={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmar Eliminación */}
      <ConfirmDialog
        open={!!workflowToDelete}
        onOpenChange={(open) => !open && setWorkflowToDelete(null)}
        onConfirm={handleDelete}
        title="Eliminar Workflow"
        description={`¿Estás seguro de que deseas eliminar el workflow "${workflowToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
