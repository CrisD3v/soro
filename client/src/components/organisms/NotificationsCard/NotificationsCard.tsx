'use client';

import { motion } from 'motion/react';
import { AlertTriangle, Bell, CheckCircle, Clock, Info } from 'lucide-react';
import { NotificationsCardProps } from './NotificationsCard.types';

export const NotificationsCard = ({
  notifications,
  delay = 0,
  className = '',
}: NotificationsCardProps) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'from-red-500 to-red-600';
      case 'info':
        return 'from-cyan-500 to-cyan-600';
      case 'success':
        return 'from-green-500 to-green-600';
      default:
        return 'from-purple-500 to-purple-600';
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'info':
        return 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className={`relative p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden ${className}`}
    >
      {/* Gradient Background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            Notificaciones Automáticas
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Alertas y actualizaciones del sistema
          </p>
        </div>
        <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
          <Bell className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3 p-4 max-h-80 overflow-y-auto scrollbar-thin">
        {notifications.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No hay notificaciones pendientes
          </p>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.11, delay: delay + (index * 0.05) }}
              // whileHover={{ x: 2 }}
              className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 ${getNotificationBg(notification.type)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${getNotificationColor(notification.type)} flex-shrink-0`}>
                  <span className="text-white">
                    {getNotificationIcon(notification.type)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{notification.time}</span>
                  </div>
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-2" />
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* View All Button */}
      {notifications.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-center text-sm font-medium text-purple-500 hover:text-purple-600 transition-colors">
            Ver todas las notificaciones →
          </button>
        </div>
      )}
    </motion.div>
  );
};
