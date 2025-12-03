import z from 'zod'
import { BaseMongoSchema, I18nStringSchema, ObjectIdSchema } from './common.schema'

export const MenuItemSchema = BaseMongoSchema.extend({
  sku: z.string().min(1),
  category_id: ObjectIdSchema,

  name: I18nStringSchema,
  description: I18nStringSchema.optional(),

  price: z.number().min(0),
  image_urls: z.array(z.url()).optional(),

  tags: z.array(I18nStringSchema).optional(),

  modifier_groups: z
    .array(
      z.object({
        group_id: ObjectIdSchema,
        display_order: z.number().default(0),

        price_overrides: z
          .array(
            z.object({
              option_id: ObjectIdSchema,
              new_price_adjustment: z.number(),
            }),
          )
          .optional(),
      }),
    )
    .optional(),

  is_out_of_stock: z.boolean().default(false),
  station_id: ObjectIdSchema.optional(),
}).strict()

export type MenuItem = z.infer<typeof MenuItemSchema>
