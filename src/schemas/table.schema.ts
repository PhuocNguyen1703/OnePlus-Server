import z from 'zod'
import { BaseMongoSchema, I18nStringSchema, ObjectIdSchema } from './common.schema'

const TableStatusEnum = z.enum(['available', 'occupied', 'reserved', 'cleaning'])

export const TableSchema = BaseMongoSchema.extend({
  name: z.string().min(1),
  section_name: I18nStringSchema, // area or section of the restaurant
  capacity: z.number().int().positive(),
  status: TableStatusEnum.default('available'),
  current_order_id: ObjectIdSchema.nullable().default(null).optional(),
}).strict()

export type TableType = z.infer<typeof TableSchema>
