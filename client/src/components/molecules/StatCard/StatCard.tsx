'use client';

import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { StatCardProps } from './StatCard.types';

export const StatCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = 'purple',
  delay = 0,
  className = '',
}: StatCardProps) => {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    cyan: 'from-cyan-500 to-cyan-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
  };

  const isPositive = trend === 'up';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.2, delay, ease: "easeInOut", }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden cursor-pointer ${className}`}
    >
      {/* Gradient Background */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full blur-3xl`} />

      <div className="relative">
        {/* Icon */}
        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} mb-4`}>
          <span className="text-white">{icon}</span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          {title}
        </h3>

        {/* Value */}
        <div className="flex items-end justify-between">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>

          {/* Trend */}
          {trend && trendValue && (
            <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
