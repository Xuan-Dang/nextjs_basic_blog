import Layout from "../../../components/Layout";
import { useEffect, useState, lazy, Suspense, useContext } from "react";
import { DataContext } from "@/context/AppProviders";
import { useRouter } from "next/router";
import Table from "react-bootstrap/Table";
import Head from "next/head";

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
    </Layout>
  );
}
export default postCategory;
