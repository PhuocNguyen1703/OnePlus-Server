import z from 'zod'
import { objectIdSchema } from './account.schema'

export const classStatusEnum = z.enum(['upcoming', 'ongoing', 'completed', 'cancelled'])

export const classSchema = z.object({
  className: z.string().min(1).max(100).trim(),
  courseId: objectIdSchema,
  teacherId: objectIdSchema.optional(),
  students: z.array(objectIdSchema).optional(),
  schedule: z
    .array(
      z.object({
        dayOfWeek: z.int().min(0).max(6), // 0=Sunday, 1=Monday...
        startTime: z.string().regex(/^([1]\d|2[0-3]):([0-5]\d)$/, {
            error: 'Invalid time format (HH:MM)'
        }),
        endTime: z.string().regex(/^([1]\d|2[0-3]):([0-5]\d)$/, {
            error: 'Invalid time format (HH:MM)'
        }),
        roomId: objectIdSchema.optional()
      })
    )
    .optional(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
  status: classStatusEnum.prefault('upcoming'),
  classSize: z.int().min(1).optional(),
  createdAt: z.iso.datetime().prefault(new Date().toISOString()),
  updatedAt: z.iso.datetime().optional()
})
