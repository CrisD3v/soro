/**
 * NavLink component - Atom
 * Enlace de navegación con animación
 */

'use client';

import { motion } from 'motion/react';
import type { NavLinkProps } from './NavLink.types';

export const NavLink = ({ href, children, className = '', onClick }: NavLinkProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick?.();

    // Smooth scroll a la sección
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.a
      href={href}
      onClick={handleClick}
      className={`text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-purple-500 dark:hover:text-purple-400 transition-colors cursor-pointer ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
};
