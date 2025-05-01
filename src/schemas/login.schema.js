import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().nonempty({ message: "Tên đăng nhập là bắt buộc" }),
  password: z
    .string()
    .nonempty({ message: "Mật khẩu là bắt buộc" }),
});

export const changePasswordSchema = z.object({
  password: z.string()
    .nonempty({ message: "Mật khẩu là bắt buộc" })
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
  newPassword: z
    .string()
    .nonempty({ message: "Mật khẩu mới là bắt buộc" })
    .min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" }),
  confirmPassword: z
    .string()
    .nonempty({ message: "Xác nhận mật khẩu là bắt buộc" }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu mới và xác nhận mật khẩu phải giống nhau",
  path: ["confirmPassword"],
});
