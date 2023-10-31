import Layout from "@/components/Layout";
import Head from "next/head";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Link from "next/link";
import { useState, useEffect, lazy, Suspense, useContext } from "react";
import { DataContext } from "@/context/AppProviders";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { postData } from "../utils/fetchData";
import { Spinner } from "react-bootstrap";
import { useRouter } from "next/router";

const userLoginSchema = yup.object({
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { state, dispatch } = useContext(DataContext);
  const { user } = state;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(userLoginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data) => {
    try {
      setIsLoading(true);
      const res = await postData("/auth/login", data, {
        timeout: 3600,
        headers: { "content-type": "application/x-www-form-urlencoded" },
      });
      const { refreshToken, ...user } = res.user;
      dispatch({ type: "USER", payload: user });
      localStorage.setItem("rf_token", JSON.stringify(res.user.refreshToken));
      localStorage.setItem("is_login", JSON.stringify(true));
      setIsLoading(false);
      reset();
      dispatch({
        type: "NOTIFY",
        payload: {
          message: "Đăng nhập thành công",
          success: true,
        },
      });
      router.push("/profile");
    } catch (err) {
      setIsLoading(false);
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

  useEffect(() => {
    if (localStorage.getItem("is_login")) {
      const isLogin = JSON.parse(localStorage.getItem("is_login"));
      if (isLogin) router.push(`/profile/${user._id}`);
    }
  }, [user]);

  return (
    <Layout>
      <Head>
        <title>Đăng nhập</title>
      </Head>
      <Card className="mx-auto" style={{ maxWidth: "400px" }}>
        <Card.Body>
          <Card.Title className="text-center">Đăng nhập</Card.Title>
          <Form onSubmit={handleSubmit(handleLogin)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Địa chỉ email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                {...register("email")}
                placeholder="Enter email"
              />
              <Form.Text className="text-danger">
                {errors.email?.message}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                name="password"
                {...register("password")}
                placeholder="Password"
              />
              <Form.Text className="text-danger">
                {errors.password?.message}
              </Form.Text>
            </Form.Group>
            <Form.Text className="text-danger mb-2 d-block">
              {error ? error : ""}
            </Form.Text>
            <Button variant="dark" type="submit" className="w-100">
              Đăng nhập
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
            <p className="mb-0 mt-3">
              Bạn chưa có tài khoản?{" "}
              <Link href="/register" className="text-danger">
                Đăng ký tại đây
              </Link>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
}
export default Login;
