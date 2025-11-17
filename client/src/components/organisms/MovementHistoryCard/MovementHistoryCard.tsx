'use client';

import { motion } from 'motion/react';
import { ArrowDownCircle, ArrowRightLeft, ArrowUpCircle, Filter, History } from 'lucide-react';
import { useState } from 'react';
import { MovementHistoryCardProps } from './MovementHistoryCard.types';

export const MovementHistoryCard = ({
  movements,
  delay = 0,
  className = '',
}: MovementHistoryCardProps) => {
  const [filter, setFilter] = useState<string>('all');

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'entrada':
        return <ArrowDownCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'salida':
        return <ArrowUpCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'transferencia':
        return <ArrowRightLeft className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />;
      default:
        return <History className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const filteredMovements = filter === 'all'
    ? movements
    : movements.filter(m => m.type === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className={`relative p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden ${className}`}
    >
      {/* Gradient Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Historial de Movimientos
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Registro de entradas, salidas y transferencias
          </p>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30">
          <History className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
        {['all', 'entrada', 'salida', 'transferencia'].map((type) => (
          <motion.button
            key={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(type)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${filter === type
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
          >
            {type === 'all' ? 'Todos' : type.charAt(0).toUpperCase() + type.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Movements Table */}
      <div className="overflow-x-auto max-h-96 scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Tipo
              </th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Material
              </th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Cantidad
              </th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Usuario
              </th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Fecha
              </th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMovements.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No hay movimientos para mostrar
                </td>
              </tr>
            ) : (
              filteredMovements.map((movement, index) => (
                <motion.tr
                  key={movement.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.15, delay: delay + (index * 0.03) }}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      {getMovementIcon(movement.type)}
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {movement.type}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-700 dark:text-gray-300">
                    {movement.material}
                  </td>
                  <td className="py-3 px-2 text-sm font-semibold text-gray-900 dark:text-white">
                    {movement.quantity}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-700 dark:text-gray-300">
                    {movement.user}
                  </td>
                  <td className="py-3 px-2 text-sm text-gray-600 dark:text-gray-400">
                    {movement.date}
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(movement.status)}`}>
                      {getStatusLabel(movement.status)}
                    </span>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View All Button */}
      {filteredMovements.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-center text-sm font-medium text-purple-500 hover:text-purple-600 transition-colors">
            Ver historial completo →
          </button>
        </div>
      )}
    </motion.div>
  );
};
