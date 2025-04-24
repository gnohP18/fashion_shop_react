import { z } from "zod";

export const basicProductSchema = z.object({
  name: z
    .string({ required_error: "Tên sản phẩm là trường bắt buộc" })
    .min(3, { message: "Tên phải lớn hơn 3 kí tự" }),

  slug: z
    .string({ required_error: "Đường dẫn là trường bắt buộc" })
    .min(3, { message: "Đường dẫn phải lớn hơn 3 kí tự" }),

  price: z
    .number({ required_error: "Giá chung là trường bắt buộc" }),

  description: z.string().optional(),

  categoryId: z.number(),
});
