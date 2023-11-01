import Layout from "@/components/Layout";
import { useState, useEffect, lazy, Suspense } from "react";
import { Card, Button, Form } from "react-bootstrap";
const Spinner = lazy(() => import("react-bootstrap/Spinner"));
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData } from "../utils/fetchData";
import Head from "next/head";

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

function resetPassword() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoadding] = useState(false);
  const [token, setToken] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSendPassword = async (data) => {
    try {
      setIsLoadding(true)
      const res = await postData(
        "/auth/reset-password/",
        { token, password: data.password },
        {
          timeout: 5000,
          headers: { "content-type": "application/x-www-form-urlencoded" },
        }
      );
      setIsLoadding(false)
      setMessage(res.message);
    } catch (err) {
      setIsLoadding(false)
      setMessage(err.message);
    }
  };

  useEffect(() => {
    const tokenUrl = window.location.search.split("=")[1];
    setToken(tokenUrl);
  }, []);
  return (
    <Layout>
      <Head>
        <title>Reset mật khẩu</title>
      </Head>
      <h1>Lấy lại mật khẩu</h1>
      <Card
        className="mx-auto border-0 shadow-sm"
        style={{ maxWidth: "500px" }}
      >
        <Card.Body>
          <Form onSubmit={handleSubmit(handleSendPassword)}>
            <Form.Group className="mb-3" controlId="passowrd">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                {...register("password")}
              />
              <Form.Text className="text-danger">
                {errors.password?.message}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassowrd">
              <Form.Label>Xác nhận mật khẩu</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                placeholder="Enter password"
                {...register("confirmPassword")}
              />
              <Form.Text className="text-danger">
                {errors.confirmPassword?.message}
              </Form.Text>
            </Form.Group>
            <Form.Text className="text-danger mb-2 d-block">
              {message ? message : ""}
            </Form.Text>
            <Button variant="dark" type="submit" className="w-100">
              Cập nhật mật khẩu
              {isLoading && (
                <Suspense>
                  <Spinner
                    animation="grow"
                    variant="light"
                    style={{ width: "16px", height: "16px", marginLeft: "7px" }}
                  />
                </Suspense>
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
}
export default resetPassword;
