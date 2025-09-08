import z from 'zod'
import { objectIdSchema } from './account.schema'

export const equipmentTypeEnum = z.enum(['projector', 'computer', 'speaker', 'whiteboard', 'desk', 'chair', 'other'])
export const equipmentStatusEnum = z.enum(['working', 'broken', 'under_repair'])

export const equipmentMaintenanceSchema = z.object({
  date: z.iso.datetime(),
  description: z.string().max(500),
  cost: z.number().min(0).optional(),
  performedBy: z.string().optional()
})

export const EquipmentSchema = z.object({
  itemName: z.string().min(1).max(100).trim(),
  type: equipmentTypeEnum,
  serialNumber: z.string().max(100).optional(),
  purchaseDate: z.iso.datetime().optional(),
  warrantyEndDate: z.iso.datetime().optional(),
  status: equipmentStatusEnum.prefault('working'),
  facilityId: objectIdSchema.optional(),
  maintenanceHistory: z.array(equipmentMaintenanceSchema).optional(),
  createdAt: z.iso.datetime().prefault(new Date().toISOString()),
  updatedAt: z.iso.datetime().optional()
})
