/**
 * WorkflowForm Types
 */

import type { CreateWorkflowDto, Workflow } from '@/lib/api/workflow.types';

export interface WorkflowFormProps {
  workflow?: Workflow;
  onSubmit: (data: CreateWorkflowDto) => void;
  isLoading?: boolean;
}
