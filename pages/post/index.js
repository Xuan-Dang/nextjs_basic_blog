import Layout from "@/components/Layout";
import Head from "next/head";
import { getData } from "../../utils/fetchData";
import Error from "../../components/Error";
import { Row, Col, Breadcrumb } from "react-bootstrap";
import Link from "next/link";
import PostItem from "@/components/post/PostItem";
import { useEffect, useState, useContext } from "react";

function posts({ posts, error }) {
  return (
    <Layout>
      {/* Head */}
      <Head>
        <title>Bài viết</title>
      </Head>
      {/* End Head */}

      {/* Error */}
      {error && <Error code={error.code} message={error.message} />}
      {posts && posts.length === 0 && (
        <Error code={404} message="Không tìm thấy bài viết nào" />
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
                <Breadcrumb.Item active>Tất cả bài viết</Breadcrumb.Item>
              </Breadcrumb>
              {/* End breadcrumb */}

              {/* Page title */}
              <h1>Tất cả bài viết</h1>
              {/* End page title */}
            </Col>
          </Row>
          {/* End header row */}

          {/* Post row */}
          <Row>
            {posts.map((post) => (
              <PostItem post={post} key={post._id} />
            ))}
          </Row>
          {/* End post row */}
        </>
      )}
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const res = await getData("/post", { timeout: 3600 });
    return { props: { posts: res.posts } };
  } catch (err) {
    return { props: { error: err ? err : null } };
  }
}
export default posts;
