import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().nonempty({ message: "Tên đăng nhập là bắt buộc" }),
  password: z
    .string()
    .nonempty({ message: "Mật khẩu là bắt buộc" }),
});
