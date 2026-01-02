import z from 'zod'
import { BaseMongoSchema, I18nStringSchema, ObjectIdSchema } from './common.schema'

const ModifierOptionSchema = z
  .object({
    _id: ObjectIdSchema.optional(),
    name: I18nStringSchema,
    price: z.number().nonnegative().default(0),
    is_default: z.boolean().default(false),
    status: z.enum(['active', 'out_of_stock']).default('active'),
  })
  .strict()

export const ModifierGroupSchema = BaseMongoSchema.extend({
  name: I18nStringSchema,
  selection_type: z.enum(['single', 'multiple']),
  min_selection: z.number().min(0).default(0),
  max_selection: z.number().optional(),

  options: z.array(ModifierOptionSchema),
}).strict()

export type ModifierGroup = z.infer<typeof ModifierGroupSchema>
