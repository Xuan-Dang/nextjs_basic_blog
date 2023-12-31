import * as yup from "yup";

const schema = yup.object({
  name: yup.string().required("Tên danh mục không được bỏ trống"),
  url: yup.string().test({
    name: "TestUrl",
    test: (value, ctx) => {
      if (!value && ctx.parent.name)
        return ctx.createError({ message: "Url không được để trống" });
      return true;
    },
  }),
  description: yup.string(),
  image: yup.string(),
});

export async function handleValidate(data) {
  try {
    await schema.validate(data);
    return null;
  } catch (err) {
    return {
      code: 400,
      message: err.message,
    };
  }
}
