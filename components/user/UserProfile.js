import { Tab, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DataContext } from "@/context/AppProviders";

const userUpdateSchema = yup.object({
  avatar: yup.mixed().test({
    name: "fileValidate",
    test: (value, ctx) => {
      console.log("ctx: ", ctx);
      console.log("value: ", value);
      return true;
    },
  }),
  fullName: yup.string().required("Họ và tên không được để trống"),
  email: yup
    .string()
    .required("Email không được để trống")
    .email("Email không hợp lệ"),
  password: yup.string().test({
    name: "checkPassowrrd",
    test: (value, ctx) => {
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

function UserProfile({ name }) {
  const { state, dispatch } = useContext(DataContext);
  const { user } = state;

  console.log(user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(userUpdateSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    setValue("fullName", user.fullName, { shouldValidate: true });
    setValue("email", user.email, { shouldValidate: true });
  }, [user]);
  return (
    <Tab.Pane eventKey={name}>
      <h2 className="fs-4 mb-3">Hồ sơ</h2>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="avatar">
            <Form.Label>Ảnh đại diện</Form.Label>
            <Form.Control
              type="file"
              name="avatar"
              {...register("avatar")}
              hidden
            />
            <Form.Text className="text-danger">
              {errors.avatar?.message}
            </Form.Text>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="fullName">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              {...register("fullName")}
            />
            <Form.Text className="text-danger">
              {errors.fullName?.message}
            </Form.Text>
          </Form.Group>

          <Form.Group as={Col} controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              name="email"
              readOnly
              {...register("email")}
            />
            <Form.Text className="text-danger">
              {errors.email?.message}
            </Form.Text>
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="password">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="password"
              {...register("password")}
            />
            <Form.Text className="text-danger">
              {errors.password?.message}
            </Form.Text>
          </Form.Group>

          <Form.Group as={Col} controlId="confirmPassword">
            <Form.Label>Xác nhận mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              {...register("confirmPassword")}
            />
            <Form.Text className="text-danger">
              {errors.confirmPassword?.message}
            </Form.Text>
          </Form.Group>
        </Row>
        <Form.Group as={Col}>
          <Button>Cập nhật hồ sơ</Button>
        </Form.Group>
      </Form>
    </Tab.Pane>
  );
}
export default UserProfile;
