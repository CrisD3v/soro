/**
 * Types para el componente NavLink
 */

export interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
