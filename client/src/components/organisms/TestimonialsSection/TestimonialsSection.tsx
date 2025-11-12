/**
 * TestimonialsSection component - Organism
 * Sección de testimonios de clientes
 */

'use client';

import { Star } from 'lucide-react';
import { motion } from 'motion/react';
import type { TestimonialsSectionProps } from './TestimonialsSection.types';

const testimonials = [
  {
    name: 'María González',
    role: 'Gerente de Operaciones',
    company: 'Textiles del Norte',
    image: '👩‍💼',
    rating: 5,
    text: 'SORO transformó completamente nuestra gestión de inventario textil. Redujimos pérdidas en un 40% y optimizamos nuestros tiempos de producción significativamente.',
  },
  {
    name: 'Carlos Ramírez',
    role: 'Director de Logística',
    company: 'Construcciones Modernas',
    image: '👨‍💼',
    rating: 5,
    text: 'La capacidad de controlar múltiples almacenes desde una sola plataforma ha sido un cambio radical. Las notificaciones inteligentes nos han ahorrado miles de dólares.',
  },
  {
    name: 'Ana Martínez',
    role: 'CEO',
    company: 'AgroTech Solutions',
    image: '👩‍🌾',
    rating: 5,
    text: 'Como empresa agrícola, necesitábamos un sistema adaptable. SORO se ajustó perfectamente a nuestras necesidades y el soporte ha sido excepcional.',
  },
];

export const TestimonialsSection = ({
  className = '',
}: TestimonialsSectionProps) => {
  return (
    <section
      id="testimonials"
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
            Testimonios
          </motion.span>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Lo que dicen nuestros{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-700">
              clientes
            </span>
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300">
            Empresas de diversos sectores confían en SORO para optimizar su
            gestión
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.03, delay: index * 0.01 }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: {
                  duration: 0.1,
                  ease: ["easeInOut", "easeOut"],
                }
              }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-all duration-200"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-2xl">
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
