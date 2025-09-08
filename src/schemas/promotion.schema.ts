import z from 'zod'

export const discountTypeEnum = z.enum(['percentage', 'fixed_amount'])
export const promotionStatusEnum = z.enum(['active', 'inactive', 'completed'])

export const promotionSchema = z.object({
  promoName: z.string().min(1).max(100).trim(),
  description: z.string().max(500).optional(),
  startDate: z.iso.datetime(),
  endDate: z.iso.datetime(),
  discountType: discountTypeEnum,
  discountValue: z.number().min(0),
  targetObject: z.string().max(200).optional(), // e.g., 'new_students', 'group_enrollment'
  status: promotionStatusEnum.prefault('active'),
  createdAt: z.iso.datetime().prefault(new Date().toISOString()),
  updatedAt: z.iso.datetime().optional()
})
