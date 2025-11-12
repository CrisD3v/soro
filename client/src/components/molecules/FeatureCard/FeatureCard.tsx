/**
 * FeatureCard component - Molecule
 * Tarjeta de característica con animación
 */

'use client';

import { FeatureIcon } from '@/components/atoms/FeatureIcon/FeatureIcon';
import { motion } from 'motion/react';
import type { FeatureCardProps } from './FeatureCard.types';

export const FeatureCard = ({
  icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative p-6 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:shadow-xl transition-all duration-200"
    >
      <FeatureIcon icon={icon} />

      <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>

      {/* Decorative gradient on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
};
