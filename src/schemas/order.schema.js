import { z } from "zod";
import { PhoneRegex } from "../constants/common";

export const createOrderSchema = z.object({
  phone: z.string({ required_error: "Số điện thoại là trường bắt buộc" })
    .regex(PhoneRegex, { message: "Số điện thoại không đúng định dạng" })
    .min(10, { message: "Tên phải lớn hơn 10 kí tự" }),
});