import Layout from "../../../components/Layout";
import { useEffect, useState, lazy, Suspense, useContext } from "react";
import { Row, Col, Breadcrumb } from "react-bootstrap";
import { DataContext } from "@/context/AppProviders";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Add from "@/components/tag/Add";
import List from "@/components/tag/List";
const Update = lazy(() => import("../../../components/tag/Update"));

function tag() {
  const { state, dispatch } = useContext(DataContext);
  const { user } = state;
  const router = useRouter();
  const [num, setNum] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [tag, setTag] = useState({});

  useEffect(() => {
    if (Object.keys(user).length > 0) {
      if (user?.role && user.role !== "admin") {
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [user]);
  return (
    <Layout>
      <Head>
        <title>Quản lý tag</title>
      </Head>
      <Row className="mb-3">
        <Col>
          <Breadcrumb>
            <Link href="/" className="breadcrumb-item">
              Home
            </Link>
            <Breadcrumb.Item active>Manager</Breadcrumb.Item>
            <Breadcrumb.Item active>Quản lý tag</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="card-title fs-3">Quản lý tag</h1>
        </Col>
      </Row>
      <Row>
        {isUpdate ? (
          <Suspense>
            <Update isUpdate={isUpdate} tag={...tag} setNum={setNum} setIsUpdate={setIsUpdate}  />
          </Suspense>
        ) : (
          <Add setNum={setNum} />
        )}
        <List
          parentNum={num}
          setIsUpdate={setIsUpdate}
          setTag={setTag}
          tagToUpdate={tag}
          isUpdate={isUpdate}
        />
      </Row>
    </Layout>
  );
}
export default tag;
