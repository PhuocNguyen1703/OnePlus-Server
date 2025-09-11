import { ObjectId } from 'mongodb'
import { z } from 'zod'

export const userRoleEnum = z.enum(['admin', 'staff', 'manager'])
export const genderEnum = z.enum(['male', 'female', 'other'])

export const accountSchema = z.object({
  username: z.string().min(8).max(20).trim(),
  password: z.string().trim(),
  fullName: z.string().min(1).max(100).trim().nullable().prefault(null),
  coverUrl: z.url().optional(),
  dob: z.date().optional(),
  gender: genderEnum.optional(),
  address: z.string().max(200).optional(),
  phone: z.string().min(10).max(15).optional(),
  email: z.email().trim().optional(),
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

export type AccountType = z.TypeOf<typeof accountSchema> & {
  _id: ObjectId
}
