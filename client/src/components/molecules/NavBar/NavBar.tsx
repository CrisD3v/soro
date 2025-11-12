/**
 * NavBar component - Molecule
 * Barra de navegación principal con scroll effect
 */

'use client';

import { Logo } from '@/components/atoms/Logo/Logo';
import { NavLink } from '@/components/atoms/NavLink/NavLink';
import { ThemeToggle } from '@/components/atoms/ThemeToggle/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useScrollPosition } from '@/hooks/useScrollPosition/useScrollPosition';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import type { NavBarProps } from './NavBar.types';

export const NavBar = ({ className = '' }: NavBarProps) => {
  const router = useRouter();
  const { isScrolled } = useScrollPosition(20);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg'
        : 'bg-transparent'
        } ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <Logo size="sm" />
          </motion.div>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#testimonials">Testimonials</NavLink>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/auth')}
              className="hidden sm:inline-flex cursor-pointer"
            >
              Iniciar Sesión
            </Button>

            <Button
              size="sm"
              onClick={() => {
                const element = document.querySelector('#demo');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-purple-500 hover:bg-purple-600 cursor-pointer"
            >
              Demo
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
