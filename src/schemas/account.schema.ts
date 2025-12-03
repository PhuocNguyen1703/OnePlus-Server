import { ObjectId } from 'mongodb'
import { z } from 'zod'

export const userRoleEnum = z.enum(['admin', 'staff', 'manager'])
export const genderEnum = z.enum(['male', 'female', 'other'])

export const AccountSchema = z.object({
  username: z.string().min(8).max(20).trim(),
  password: z.string().trim(),
  fullName: z.string().min(1).max(100).trim().nullable().default(null),
  coverUrl: z.url().optional(),
  dob: z.date().optional(),
  gender: genderEnum.optional(),
  address: z.string().max(200).optional(),
  phone: z.string().min(10).max(15).optional(),
  email: z.email().trim().optional(),
  role: userRoleEnum,
  isActive: z.boolean().default(false),
  verification: z
    .object({
      code: z.string().optional(),
      exp: z.date().optional(),
    })
    .optional(),
  reset: z
    .object({
      token: z.string().optional(),
      exp: z.date().optional(),
    })
    .optional(),
  lastLogin: z.date().nullable().default(null),
  createdAt: z.date(),
  updatedAt: z.date().nullable().default(null),
  _isDeleted: z.boolean().default(false),
})

export type AccountType = z.TypeOf<typeof AccountSchema> & {
  _id: ObjectId
}
