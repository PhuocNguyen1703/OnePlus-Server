import { z } from 'zod'

export const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ObjectId' })

export const I18nStringSchema = z
  .object({
    vi: z.string().min(1, 'Vietnamese is required.'),
    en: z.string().optional(),
    ja: z.string().optional(),
  })
  .strict()

export const BaseMongoSchema = z
  .object({
    _id: ObjectIdSchema.optional(),
    createdAt: z
      .date()
      .default(() => new Date())
      .readonly(),
    updatedAt: z.date().nullable().default(null).optional(),
  })
  .strict()

export type I18nString = z.infer<typeof I18nStringSchema>
