import Layout from "@/components/Layout";
import Head from "next/head";
import { Row, Col, Table, Breadcrumb } from "react-bootstrap";
import Link from "next/link";
import { useEffect, useState, useContext, lazy, Suspense } from "react";
import { getData } from "../../../utils/fetchData";
import { DataContext } from "@/context/AppProviders";
import Image from "next/image";

function post() {
  const { state, dispatch } = useContext(DataContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    getData(`/post/manager?`, {
      timeout: 10000,
      signal: controller.signal,
    })
      .then((data) => {
        setPosts(data.posts);
      })
      .catch((err) => {
        dispatch({
          type: "NOTIFY",
          payload: { success: false, message: err.message },
        });
      });
    return () => {
      controller.abort();
    };
  }, []);
  return (
    <Layout>
      <Head>
        <title>Quản lý bài viết</title>
      </Head>
      <Row className="mb-3">
        <Col>
          <Breadcrumb>
            <Link href="/" className="breadcrumb-item">
              Home
            </Link>
            <Breadcrumb.Item active>Manager</Breadcrumb.Item>
            <Breadcrumb.Item active>Bài viết</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="card-title fs-3">Quản lý bài viết</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered responsive="xl">
            <thead>
              <tr>
                <th className="align-middle text-center">#</th>
                <th className="align-middle text-center">Tiêu đề</th>
                <th className="align-middle text-center">Url</th>
                <th className="align-middle text-center">Hình ảnh</th>
                <th className="align-middle text-center">Trạng thái</th>
                <th className="align-middle text-center">Danh mục</th>
                <th className="align-middle text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => {
                console.log(post);
                return (
                  <tr>
                    <td className="align-middle text-center">{index + 1}</td>
                    <td className="align-middle">{post.title}</td>
                    <td className="align-middle">{post.url}</td>
                    <td className="align-middle text-center">
                      {post?.image?.url && (
                        <Image
                          src={post.image.url}
                          alt={post.image.alt}
                          title={post.image.title}
                          width={100}
                          height={100}
                        />
                      )}
                    </td>
                    <td className="align-middle text-center">
                      {post.isPublish ? "Hiển thị" : "Ẩn"}
                    </td>
                    <td className="align-middle text-center">
                      {post.category?.name
                        ? post.category.name
                        : "Chưa có danh mục"}
                    </td>
                    <td className="align-middle text-center">Hành động</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Layout>
  );
}
export default post;
