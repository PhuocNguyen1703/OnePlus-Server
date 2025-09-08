import z from 'zod'
import { objectIdSchema } from './account.schema'

export const transactionTypeEnum = z.enum(['income', 'expense'])
export const paymentMethodEnum = z.enum(['cash', 'bank_transfer', 'card', 'e-wallet', 'installment'])
export const transactionCategoryEnum = z.enum([
  'tuition',
  'salary',
  'rent',
  'marketing',
  'material_sale',
  'other_income',
  'other_expense'
])

export const transactionSchema = z.object({
  userId: objectIdSchema,
  type: transactionTypeEnum,
  amount: z.number().min(0),
  date: z.iso.datetime().prefault(new Date().toISOString()),
  description: z.string().max(500).optional(),
  category: transactionCategoryEnum,
  paymentMethod: paymentMethodEnum.optional(),
  invoiceId: objectIdSchema,
  isVATApplicable: z.boolean().prefault(false),
  VATRate: z.number().min(0).max(100).prefault(0),
  VATAmount: z.number().min(0).prefault(0),
  createdAt: z.iso.datetime().prefault(new Date().toISOString()),
  updatedAt: z.iso.datetime().optional()
})
