'use client';

import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '../../atoms/Logo/Logo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { SidebarProps } from './Sidebar.types';

export const Sidebar = ({
  groups,
  isCollapsed = false,
  onToggle,
  className = '',
}: SidebarProps) => {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={100}>
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? '80px' : '280px'
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 ${className}`}
      >
        {/* Header with Logo */}
        <div className={`flex items-center p-6 border-b border-gray-200 dark:border-gray-800 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && <div className='flex justify-center items-center w-full'><Logo size="sm" /></div>}
          {onToggle && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
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
        <nav className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-88px)] scrollbar-thin">
          {groups.map((group) => (
            <div key={group.id}>
              {!isCollapsed && (
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
                  {group.label}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const navItem = (
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 cursor-pointer ${isActive
                          ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                      >
                        <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                          {item.icon}
                        </span>
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 font-medium">{item.label}</span>
                            {item.badge && item.badge > 0 && (
                              <span className="px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                                {item.badge > 99 ? '99+' : item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </motion.div>
                    </Link>
                  );

                  return (
                    <li key={item.id}>
                      {isCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            {navItem}
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>{item.label}</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        navItem
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </motion.aside>
    </TooltipProvider>
  );
};
