'use client';

/**
 * Company Hierarchy Page
 * Página de visualización de jerarquía empresarial
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Company, CompanyHierarchy } from '@/lib/api/company.types';
import { useCompany, useCompanyHierarchy } from '@/lib/queries/company.queries';
import { ArrowLeft, Building, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface CompanyHierarchyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function CompanyHierarchyPage({ params }: CompanyHierarchyPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { data: company, isLoading, error } = useCompany(id);
  const { data: hierarchy, isLoading: isLoadingHierarchy } = useCompanyHierarchy(id) as {
    data: CompanyHierarchy | undefined;
    isLoading: boolean;
  };

  if (isLoading || isLoadingHierarchy) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-600 dark:text-white/60">Cargando jerarquía...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500">Error al cargar empresa: {error?.message || 'Empresa no encontrada'}</p>
        </div>
      </div>
    );
  }

  const renderCompanyCard = (comp: Company, level: number = 0) => (
    <motion.div
      key={comp.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: level * 0.1 }}
      className={`${level > 0 ? 'ml-8' : ''}`}
    >
      <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4 mb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Building className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {comp.name}
                </h3>
                {comp.id === id && (
                  <Badge variant="default">Actual</Badge>
                )}
                {level === 0 && comp.parentId && (
                  <Badge variant="secondary">Empresa Padre</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-white/60 mt-1">
                NIT: {comp.nit}
              </p>
              <p className="text-sm text-gray-600 dark:text-white/60">
                {comp.address}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push(`/dashboard/companies/${comp.id}`)}
          >
            Ver Detalles
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Jerarquía Empresarial
          </h1>
          <p className="text-gray-600 dark:text-white/60 mt-1">
            Estructura organizacional de {company.name}
          </p>
        </div>
      </motion.div>

      {/* Hierarchy Tree */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="space-y-6"
      >
        {/* Empresa Padre */}
        {hierarchy?.parent && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Empresa Padre
            </h2>
            {renderCompanyCard(hierarchy.parent, 0)}
          </div>
        )}

        {/* Empresa Actual */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            {hierarchy?.parent ? 'Empresa Actual' : 'Empresa Principal'}
          </h2>
          {renderCompanyCard(company, hierarchy?.parent ? 1 : 0)}
        </div>

        {/* Empresas Hijas */}
        {hierarchy?.children && hierarchy.children.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Empresas Subsidiarias ({hierarchy.children.length})
            </h2>
            <div className="space-y-2">
              {hierarchy.children.map((child: Company) => renderCompanyCard(child, 2))}
            </div>
          </div>
        )}

        {/* Sin Subsidiarias */}
        {(!hierarchy?.children || hierarchy.children.length === 0) && (
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-8 text-center">
            <Building className="w-12 h-12 text-gray-400 dark:text-white/40 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-white/60">
              Esta empresa no tiene subsidiarias
            </p>
          </div>
        )}

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
            <p className="text-sm text-gray-600 dark:text-white/60">Nivel</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {hierarchy?.parent ? '2' : '1'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {hierarchy?.parent ? 'Subsidiaria' : 'Principal'}
            </p>
          </div>
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
            <p className="text-sm text-gray-600 dark:text-white/60">Subsidiarias</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {hierarchy?.children?.length || 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Empresas hijas
            </p>
          </div>
          <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-white/10 p-4">
            <p className="text-sm text-gray-600 dark:text-white/60">Total en Grupo</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {1 + (hierarchy?.parent ? 1 : 0) + (hierarchy?.children?.length || 0)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Empresas relacionadas
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
