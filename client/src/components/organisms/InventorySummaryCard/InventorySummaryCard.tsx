'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Package, TrendingUp } from 'lucide-react';
import { InventorySummaryCardProps } from './InventorySummaryCard.types';

export const InventorySummaryCard = ({
  totalMaterials,
  lowStockCount,
  stockLevel,
  delay = 0,
  className = '',
}: InventorySummaryCardProps) => {
  const getStockColor = () => {
    if (stockLevel >= 70) return 'from-green-500 to-green-600';
    if (stockLevel >= 40) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getStockStatus = () => {
    if (stockLevel >= 70) return 'Óptimo';
    if (stockLevel >= 40) return 'Moderado';
    return 'Crítico';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -4 }}
      className={`p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Resumen de Inventario
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Estado actual del stock
          </p>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
          <Package className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Materiales</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalMaterials}</p>
        </div>
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20">
          <p className="text-sm text-red-600 dark:text-red-400 mb-1 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" />
            Stock Bajo
          </p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{lowStockCount}</p>
        </div>
      </div>

      {/* Stock Level Progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Nivel de Stock
          </span>
          <span className={`text-sm font-semibold ${stockLevel >= 70 ? 'text-green-600 dark:text-green-400' :
              stockLevel >= 40 ? 'text-orange-600 dark:text-orange-400' :
                'text-red-600 dark:text-red-400'
            }`}>
            {stockLevel}% - {getStockStatus()}
          </span>
        </div>
        <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${stockLevel}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: delay + 0.3, ease: 'easeOut' }}
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getStockColor()} rounded-full shadow-lg`}
            style={{
              boxShadow: stockLevel < 40 ? '0 0 20px rgba(239, 68, 68, 0.5)' :
                stockLevel < 70 ? '0 0 20px rgba(249, 115, 22, 0.5)' :
                  '0 0 20px rgba(34, 197, 94, 0.5)'
            }}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors">
          <TrendingUp className="w-4 h-4" />
          Ver Detalles
        </button>
      </div>
    </motion.div>
  );
};
