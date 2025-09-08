import z from 'zod'
import { objectIdSchema } from './account.schema'

export const courseSchema = z.object({
  courseName: z.string().min(1).max(100).trim(),
  level: z.string().min(1).max(50).optional(),
  description: z.string().max(500).optional(),
  duration: z
    .object({
      value: z.int().positive(),
      unit: z.enum(['hours', 'weeks', 'months'])
    })
    .optional(),
  price: z.number().min(0),
  syllabus: z.url().optional(),
  materials: z.array(objectIdSchema).optional(),
  createdAt: z.iso.datetime().prefault(new Date().toISOString()),
  updatedAt: z.iso.datetime().optional()
})
