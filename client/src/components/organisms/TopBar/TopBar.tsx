'use client';

import { useTheme } from '@/hooks/useTheme/useTheme';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, ChevronDown, Globe, LogOut, Moon, Settings, Sun, User } from 'lucide-react';
import { useState } from 'react';
import { TopBarProps } from './TopBar.types';

export const TopBar = ({
  companyName,
  userName,
  userAvatar,
  notificationCount = 0,
  breadcrumbs = [],
  onLogout,
  className = '',
}: TopBarProps) => {
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className={`sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 ${className}`}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Company Name */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {companyName}
              <span className="text-purple-500"> - SORO PLATFORM</span>
            </h1>
            {breadcrumbs.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-1">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.id} className="flex items-center gap-2">
                    {index > 0 && <span>/</span>}
                    <span className={index === breadcrumbs.length - 1 ? 'text-purple-500 font-medium' : ''}>
                      {crumb.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full min-w-[20px] text-center">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <p className="p-4 text-sm text-gray-600 dark:text-gray-400 text-center">
                      No hay notificaciones nuevas
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Language Selector */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150">
            <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                {userAvatar ? (
                  <img src={userAvatar} alt={userName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  userName.charAt(0).toUpperCase()
                )}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {userName}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            {/* User Dropdown */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">{userName}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Administrador</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Mi Perfil</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left">
                      <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Configuración</span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span className="text-sm text-red-600 dark:text-red-400 font-medium">Cerrar Sesión</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
