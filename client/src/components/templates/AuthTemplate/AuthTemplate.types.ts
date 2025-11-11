/**
 * Types para el componente AuthTemplate
 */

export type AuthView = 'login' | 'register' | 'reset';

export interface AuthTemplateProps {
  initialView?: AuthView;
  onAuthSuccess?: () => void;
}
