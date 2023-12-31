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
      code: 400,
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
      code: 400,
      message: err.message,
    };
  }
}

const sendResetPasswordTokenSchema = yup.object({
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
});

export async function sendResetPasswordTokenValidate(data) {
  try {
    await sendResetPasswordTokenSchema.validate(data);
    return null;
  } catch (err) {
    return {
      code: 400,
      message: err.message,
    };
  }
}

const resetPasswordSchema = yup.object({
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

export async function resetPasswordValidate(data) {
  try {
    await resetPasswordSchema.validate(data);
    return null;
  } catch (err) {
    return {
      code: 400,
      message: err.message,
    };
  }
}

const updateUserByIdSchema = yup.object({
  fullName: yup.string().required("Họ và tên không được để trống"),
  email: yup
    .string()
    .required("Email không được để trống")
    .email("Email không hợp lệ"),
  password: yup.string().test({
    name: "validatePassword",
    test: (value, ctx) => {
      console.log("value: ", value);
      if (value && value.length < 6)
        return ctx.createError({
          message: "Mật khẩu phải có tối thiểu 6 ký tự",
        });
      return true;
    },
  }),
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

export async function updateUserByIdValidate(data) {
  try {
    await updateUserByIdSchema.validate(data);
    return null;
  } catch (err) {
    return {
      code: 400,
      message: err.message,
    };
  }
}
