import z from 'zod'
import { objectIdSchema } from './account.schema'

export const facilityTypeEnum = z.enum(['room', 'warehouse', 'office', 'other'])
export const facilityStatusEnum = z.enum(['available', 'occupied', 'under_maintenance'])

export const facilitySchema = z.object({
  facilityName: z.string().min(1).max(100).trim(),
  type: facilityTypeEnum,
  location: z.string().max(200).optional(), // Địa chỉ cụ thể hoặc tên khu vực
  capacity: z.int().min(0).optional(), // Sức chứa (cho phòng học)
  status: facilityStatusEnum.prefault('available'),
  description: z.string().max(500).optional(),
  branchId: objectIdSchema.optional(), // Tham chiếu đến BranchSchema (nếu có quản lý chuỗi trung tâm)
  createdAt: z.iso.datetime().prefault(new Date().toISOString()),
  updatedAt: z.iso.datetime().optional()
})
