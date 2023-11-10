import Layout from "../../../components/Layout";
import { useEffect, useState, lazy, Suspense, useContext } from "react";
import { Row, Col, Breadcrumb } from "react-bootstrap";
import { DataContext } from "@/context/AppProviders";
import { useRouter } from "next/router";
import Table from "react-bootstrap/Table";
import Head from "next/head";
import Link from "next/link";
import AddNewPostCategory from "@/components/post-category/AddNewPostCategory";
import PostCategoryList from "../../../components/post-category/PostCategoryList";

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
        <AddNewPostCategory />
        <PostCategoryList />
      </Row>
    </Layout>
  );
}
export default postCategory;
