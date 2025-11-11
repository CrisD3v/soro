/**
 * FeaturesSection component - Organism
 * Sección de características principales
 */

'use client';

import { FeatureCard } from '@/components/molecules/FeatureCard/FeatureCard';
import {
  BarChart3,
  Bell,
  Building2,
  Layers,
  Users,
  Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { FeaturesSectionProps } from './FeaturesSection.types';

const features = [
  {
    icon: Zap,
    title: 'Gestión Automatizada',
    description:
      'Automatiza el control de inventarios y reduce errores manuales. Sistema inteligente que optimiza tus procesos de gestión.',
  },
  {
    icon: Bell,
    title: 'Notificaciones Inteligentes',
    description:
      'Recibe alertas automáticas cuando los niveles de stock sean bajos para evitar interrupciones en producción o ventas.',
  },
  {
    icon: Building2,
    title: 'Control Multialmacén',
    description:
      'Gestiona múltiples ubicaciones desde una sola plataforma. Control centralizado con visibilidad total de tu inventario.',
  },
  {
    icon: Users,
    title: 'Asignación de Stock',
    description:
      'Control detallado por empleados o áreas específicas, con trazabilidad completa y seguimiento de uso en tiempo real.',
  },
  {
    icon: Layers,
    title: 'Adaptable a Sectores',
    description:
      'Sea textil, agrícola, construcción o cualquier otro sector, SORO se ajusta a tu modelo de negocio específico.',
  },
  {
    icon: BarChart3,
    title: 'Reportes y Analytics',
    description:
      'Mejora la toma de decisiones con datos actualizados y reportes claros. Visualiza tendencias y optimiza recursos.',
  },
];

export const FeaturesSection = ({ className = '' }: FeaturesSectionProps) => {
  return (
    <section
      id="features"
      className={`relative py-20 sm:py-32 overflow-hidden ${className}`}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/30 to-white dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4"
          >
            Características Principales
          </motion.span>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Todo lo que necesitas para{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700">
              optimizar
            </span>{' '}
            tu gestión
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300">
            Incrementa la productividad, minimiza costos y facilita la
            colaboración con nuestro sistema integral de gestión de recursos.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            ¿Quieres ver SORO en acción?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.querySelector('#demo');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            Solicitar una Demo
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
