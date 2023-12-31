import Layout from "@/components/Layout";
import { useState, useEffect, useContext } from "react";
import { DataContext } from "@/context/AppProviders";
import { useRouter } from "next/router";
import {
  Card,
  Row,
  Col,
  Tab,
  Nav,
  Container,
  Form,
  Button,
  Breadcrumb,
} from "react-bootstrap";
import UserProfile from "@/components/user/UserProfile";
import Head from "next/head";
import Link from "next/link";

function Profile() {
  const { state, dispatch } = useContext(DataContext);
  const { user } = state;
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("is_login")) {
      const isLogin = JSON.parse(localStorage.getItem("is_login"));
      if (!isLogin) router.push("/login");
    } else {
      router.push("/login");
    }
  }, []);

  return (
    <Layout>
      <Head>
        <title>User Profile</title>
      </Head>
      <Container fluid="lg">
        <Row>
          <Col className="px-0">
            <Breadcrumb>
              <Link href="/" className="breadcrumb-item">
                Home
              </Link>
              <Breadcrumb.Item active>Hồ sơ người dùng</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="fs-3">Hồ sơ người dùng</h1>
          </Col>
        </Row>
      </Container>
      <Tab.Container id="left-tabs-example" defaultActiveKey="userProfile">
        <Container fluid="lg">
          <Row>
            <Col sm={3} className="px-0">
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="userProfile" className="p-2 rounded-0">
                    Thông tin
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second" className="p-2 rounded-0">
                    Hoạt động
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <UserProfile name={"userProfile"} />
                <Tab.Pane eventKey="second">Second tab content</Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Container>
      </Tab.Container>
    </Layout>
  );
}
export default Profile;
