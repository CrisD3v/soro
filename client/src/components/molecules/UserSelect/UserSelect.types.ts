/**
 * UserSelect Component Types
 */

export interface UserSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  companyId?: string;
}
