import { z } from "zod";
import { SlugRegex } from "../constants/common";

export const basicProductSchema = z.object({
  name: z
    .string({ required_error: "Tên sản phẩm là trường bắt buộc" })
    .min(3, { message: "Tên phải lớn hơn 3 kí tự" }),

  slug: z
    .string({ required_error: "Đường dẫn là trường bắt buộc" }).regex(SlugRegex, { message: "Đường dẫn không đúng định dạng" })
    .min(3, { message: "Đường dẫn phải lớn hơn 3 kí tự" }),

  price: z
    .number({ required_error: "Giá chung là trường bắt buộc" }),

  description: z.string().optional(),

  categoryId: z.number({ message: "Vui lòng chọn 1 danh mục" }),
});
