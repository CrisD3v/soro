/**
 * DealForm Component Types
 */

import type { CreateDealDto, Deal } from '@/lib/api/deal.types';

export interface DealFormProps {
  onSubmit: (data: CreateDealDto) => void;
  isSubmitting?: boolean;
  initialData?: Partial<Deal>;
  onCancel?: () => void;
}
