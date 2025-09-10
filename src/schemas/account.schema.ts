import { ObjectId } from 'mongodb'
import { z } from 'zod'

export const userRoleEnum = z.enum(['admin', 'teacher', 'student', 'staff', 'guardian'])

export const userSchema = z.object({
  username: z.string().min(8).max(20).trim(),
  password: z.string().min(8).trim(),
  role: userRoleEnum,
  isActive: z.boolean().prefault(false),
  verification: z
    .object({
      code: z.string().optional(),
      exp: z.date().optional()
    })
    .optional(),
  reset: z
    .object({
      token: z.string().optional(),
      exp: z.date().optional()
    })
    .optional(),
  lastLogin: z.date().nullable().prefault(null),
  createdAt: z.date(),
  updatedAt: z.date().nullable().prefault(null),
  _isDeleted: z.boolean().prefault(false)
})

export type UserType = z.TypeOf<typeof userSchema> & {
  _id: ObjectId
  userId: ObjectId
}
