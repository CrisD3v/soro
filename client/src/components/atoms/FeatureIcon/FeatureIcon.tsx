/**
 * FeatureIcon component - Atom
 * Icono para características con animación
 */

'use client';

import { motion } from 'motion/react';
import type { FeatureIconProps } from './FeatureIcon.types';

export const FeatureIcon = ({ icon: Icon, className = '' }: FeatureIconProps) => {
  return (
    <motion.div
      className={`w-12 h-12 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center ${className}`}
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Icon className="w-6 h-6 text-purple-500" />
    </motion.div>
  );
};
