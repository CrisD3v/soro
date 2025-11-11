/**
 * Logo component - Atom
 * Logo de la aplicación con animación
 */

'use client';

import { motion } from 'motion/react';
import type { LogoProps } from './Logo.types';

export const Logo = ({ size = 'md', className = '' }: LogoProps) => {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <motion.div
      className={`font-bold ${sizes[size]} ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <span className="text-purple-500">SO</span>
      <span className="text-purple-400">RO</span>
    </motion.div>
  );
};
