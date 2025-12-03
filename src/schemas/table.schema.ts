import z from 'zod'
import { BaseMongoSchema, I18nStringSchema, ObjectIdSchema } from './common.schema'

export const TableSchema = BaseMongoSchema.extend({
  name: z.string().min(1),
  section_name: I18nStringSchema, // Khu vực
  capacity: z.number().int().positive(),
  status: z.enum(['free', 'occupied', 'reserved']).default('free'),
  current_order_id: ObjectIdSchema.nullable().optional(),
}).strict()

export type Table = z.infer<typeof TableSchema>
