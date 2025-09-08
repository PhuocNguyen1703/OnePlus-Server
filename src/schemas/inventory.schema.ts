import z from 'zod'
import { objectIdSchema } from './account.schema'

export const inventoryItemTypeEnum = z.enum(['textbook', 'stationery', 'other_material'])

export const InventorySchema = z.object({
  itemName: z.string().min(1).max(200).trim(),
  itemType: inventoryItemTypeEnum,
  SKU: z.string().max(50).optional(),
  currentStock: z.int().min(0).prefault(0),
  minStockLevel: z.int().min(0).prefault(10), // Cảnh báo khi dưới mức này
  facilityId: objectIdSchema, // Tham chiếu đến FacilitySchema (kho)
  supplier: z.string().max(100).optional(),
  createdAt: z.iso.datetime().prefault(new Date().toISOString()),
  updatedAt: z.iso.datetime().optional()
})
