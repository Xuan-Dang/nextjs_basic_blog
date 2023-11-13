import Layout from "@/components/Layout";
import Head from "next/head";
import { Row, Col, Form, Breadcrumb } from "react-bootstrap";
import Link from "next/link";
import dynamic from "next/dynamic";

const Editor = dynamic(() => {
    return import("../../../components/Editor")
}, {ssr: false}
);

function create() {
  return (
    <Layout>
      <Head>
        <title>Tạo bài viết</title>
      </Head>
      <Row className="mb-3">
        <Col>
          <Breadcrumb>
            <Link href="/" className="breadcrumb-item">
              Home
            </Link>
            <Breadcrumb.Item active>Manager</Breadcrumb.Item>
            <Link href="/manager/post" className="breadcrumb-item">
              Bài viết
            </Link>
            <Breadcrumb.Item active>Tạo mới</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="card-title fs-3">Tạo bài viết mới</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control type="text" name="title" />
              <Form.Text className="text-danger">
                {/* {errors.name?.message} */}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="url">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control type="text" name="url" />
              <Form.Text className="text-danger">
                {/* {errors.name?.message} */}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control type="text" name="description" />
              <Form.Text className="text-danger">
                {/* {errors.name?.message} */}
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="content">
              <Form.Label>Mô tả</Form.Label>
              <Editor />
              {/* <Form.Control as="textarea" name="content" rows={12} /> */}
              <Form.Text className="text-danger">
                {/* {errors.name?.message} */}
              </Form.Text>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Layout>
  );
}
export default create;
