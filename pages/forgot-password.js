import Layout from "@/components/Layout";
import Head from "next/head";
import { Card, Form, Button } from "react-bootstrap";
import { useState, useEffect, lazy, Suspense } from "react";
const Spinner = lazy(() => import("react-bootstrap/Spinner"));
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData } from "../utils/fetchData";

const emailSchema = yup.object({
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
});

function forgotPassword() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoadding] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(emailSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const handleSendEmail = async (data) => {
    try {
      setIsLoadding(true);
      const { email } = data;
      const res = await postData(
        "/auth/send-reset-password-token",
        { email: email },
        {
          timeout: 10000,
          headers: { "content-type": "application/x-www-form-urlencoded" },
        }
      );
      setIsLoadding(false);
      reset()
      setMessage(res.message);
    } catch (err) {
      setIsLoadding(false);
      setMessage(err.message);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Quên mật khẩu</title>
      </Head>
      <h1>Lấy lại mật khẩu</h1>
      <Card
        className="mx-auto border-0 shadow-sm"
        style={{ maxWidth: "500px" }}
      >
        <Card.Body>
          <Form onSubmit={handleSubmit(handleSendEmail)}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Nhập địa chỉ email của bạn</Form.Label>
              <Form.Control
                type="text"
                name="email"
                placeholder="Enter email"
                {...register("email")}
              />
              <Form.Text className="text-danger">
                {errors.email?.message}
              </Form.Text>
            </Form.Group>
            <Form.Text className="text-danger mb-2 d-block">
              {message ? message : ""}
            </Form.Text>
            <Button variant="dark" type="submit" className="w-100">
              Gửi yêu cầu
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
export default forgotPassword;
