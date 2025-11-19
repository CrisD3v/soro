/**
 * ContactForm Component Types
 */

import type { Contact, CreateContactDto } from '@/lib/api/contact.types';

export interface ContactFormProps {
  onSubmit: (data: CreateContactDto) => void;
  isSubmitting?: boolean;
  initialData?: Partial<Contact>;
  onCancel?: () => void;
}
