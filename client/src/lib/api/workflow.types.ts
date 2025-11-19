/**
 * Workflow Types
 * Tipos para el módulo de automatización de workflows
 */

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  triggerType: WorkflowTriggerType;
  config: Record<string, any>;
  isActive: boolean;
  companyId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export enum WorkflowTriggerType {
  MANUAL = 'MANUAL',
  SCHEDULED = 'SCHEDULED',
  EVENT_BASED = 'EVENT_BASED',
}

export interface CreateWorkflowDto {
  name: string;
  description?: string;
  triggerType: WorkflowTriggerType;
  config: Record<string, any>;
  isActive?: boolean;
  companyId: string;
}

export interface UpdateWorkflowDto {
  name?: string;
  description?: string;
  triggerType?: WorkflowTriggerType;
  config?: Record<string, any>;
  isActive?: boolean;
}

export interface WorkflowFilters {
  companyId?: string;
  triggerType?: WorkflowTriggerType;
  isActive?: boolean;
  search?: string;
}

// Labels en español para tipos de trigger
export const WORKFLOW_TRIGGER_LABELS: Record<WorkflowTriggerType, string> = {
  [WorkflowTriggerType.MANUAL]: 'Manual',
  [WorkflowTriggerType.SCHEDULED]: 'Programado',
  [WorkflowTriggerType.EVENT_BASED]: 'Basado en Eventos',
};

// Colores para tipos de trigger
export const WORKFLOW_TRIGGER_COLORS: Record<WorkflowTriggerType, string> = {
  [WorkflowTriggerType.MANUAL]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  [WorkflowTriggerType.SCHEDULED]: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  [WorkflowTriggerType.EVENT_BASED]: 'bg-green-500/10 text-green-400 border-green-500/20',
};

// Ejemplos de configuración por tipo de trigger
export const WORKFLOW_CONFIG_EXAMPLES: Record<WorkflowTriggerType, Record<string, any>> = {
  [WorkflowTriggerType.MANUAL]: {
    description: 'Se ejecuta manualmente por el usuario',
  },
  [WorkflowTriggerType.SCHEDULED]: {
    schedule: '0 9 * * 1', // Cron expression: Lunes a las 9 AM
    timezone: 'America/Mexico_City',
  },
  [WorkflowTriggerType.EVENT_BASED]: {
    eventType: 'USER_CREATED',
    conditions: {
      role: 'employee',
    },
    actions: [
      {
        type: 'SEND_EMAIL',
        template: 'welcome_email',
      },
      {
        type: 'CREATE_NOTIFICATION',
        message: 'Nuevo usuario registrado',
      },
    ],
  },
};
