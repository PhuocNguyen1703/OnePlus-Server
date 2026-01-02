import z from 'zod'
import { BaseMongoSchema, I18nStringSchema, ObjectIdSchema } from './common.schema'

const OrderItemStatus = z.enum(['new', 'cooking', 'done', 'cancelled'])

const OrderStatus = z.enum(['pending', 'confirmed', 'paid', 'completed', 'cancelled', 'merged'])

const DiscountSchema = z
  .object({
    type: z.enum(['percent', 'fixed']),
    value: z.number().nonnegative(),
  })
  .strict()

const OrderItemSchema = z
  .object({
    dish_id: ObjectIdSchema,
    sku: z.string(),

    // Snapshot Name (Quan trọng: Client không gửi cái này, BE tự điền,
    // nhưng nếu dùng Zod để validate data trả về từ DB thì cần)
    name: I18nStringSchema,

    base_price: z.number().nonnegative(),
    quantity: z.number().int().positive(),
    note: z.string().optional(),

    selected_modifiers: z
      .array(
        z.object({
          group_name: I18nStringSchema,
          option_name: I18nStringSchema,
          price: z.number().nonnegative(),
        }),
      )
      .optional(),
    status: OrderItemStatus.default('new'),
    final_price: z.number().nonnegative(), // (base + modifiers) * quantity
  })
  .strict()

// Schema Order Chính
export const OrderSchema = BaseMongoSchema.extend({
  order_code: z.string().optional(), // BE tự sinh
  table_id: ObjectIdSchema,
  staff_id: ObjectIdSchema.optional(),

  status: OrderStatus.default('pending'),
  customer_language: z.enum(['vi', 'en', 'ja']).default('vi'),

  items: z.array(OrderItemSchema).min(1),

  // fields calculator
  discount: DiscountSchema.optional(),
  total_amount: z.number().min(0),
  tax_amount: z.number().min(0).default(0),
  discount_amount: z.number().min(0).default(0),
  final_amount: z.number().min(0),

  paidAt: z.date().optional(),
}).strict()

export type Order = z.infer<typeof OrderSchema>
