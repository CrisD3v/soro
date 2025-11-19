'use client';

/**
 * Notifications Page
 * Centro de notificaciones del sistema
 */

import { Button } from '@/components/ui/button';
import type { NotificationType } from '@/lib/api/notification.types';
import {
  useDeleteNotification,
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
} from '@/lib/queries/notification.queries';
import { AlertCircle, CheckCircle, Info, Trash2, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const typeIcons: Record<NotificationType, React.ReactNode> = {
  INFO: <Info className="w-5 h-5 text-blue-400" />,
  SUCCESS: <CheckCircle className="w-5 h-5 text-green-400" />,
  WARNING: <AlertCircle className="w-5 h-5 text-yellow-400" />,
  ERROR: <XCircle className="w-5 h-5 text-red-400" />,
};

const typeColors: Record<NotificationType, string> = {
  INFO: 'border-blue-500/20 bg-blue-500/5',
  SUCCESS: 'border-green-500/20 bg-green-500/5',
  WARNING: 'border-yellow-500/20 bg-yellow-500/5',
  ERROR: 'border-red-500/20 bg-red-500/5',
};

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const deleteMutation = useDeleteNotification();

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Notificación marcada como leída');
      },
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success('Todas las notificaciones marcadas como leídas');
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Notificación eliminada');
      },
    });
  };

  // Stats
  const totalNotifications = notifications?.length || 0;
  const unreadNotifications = notifications?.filter((n) => !n.isRead).length || 0;
  const infoNotifications = notifications?.filter((n) => n.type === 'INFO').length || 0;
  const errorNotifications = notifications?.filter((n) => n.type === 'ERROR').length || 0;

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold">Notificaciones</h1>
          <p className="text-gray-400 mt-1">Centro de notificaciones del sistema</p>
        </div>
        {unreadNotifications > 0 && (
          <Button onClick={handleMarkAllAsRead} disabled={markAllAsReadMutation.isPending}>
            Marcar todas como leídas
          </Button>
        )}
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Total</p>
          <p className="text-3xl font-bold mt-2">{totalNotifications}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">No Leídas</p>
          <p className="text-3xl font-bold mt-2 text-purple-400">{unreadNotifications}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Información</p>
          <p className="text-3xl font-bold mt-2">{infoNotifications}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.25 }}
          className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
        >
          <p className="text-gray-400 text-sm">Errores</p>
          <p className="text-3xl font-bold mt-2 text-red-400">{errorNotifications}</p>
        </motion.div>
      </div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="space-y-3"
      >
        {notifications && notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`p-4 rounded-lg border ${typeColors[notification.type]} ${!notification.isRead ? 'border-l-4 border-l-purple-500' : ''
                }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">{typeIcons[notification.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{notification.title}</h3>
                      <p className="text-gray-300 mt-1">{notification.message}</p>
                      <p className="text-gray-500 text-sm mt-2">
                        {new Date(notification.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={markAsReadMutation.isPending}
                        >
                          Marcar leída
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(notification.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
            <p className="text-gray-400">No hay notificaciones</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
