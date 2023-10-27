import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { postData } from "../utils/fetchData";
import { Card } from "react-bootstrap";
import Link from "next/link";
import Head from "next/head";

function verifyEmail() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const verifyEmail = async () => {
    try {
      await postData("/auth/verify-email", { token: token });
    } catch (err) {
      setError("Xác thực email không thành công, vui lòng thử lại");
    }
  };

  useEffect(() => {
    const tokenUrl = window.location.search.split("=")[1];
    setToken(tokenUrl);
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyEmail();
    }
  }, [token]);
  return (
    <Layout>
      <Head>
        <title>Xác thực email</title>
      </Head>
      <Card>
        <Card.Body>
          <Card.Title>Xác thực email của bạn</Card.Title>
          {error ? (
            <Card.Text>
              {error}, quay lại <Link href="/register">đăng ký</Link>
            </Card.Text>
          ) : (
            <Card.Text>
              Xác thực email thành công, <Link href="/login">đăng nhập</Link>
            </Card.Text>
          )}
        </Card.Body>
      </Card>
    </Layout>
  );
}
export default verifyEmail;
