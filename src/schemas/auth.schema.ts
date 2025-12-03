import { z } from 'zod'
import { userRoleEnum } from '~/schemas/account.schema'

export const RegisterSchema = z.strictObject({
  username: z.string().min(8).trim(),
  password: z.string().min(8).max(20).trim(),
  email: z.email().trim().optional(),
  role: userRoleEnum,
})

export const OTPSchema = z.strictObject({
  code: z.string().min(6).max(6).trim(),
})

export const LoginSchema = z.strictObject({
  username: z.string().min(8).trim(),
  password: z.string().min(8).max(20).trim(),
})

export const ForgotPasswordSchema = z.strictObject({
  username: z.string().min(8).trim(),
})

export const ResetPasswordSchema = z.strictObject({
  password: z.string().min(8).max(20).trim(),
})

export type RegisterType = z.infer<typeof RegisterSchema>
export type LoginType = z.infer<typeof LoginSchema>
export type OTPType = z.infer<typeof OTPSchema>
export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>
export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>
