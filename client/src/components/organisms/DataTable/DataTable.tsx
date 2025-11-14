'use client';

/**
 * DataTable Component
 * Componente genérico de tabla usando ag-grid con Theming API moderno
 */

import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo } from 'react';
import type { DataTableProps } from './DataTable.types';

// Registrar módulos de ag-grid
ModuleRegistry.registerModules([AllCommunityModule]);

// Tema personalizado con colores purple del design system
// Soporta dark y light mode
const purpleThemeDark = themeQuartz.withParams({
  // Colores base - Dark Mode
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  foregroundColor: 'rgb(255, 255, 255)',
  borderColor: 'rgba(255, 255, 255, 0.1)',

  // Headers
  headerBackgroundColor: 'rgba(255, 255, 255, 0.05)',
  headerTextColor: 'rgb(255, 255, 255)',
  headerFontWeight: 600,

  // Rows
  oddRowBackgroundColor: 'rgba(255, 255, 255, 0.02)',
  rowHoverColor: 'rgba(168, 85, 247, 0.1)', // purple-500/10

  // Selección
  selectedRowBackgroundColor: 'rgba(168, 85, 247, 0.2)', // purple-500/20
  rangeSelectionBorderColor: 'rgb(168, 85, 247)', // purple-500

  // Bordes
  rowBorder: true,
  borderRadius: 8,

  // Colores de acento (purple-500)
  accentColor: 'rgb(168, 85, 247)',

  // Inputs y filtros - Más visibles
  inputBackgroundColor: 'rgba(255, 255, 255, 0.1)',
  inputBorder: true,
  inputFocusBorder: true,

  // Espaciado
  spacing: 8,
  cellHorizontalPadding: 16,

  // Fuentes
  fontSize: 14,
  fontFamily: 'var(--font-geist-sans)',

  // Iconos
  iconSize: 16,
});

const purpleThemeLight = themeQuartz.withParams({
  // Colores base - Light Mode
  backgroundColor: 'rgb(255, 255, 255)',
  foregroundColor: 'rgb(24, 24, 27)', // zinc-900
  borderColor: 'rgb(228, 228, 231)', // zinc-200

  // Headers
  headerBackgroundColor: 'rgb(250, 250, 250)', // zinc-50
  headerTextColor: 'rgb(24, 24, 27)', // zinc-900
  headerFontWeight: 600,

  // Rows
  oddRowBackgroundColor: 'rgb(250, 250, 250)', // zinc-50
  rowHoverColor: 'rgba(168, 85, 247, 0.1)', // purple-500/10

  // Selección
  selectedRowBackgroundColor: 'rgba(168, 85, 247, 0.15)', // purple-500/15
  rangeSelectionBorderColor: 'rgb(168, 85, 247)', // purple-500

  // Bordes
  rowBorder: true,
  borderRadius: 8,

  // Colores de acento (purple-500)
  accentColor: 'rgb(168, 85, 247)',

  // Inputs y filtros - Sólidos en light mode
  inputBackgroundColor: 'rgb(255, 255, 255)',
  inputBorder: true,
  inputFocusBorder: true,

  // Espaciado
  spacing: 8,
  cellHorizontalPadding: 16,

  // Fuentes
  fontSize: 14,
  fontFamily: 'var(--font-geist-sans)',

  // Iconos
  iconSize: 16,
});

export const DataTable = <T extends Record<string, any>>({
  data,
  columnDefs,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  height = 600,
  gridOptions,
  onRowClick,
  onRowContextMenu,
  rowSelection,
  onSelectionChanged,
  pagination = true,
  pageSize = 20,
  enableFilters = true,
  enableSorting = true,
  darkMode = true,
}: DataTableProps<T>) => {
  // Seleccionar tema según modo
  const theme = darkMode ? purpleThemeDark : purpleThemeLight;
  // Configuración por defecto de columnas
  const defaultColDef = useMemo(
    () => ({
      sortable: enableSorting,
      filter: enableFilters,
      resizable: true,
      flex: 1,
      minWidth: 100,
    }),
    [enableSorting, enableFilters]
  );

  // Handler para click en fila
  const handleRowClick = useCallback(
    (event: any) => {
      if (onRowClick && event.data) {
        onRowClick(event.data);
      }
    },
    [onRowClick]
  );

  // Handler para cambio de selección
  const handleSelectionChanged = useCallback(
    (event: any) => {
      if (onSelectionChanged) {
        const selectedRows = event.api.getSelectedRows();
        onSelectionChanged(selectedRows);
      }
    },
    [onSelectionChanged]
  );

  // Handler para context menu (click derecho)
  const handleRowContextMenu = useCallback(
    (event: any) => {
      if (onRowContextMenu && event.data) {
        event.event?.preventDefault();
        onRowContextMenu(event.data);
      }
    },
    [onRowContextMenu]
  );

  return (
    <div className="w-full">
      {loading ? (
        <div
          className="flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
          style={{ height }}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-sm text-white/60">Cargando datos...</p>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div
          className="flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
          style={{ height }}
        >
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-12 h-12 text-white/20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-sm text-white/60">{emptyMessage}</p>
          </div>
        </div>
      ) : (
        <div
          className="rounded-lg overflow-hidden border border-white/10 dark:border-white/10"
          style={{ height }}
        >
          <AgGridReact
            theme={theme}
            rowData={data}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={pagination}
            paginationPageSize={pageSize}
            rowSelection={rowSelection}
            onRowClicked={handleRowClick}
            onCellContextMenu={handleRowContextMenu}
            onSelectionChanged={handleSelectionChanged}
            animateRows={true}
            suppressContextMenu={false}
            {...gridOptions}
          />
        </div>
      )}
    </div>
  );
};
