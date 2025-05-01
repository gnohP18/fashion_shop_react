import { z } from "zod";
import { SlugRegex } from "../constants/common";

export const basicCategorySchema = z.object({
  name: z
    .string({ required_error: "Tên danh mục là trường bắt buộc" })
    .min(3, { message: "Tên phải lớn hơn 3 kí tự" }),

  slug: z
    .string({ required_error: "Đường dẫn là trường bắt buộc" }).regex(SlugRegex, { message: "Đường dẫn không đúng định dạng" })
    .min(3, { message: "Đường dẫn phải lớn hơn 3 kí tự" }),
});
