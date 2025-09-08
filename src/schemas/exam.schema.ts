import z from 'zod'
import { objectIdSchema } from './account.schema'

export const examTypeEnum = z.enum(['placement', 'mid_term', 'final', 'quiz', 'other'])
export const examStatusEnum = z.enum(['scheduled', 'ongoing', 'completed', 'cancelled'])

export const ExamSchema = z.object({
  examName: z.string().min(1).max(100).trim(),
  courseId: objectIdSchema,
  classId: objectIdSchema,
  examDate: z.iso.datetime(),
  duration: z.int().positive(), // Đơn vị: phút
  questions: z.array(objectIdSchema).optional(),
  examType: examTypeEnum,
  status: examStatusEnum.prefault('scheduled'),
  createdAt: z.iso.datetime().prefault(new Date().toISOString()),
  updatedAt: z.iso.datetime().optional()
})

export const examResultSchema = z.object({
  examId: objectIdSchema,
  studentId: objectIdSchema,
  score: z.number().min(0).max(100),
  grade: z.string().max(10).optional(), // Ví dụ: 'A', 'B+', 'Pass'
  submissionDate: z.iso.datetime().prefault(new Date().toISOString()),
  answers: z.record(z.string(), z.any()).optional(), // Lưu trữ câu trả lời của học viên (key: questionId, value: answer)
  createdAt: z.iso.datetime().prefault(new Date().toISOString()),
  updatedAt: z.iso.datetime().optional()
})
