import { Tab, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DataContext } from "@/context/AppProviders";
import Image from "next/image";

const userUpdateSchema = yup.object({
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
  const [newAvatar, setNewAvatar] = useState(null);

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

  const openImageModal = () => {
    dispatch({
      type: "IMAGE_MODAL",
      payload: { show: true, type: "USER_AVATAR" },
    });
  };

  return (
    <Tab.Pane eventKey={name}>
      <h2 className="fs-4 mb-3">Hồ sơ</h2>
      <Row className="mb-3">
        <Col>
          <div
            className="position-relative rounded-circle"
            style={{
              width: "100px",
              height: "100px",
              cursor: "pointer",
              overflow: "hidden",
            }}
            onClick={() => openImageModal()}
          >
            <Image
              src={user.avatar}
              fill
              alt={`${user.fullName} avatar`}
              style={{ objectFit: "cover" }}
            />
          </div>
        </Col>
      </Row>
      <Form>
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
