import { z } from "zod";

export const basicInfoSettingSchema = z.object({
  shopName: z.string()
    .nonempty({ message: "Tên đăng nhập là bắt buộc" }),
  shopEmail: z
    .string()
    .email({ message: "Email không đúng định dạng" })
    .nonempty({ message: "Email là bắt buộc" }),
  shopPhone: z
    .string()
    .nonempty({ message: "Số điện thoại là bắt buộc" }),
  shopAddress: z
    .string()
    .nonempty({ message: "Địa chỉ là bắt buộc" }),
});
