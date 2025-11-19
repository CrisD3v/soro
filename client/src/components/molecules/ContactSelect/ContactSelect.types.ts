/**
 * ContactSelect Component Types
 */

export interface ContactSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  companyId?: string;
}
