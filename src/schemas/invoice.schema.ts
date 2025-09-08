import z from 'zod'
import { objectIdSchema } from './account.schema'

export const invoiceStatusEnum = z.enum(['paid', 'pending', 'cancelled'])

export const invoiceItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.int().positive(),
  unitPrice: z.number().min(0),
  total: z.number().min(0),
  isVATApplicable: z.boolean().prefault(false)
})

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1).max(50).trim(),
  dateIssued: z.iso.datetime().prefault(new Date().toISOString()),
  totalAmount: z.number().min(0),
  VATAmount: z.number().min(0).prefault(0),
  netAmount: z.number().min(0),
  status: invoiceStatusEnum.prefault('pending'),
  studentId: objectIdSchema.optional(),
  items: z.array(invoiceItemSchema).min(1),
  createdAt: z.iso.datetime().prefault(new Date().toISOString()),
  updatedAt: z.iso.datetime().optional()
})
