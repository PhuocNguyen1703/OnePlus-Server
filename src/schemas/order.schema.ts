import z from 'zod'
import { BaseMongoSchema, I18nStringSchema, ObjectIdSchema } from './common.schema'

const OrderItemSchema = z
  .object({
    menu_item_id: ObjectIdSchema,
    sku: z.string(),

    // Snapshot Name (Quan trọng: Client không gửi cái này, BE tự điền,
    // nhưng nếu dùng Zod để validate data trả về từ DB thì cần)
    name: I18nStringSchema,

    base_price: z.number().min(0),
    quantity: z.number().int().positive('Quantity must be greater than 0'),
    note: z.string().optional(),

    selected_modifiers: z
      .array(
        z.object({
          group_name: I18nStringSchema,
          option_name: I18nStringSchema,
          price_adjustment: z.number(),
        }),
      )
      .optional(),

    final_price: z.number().min(0), // (base + modifiers) * quantity
  })
  .strict()

// 5.2 Schema Order Chính
export const OrderSchema = BaseMongoSchema.extend({
  order_code: z.string().optional(), // BE tự sinh
  table_id: ObjectIdSchema,
  staff_id: ObjectIdSchema.optional(),

  status: z.enum(['pending', 'processing', 'completed', 'cancelled']).default('pending'),

  customer_language: z.enum(['vi', 'en', 'ja']).default('vi'),

  items: z.array(OrderItemSchema).min(1, 'Order must have at least 1 item.'),

  // fields calculator
  total_amount: z.number().min(0),
  tax_amount: z.number().min(0).default(0),
  discount_amount: z.number().min(0).default(0),
  final_amount: z.number().min(0),
}).strict()

export type Order = z.infer<typeof OrderSchema>
