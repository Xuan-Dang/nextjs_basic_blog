import Layout from "@/components/Layout";
import Head from "next/head";
import { getData } from "../../utils/fetchData";
import Error from "../../components/Error";
import { Row } from "react-bootstrap";
import PostItem from "@/components/post/PostItem";

function post({ posts, error }) {
  return (
    <Layout>
      <Head>
        <title>Bài viết</title>
      </Head>
      {error && <Error code={error.code} message={error.message} />}
      {posts.length === 0 && (
        <Error code={404} message="Không tìm thấy bài viết nào" />
      )}
      {posts && (
        <Row>
          {posts.map((post) => (
            <PostItem post={post} />
          ))}
        </Row>
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
export default post;
