import Layout from "@/components/Layout";
import Head from "next/head";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData } from "../utils/fetchData";
import { DataContext } from "@/context/AppProviders";

const userRegisterSchema = yup.object({
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
function Register() {
  const [error, setError] = useState("");
  const {state, dispatch} = useContext(DataContext)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(userRegisterSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const registerSubmit = async (data) => {
    try {
      const res = await postData("/auth/register", data, {
        timeout: 1500,
        headers: { "content-type": "application/x-www-form-urlencoded" },
      });
      dispatch({type: "NOTIFY", payload: {message: res.message, success: true, active: true}})
      reset();
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [error]);

  return (
    <Layout>
      <Head>
        <title>Đăng ký</title>
      </Head>
      <Card className="mx-auto" style={{ maxWidth: "400px" }}>
        <Card.Body>
          <Card.Title className="text-center">Đăng ký</Card.Title>
          <Form onSubmit={handleSubmit(registerSubmit)}>
            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                {...register("fullName")}
                placeholder="Nhập họ tên của bạn"
              />
              <Form.Text className="text-danger">
                {errors.fullName?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Địa chỉ email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                {...register("email")}
                placeholder="Nhập email"
              />
              <Form.Text className="text-danger">
                {errors.email?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                name="password"
                {...register("password")}
                placeholder="Nhập mật khẩu"
              />
              <Form.Text className="text-danger">
                {errors.password?.message}
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Xác nhận nhật khẩu</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                {...register("confirmPassword")}
                placeholder="Xác nhận mật khẩu"
              />
              <Form.Text className="text-danger">
                {errors.confirmPassword?.message}
              </Form.Text>
            </Form.Group>
            <Form.Text className="text-danger mb-2 d-block">
              {error ? error : ""}
            </Form.Text>
            <Button variant="dark" type="submit" className="w-100">
              Đăng ký
            </Button>
            <p className="mb-0 mt-3">
              Bạn đã có tài khoản?{" "}
              <Link href="/login" className="text-danger">
                Đăng nhập tại đây
              </Link>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
}
export default Register;
