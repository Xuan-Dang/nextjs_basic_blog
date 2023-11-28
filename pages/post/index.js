import Layout from "@/components/Layout";
import Head from "next/head";
import { getDataServerSide } from "../../utils/fetchDataServerSide";
import Error from "../../components/Error";
import { Row, Col, Breadcrumb, Form } from "react-bootstrap";
import Link from "next/link";
import PostItem from "@/components/post/PostItem";
import { useEffect, useState, useContext } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router";
import Pagina from "@/components/Pagination";

function posts({ posts, error, message, sort, page, limit, search, count }) {
  const router = useRouter();

  const handleSort = (e) => {
    router.push(
      `/post?search=${search}&page=${page}&limit=${limit}&sort=${e.target.value}`
    );
  };
  const handleChangePage = (newPage) => {
    router.push(
      `/post?search=${search}&page=${newPage}&limit=${limit}&sort=${sort}`
    );
  };
  return (
    <Layout>
      {/* Head */}
      <Head>
        <title>{message ? message : "Tất cả bài viết"}</title>
      </Head>
      {/* End Head */}

      {/* Error */}
      {error && (
        <Row>
          <Col xs={12} lg={8}>
            <Error code={error?.code} message={error?.message} />
          </Col>
          <Sidebar />
        </Row>
      )}
      {posts && posts.length === 0 && (
        <Row>
          <Col xs={12} lg={8}>
            <Error code={404} message="Không tìm thấy bài viết nào" />
          </Col>
          <Sidebar />
        </Row>
      )}
      {/* End error */}

      {/* Render post */}
      {posts && (
        <>
          {/* Page header row */}
          <Row>
            <Col>
              {/* Breadcrumb */}
              <Breadcrumb>
                <Link href="/" className="breadcrumb-item">
                  Home
                </Link>
                <Breadcrumb.Item active>
                  {message ? message : "Tất cả bài viết"}
                </Breadcrumb.Item>
              </Breadcrumb>
              {/* End breadcrumb */}

              {/* Page title */}
              <h1>{message ? message : "Tất cả bài viết"}</h1>
              {/* End page title */}
            </Col>
          </Row>
          {/* End header row */}

          <Row>
            <Col xs={12} md={6} lg={4}>
              <Form.Select aria-label="Sắp xếp" onChange={handleSort}>
                <option>Sắp xếp</option>
                <option value="createdAt,desc">Ngày đăng: Mới nhất</option>
                <option value="createdAt,asc">Ngày đăng: Cũ nhất</option>
                <option value="title,asc">Tiêu đề: A - Z</option>
                <option value="title,desc">Tiêu đề: Z - A</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Post row */}
          <Row>
            <Col xs={12} lg={8}>
              <Row>
                {posts.map((post) => (
                  <PostItem post={post} key={post._id} />
                ))}
                {count > 0 && (
                  <Pagina
                    count={count}
                    page={page}
                    limit={limit}
                    size="sm"
                    setPage={handleChangePage}
                  />
                )}
              </Row>
            </Col>
            <Sidebar />
          </Row>
          {/* End post row */}
        </>
      )}
    </Layout>
  );
}

export async function getServerSideProps(req) {
  try {
    const { sort, limit, page, search } = req.query;
    const url = req.resolvedUrl;
    const res = await getDataServerSide(url, {
      timeout: 10000,
    });
    return {
      props: {
        posts: res?.posts ? res.posts : null,
        message: res?.message ? res.message : "",
        sort: sort ? sort : "createdAt,desc",
        limit: limit ? limit : 10,
        page: page ? page : 1,
        search: search ? search : "",
        count: res?.count ? res.count : 0,
      },
    };
  } catch (err) {
    return { props: { error: err ? err : null } };
  }
}
export default posts;
