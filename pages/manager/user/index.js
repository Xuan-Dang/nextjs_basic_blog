import Layout from "@/components/Layout";
import { useEffect, useState, useContext, lazy, Suspense } from "react";
import { Row, Col, Table, Button, Breadcrumb } from "react-bootstrap";
import Link from "next/link";
import Head from "next/head";
import { DataContext } from "@/context/AppProviders";
import { getData, deleteData } from "@/utils/fetchData";
import Pagina from "@/components/Pagination";

function userManager() {
  const { state, dispatch } = useContext(DataContext);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(0);
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [sort, setSort] = useState("desc");

  useEffect(() => {
    getData(`/auth/manager?limit=${limit}&page=${page}&sort=${sort}`)
      .then((data) => {
        const { users, count } = data;
        setUsers(users);
        setCount(count);
      })
      .catch((err) =>
        dispatch({
          type: "NOTIFY",
          payload: { success: false, message: err.message },
        })
      );
  }, [page]);

  return (
    <Layout>
      <Head>
        <title>Quản lý người dùng</title>
      </Head>
      <Row className="mb-3">
        <Col>
          <Breadcrumb>
            <Link href="/" className="breadcrumb-item">
              Home
            </Link>
            <Breadcrumb.Item active>Manager</Breadcrumb.Item>
            <Breadcrumb.Item active>Người dùng</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="card-title fs-3">Quản lý người dùng</h1>
        </Col>
      </Row>
      {console.log(users)}
      <Row>
        <Col></Col>
      </Row>
    </Layout>
  );
}
export default userManager;
