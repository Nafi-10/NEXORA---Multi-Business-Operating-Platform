export interface Warehouse {
  id: string;
  entityId: string;
  code: string;
  name: string;
  location: string;
  capacityUsedPercentage: number;
}

export interface InventoryItem {
  id: string;
  entityId: string;
  sku: string;
  name: string;
  category: string;
  uom: string; // Unit of measure (e.g. "pcs", "kg", "m")
  valuationMethod: 'FIFO' | 'WEIGHTED_AVERAGE';
  costPrice: number; // in cents or currency unit (masked for unauthorized roles!)
  sellingPrice: number;
  reorderPoint: number;
  reorderQuantity: number;
  totalStock: number;
  stockByWarehouse: Record<string, number>; // warehouseId -> qty
}

export interface StockAdjustment {
  id: string;
  entityId: string;
  adjustmentNumber: string;
  itemId: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  type: 'RECEIPT' | 'ISSUE' | 'CYCLE_COUNT_ADJUSTMENT';
  quantity: number;
  reason: string;
  createdBy: string;
  createdAt: string;
  status: 'pending' | 'approved';
}

export interface IntercompanyStockTransfer {
  id: string;
  transferNumber: string;
  fromEntityId: string;
  fromEntityName: string;
  fromWarehouseId: string;
  toEntityId: string;
  toEntityName: string;
  toWarehouseId: string;
  itemId: string;
  itemName: string;
  quantity: number;
  transferPrice: number;
  status: 'in_transit' | 'received' | 'rejected';
  initiatedBy: string;
  initiatedAt: string;
  receivedAt?: string;
}
