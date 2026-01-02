import z from 'zod'
import { BaseMongoSchema, I18nStringSchema, ObjectIdSchema } from './common.schema'

const PaymentMethod = z.enum(['cash', 'card', 'qr', 'bank_transfer'])

const PaymentStatus = z.enum(['pending', 'success', 'failed', 'refunded'])

export const PaymentSchema = BaseMongoSchema.extend({
  order_id: ObjectIdSchema,
  method: PaymentMethod,
  amount: z.number().positive(),
  currency: z.string().length(3),
  description: I18nStringSchema.optional(),
  status: PaymentStatus,
  paid_at: z.date().optional(),
}).strict()

export type PaymentType = z.infer<typeof PaymentSchema>
