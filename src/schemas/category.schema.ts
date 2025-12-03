import z from 'zod'
import { BaseMongoSchema, I18nStringSchema } from './common.schema'

export const CategorySchema = BaseMongoSchema.extend({
  sku: z.string().min(1),
  name: I18nStringSchema,
  description: I18nStringSchema.optional(),
  slug: z.string().min(1),
  sort_order: z.number().positive().default(0),
  status: z.enum(['active', 'hidden']).default('active'),

  available_hours: z
    .array(
      z.object({
        start: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:mm'),
        end: z.string().regex(/^\d{2}:\d{2}$/, 'Format HH:mm'),
      }),
    )
    .optional(),
}).strict()

export type CategoryType = z.infer<typeof CategorySchema>
