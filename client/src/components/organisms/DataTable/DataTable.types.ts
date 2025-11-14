/**
 * DataTable Types
 * Tipos para el componente DataTable con ag-grid
 */

import type { ColDef, GridOptions } from 'ag-grid-community';

export interface DataTableProps<T = any> {
  /**
   * Datos a mostrar en la tabla
   */
  data: T[];

  /**
   * Definición de columnas
   */
  columnDefs: ColDef<T>[];

  /**
   * Indica si los datos están cargando
   */
  loading?: boolean;

  /**
   * Mensaje cuando no hay datos
   */
  emptyMessage?: string;

  /**
   * Altura de la tabla (default: 600px)
   */
  height?: string | number;

  /**
   * Opciones adicionales de ag-grid
   */
  gridOptions?: GridOptions<T>;

  /**
   * Callback cuando se selecciona una fila
   */
  onRowClick?: (data: T) => void;

  /**
   * Habilitar selección de filas
   */
  rowSelection?: 'single' | 'multiple';

  /**
   * Callback cuando cambia la selección
   */
  onSelectionChanged?: (selectedRows: T[]) => void;

  /**
   * Habilitar paginación
   */
  pagination?: boolean;

  /**
   * Tamaño de página (default: 20)
   */
  pageSize?: number;

  /**
   * Habilitar filtros
   */
  enableFilters?: boolean;

  /**
   * Habilitar ordenamiento
   */
  enableSorting?: boolean;

  /**
   * Modo oscuro (default: true)
   */
  darkMode?: boolean;

  /**
   * Callback cuando se hace click derecho en una fila
   */
  onRowContextMenu?: (data: T) => void;
}
