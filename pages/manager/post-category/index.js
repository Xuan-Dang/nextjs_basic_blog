import Layout from "../../../components/Layout";
import { useEffect, useState, lazy, Suspense, useContext } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Breadcrumb,
  BreadcrumbItem,
} from "react-bootstrap";
import { DataContext } from "@/context/AppProviders";
import { useRouter } from "next/router";
import Table from "react-bootstrap/Table";
import Head from "next/head";
import Link from "next/link";

function postCategory() {
  const { state, dispatch } = useContext(DataContext);
  const { user } = state;
  const router = useRouter();

  useEffect(() => {
    if (Object.keys(user).length > 0 && user.role !== "admin") router.push("/");
  }, [user]);
  return (
    <Layout>
      <Head>
        <title>Danh mục bài viết</title>
      </Head>
      <Row className="mb-3">
        <Col>
          <Breadcrumb>
            <Link href="/" className="breadcrumb-item">
              Home
            </Link>
            <Breadcrumb.Item active>Quản lý bài viết</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="card-title fs-3">Quản lý danh mục bài viết</h1>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={4}>
          <Form>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Tên danh mục</Form.Label>
              <Form.Control type="text" name="name" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="url">
              <Form.Label>Url</Form.Label>
              <Form.Control type="text" name="url" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control as="textarea" name="description" rows={3} />
            </Form.Group>
            <Button type="submit" variant="dark" className="w-100">
              Tạo danh mục
            </Button>
          </Form>
        </Col>
        <Col xs={12} md={8}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td colSpan={2}>Larry the Bird</td>
                <td>@twitter</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </Layout>
  );
}
export default postCategory;
