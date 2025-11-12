export interface InventorySummaryCardProps {
  totalMaterials: number;
  lowStockCount: number;
  stockLevel: number; // 0-100
  delay?: number;
  className?: string;
}
