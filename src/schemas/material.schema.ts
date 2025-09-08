import z from 'zod'
import { objectIdSchema } from './account.schema'

export const materialTypeEnum = z.enum(['textbook', 'audio', 'video', 'document', 'other'])

export const materialSchema = z.object({
  materialName: z.string().min(1).max(200).trim(),
  type: materialTypeEnum,
  url: z.url({
        error: 'Invalid URL format'
  }), // URL đến file lưu trữ (S3, Google Drive, etc.)
  courseId: objectIdSchema.optional(), // Tham chiếu đến CourseSchema
  uploadedBy: objectIdSchema.optional(), // Tham chiếu đến UserSchema
  uploadDate: z.iso.datetime().prefault(new Date().toISOString()),
  createdAt: z.iso.datetime().prefault(new Date().toISOString()),
  updatedAt: z.iso.datetime().optional()
})
