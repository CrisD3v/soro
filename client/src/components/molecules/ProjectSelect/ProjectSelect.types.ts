/**
 * ProjectSelect Component Types
 */

export interface ProjectSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  companyId?: string;
}
