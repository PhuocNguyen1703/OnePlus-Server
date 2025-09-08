import z from 'zod'
import { objectIdSchema } from './account.schema'

export const questionTypeEnum = z.enum(['multiple_choice', 'essay', 'fill_in_blank'])
export const questionLevelEnum = z.enum(['easy', 'medium', 'hard'])

export const QuestionSchema = z.object({
  questionText: z.string().min(1),
  questionType: questionTypeEnum,
  options: z.array(z.string()).optional(), // Chỉ cho multiple_choice
  correctAnswer: z.union([z.string(), z.array(z.string())]), // Có thể là string (essay) hoặc array (MC)
  level: questionLevelEnum.optional(),
  topic: z.string().max(100).optional(), // e.g., 'Grammar', 'Vocabulary', 'Listening'
  courseId: objectIdSchema,
  createdBy: objectIdSchema,
  createdAt: z.iso.datetime().prefault(new Date().toISOString()),
  updatedAt: z.iso.datetime().optional()
})
