import Layout from "../../../components/Layout";
import { useEffect, useState, lazy, Suspense, useContext } from "react";
import { Row, Col, Breadcrumb } from "react-bootstrap";
import { DataContext } from "@/context/AppProviders";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Add from "@/components/post-category/Add";
import List from "@/components/post-category/List";
const Update = lazy(() => import("../../../components/post-category/Update"));

function postCategory() {
  const { state, dispatch } = useContext(DataContext);
  const { user } = state;
  const router = useRouter();
  const [num, setNum] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [category, setCategory] = useState({});

  useEffect(() => {
    // if (Object.keys(user).length > 0) {
    //   if (user?.role && user.role !== "admin") {
    //     router.push("/");
    //   }
    // } else {
    //   router.push("/");
    // }
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
        {isUpdate ? (
          <Suspense>
            <Update isUpdate={isUpdate} category={...category} setNum={setNum} setIsUpdate={setIsUpdate}  />
          </Suspense>
        ) : (
          <Add setNum={setNum} />
        )}
        <List
          parentNum={num}
          setIsUpdate={setIsUpdate}
          setCategory={setCategory}
          categoryToUpdate={category}
          isUpdate={isUpdate}
        />
      </Row>
    </Layout>
  );
}
export default postCategory;
