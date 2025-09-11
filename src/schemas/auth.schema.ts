import { z } from 'zod'
import { userRoleEnum } from '~/schemas/account.schema'

export const registerSchema = z.strictObject({
  username: z.string().min(8).trim(),
  password: z.string().min(8).max(20).trim(),
  email: z.email().trim().optional(),
  role: userRoleEnum
})

export const OTPSchema = z.strictObject({
  code: z.string().min(6).max(6).trim()
})

export const loginSchema = z.strictObject({
  username: z.string().min(8).trim(),
  password: z.string().min(8).max(20).trim()
})

export const forgotPasswordSchema = z.strictObject({
  username: z.string().min(8).trim()
})

export const resetPasswordSchema = z.strictObject({
  password: z.string().min(8).max(20).trim()
})

export type RegisterType = z.infer<typeof registerSchema>
export type LoginType = z.infer<typeof loginSchema>
export type OTPType = z.infer<typeof OTPSchema>
export type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordType = z.infer<typeof resetPasswordSchema>
