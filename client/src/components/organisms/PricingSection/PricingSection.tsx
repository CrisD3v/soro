/**
 * PricingSection component - Organism
 * Sección de planes de precios
 */

'use client';

import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';
import type { PricingSectionProps } from './PricingSection.types';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    period: '/mes',
    description: 'Perfecto para pequeñas empresas',
    features: [
      'Hasta 2 almacenes',
      '10 usuarios',
      'Notificaciones básicas',
      'Reportes estándar',
      'Soporte por email',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    price: '$79',
    period: '/mes',
    description: 'Ideal para empresas en crecimiento',
    features: [
      'Hasta 10 almacenes',
      'Usuarios ilimitados',
      'Notificaciones inteligentes',
      'Reportes avanzados',
      'Soporte prioritario 24/7',
      'API access',
      'Integraciones',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Para grandes corporaciones',
    features: [
      'Almacenes ilimitados',
      'Usuarios ilimitados',
      'IA y predicciones',
      'Reportes personalizados',
      'Soporte dedicado',
      'API ilimitada',
      'Integraciones custom',
      'Onboarding personalizado',
    ],
    popular: false,
  },
];

export const PricingSection = ({ className = '' }: PricingSectionProps) => {
  return (
    <section
      id="pricing"
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
            Planes y Precios
          </motion.span>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Elige el plan{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700">
              perfecto
            </span>{' '}
            para ti
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300">
            Planes flexibles que se adaptan a las necesidades de tu negocio
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.0, delay: index * 0.05, ease: "easeOut" }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: {
                  duration: 0.0,
                  ease: ["easeInOut", "easeOut"],
                }
              }}
              className={`relative p-8 rounded-2xl flex flex-col ${plan.popular
                ? 'bg-gradient-to-b from-purple-500 to-purple-600 text-white shadow-2xl scale-105'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl'
                } transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-cyan-400 text-gray-900 text-sm font-medium rounded-full">
                  Más Popular
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm ${plan.popular ? 'text-purple-100' : 'text-gray-600 dark:text-gray-400'
                    }`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span
                  className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}
                >
                  {plan.price}
                </span>
                <span
                  className={`text-lg ${plan.popular ? 'text-purple-100' : 'text-gray-600 dark:text-gray-400'
                    }`}
                >
                  {plan.period}
                </span>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.popular ? 'text-cyan-300' : 'text-purple-500'
                        }`}
                    />
                    <span
                      className={`text-sm ${plan.popular ? 'text-purple-50' : 'text-gray-600 dark:text-gray-300'
                        }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full cursor-pointer mt-auto ${plan.popular
                  ? 'bg-white text-purple-600 hover:bg-gray-100'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
              >
                Comenzar Ahora
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
