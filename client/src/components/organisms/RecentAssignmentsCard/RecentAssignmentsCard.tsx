'use client';

import { motion } from 'framer-motion';
import { Calendar, Package, UserCheck } from 'lucide-react';
import { RecentAssignmentsCardProps } from './RecentAssignmentsCard.types';

export const RecentAssignmentsCard = ({
  assignments,
  delay = 0,
  className = '',
}: RecentAssignmentsCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'in-progress':
        return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400';
      case 'pending':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'in-progress':
        return 'En Progreso';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
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
            Asignaciones Recientes
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Últimos movimientos de materiales
          </p>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600">
          <UserCheck className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-3">
        {assignments.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No hay asignaciones recientes
          </p>
        ) : (
          assignments.map((assignment, index) => (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: delay + (index * 0.1) }}
              whileHover={{ x: 4, scale: 1.01 }}
              className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-purple-500" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {assignment.materialName}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Asignado a: <span className="font-medium">{assignment.assignedTo}</span>
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(assignment.status)}`}>
                  {getStatusLabel(assignment.status)}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{assignment.date}</span>
                </div>
                <span>Cantidad: {assignment.quantity}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* View All Button */}
      {assignments.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-center text-sm font-medium text-purple-500 hover:text-purple-600 transition-colors">
            Ver todas las asignaciones →
          </button>
        </div>
      )}
    </motion.div>
  );
};
