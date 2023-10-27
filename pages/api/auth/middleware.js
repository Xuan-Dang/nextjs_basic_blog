import * as yup from "yup";

const registerSchema = yup.object({
  fullName: yup.string().required("Vui lòng nhập họ tên"),
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: yup
    .string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải chứa ít nhất 6 ký tự"),
  confirmPassword: yup.string().test({
    name: "isMatch",
    test: (value, ctx) => {
      if (ctx.parent.password && !value) {
        return ctx.createError({ message: "Vui lòng xác nhận mật khẩu" });
      }
      if (ctx.parent.password && value !== ctx.parent.password) {
        return ctx.createError({
          message: "Mật khẩu không khớp, vui lòng kiểm tra lại",
        });
      }
      return true;
    },
  }),
});

export async function registerValidate(data) {
  try {
    await registerSchema.validate(data);
    return null;
  } catch (err) {
    return {
      code: 422,
      message: err.message,
    };
  }
}

const loginSchema = yup.object({
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: yup.string().required("Vui lòng nhập email"),
});

export async function loginValidate(data) {
  try {
    await loginSchema.validate(data);
    return null;
  } catch (err) {
    return {
      code: 422,
      message: err.message,
    };
  }
}
