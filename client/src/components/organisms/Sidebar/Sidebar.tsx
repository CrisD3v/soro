'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../../atoms/Logo/Logo';
import { SidebarProps } from './Sidebar.types';

export const Sidebar = ({
  groups,
  isCollapsed = false,
  onToggle,
  className = '',
}: SidebarProps) => {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        width: isCollapsed ? '80px' : '280px'
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 ${className}`}
    >
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
        <Logo size="sm" showText={!isCollapsed} />
        {onToggle && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </motion.button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-88px)]">
        {groups.map((group, groupIndex) => (
          <div key={group.id}>
            {!isCollapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3"
              >
                {group.label}
              </motion.p>
            )}
            <ul className="space-y-1">
              {group.items.map((item, itemIndex) => {
                const isActive = pathname === item.href;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (groupIndex * 0.1) + (itemIndex * 0.05) }}
                  >
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ x: 4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer ${isActive
                            ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                      >
                        <span className={`${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                          {item.icon}
                        </span>
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 font-medium">{item.label}</span>
                            {item.badge && item.badge > 0 && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full"
                              >
                                {item.badge > 99 ? '99+' : item.badge}
                              </motion.span>
                            )}
                          </>
                        )}
                      </motion.div>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </motion.aside>
  );
};
