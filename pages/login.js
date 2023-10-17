import Layout from "@/components/Layout";
import Head from "next/head";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from 'react-bootstrap/Card';
import Link from "next/link";

function Login() {
  return (
    <Layout>
      <Head>
        <title>Đăng nhập</title>
      </Head>
      <Card className="mx-auto" style={{ maxWidth: "400px" }}>
        <Card.Body>
            <Card.Title className="text-center">Đăng nhập</Card.Title>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Địa chỉ email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text className="text-danger">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="dark" type="submit" className="w-100">
                Đăng nhập
            </Button>
            <p className="mb-0 mt-3">
                Bạn chưa có tài khoản? <Link href="/register" className="text-danger">Đăng ký tại đây</Link>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </Layout>
  );
}
export default Login;
