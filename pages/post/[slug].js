import Layout from "@/components/Layout";
import { getData } from "../../utils/fetchData";
import { useEffect, useState } from "react";
import Head from "next/head";
import Error from "@/components/Error";
import { Card, Breadcrumb, Row, Col } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

function post({ post, error }) {
  const [publishedAt, setPublishedAt] = useState("");

  useEffect(() => {
    if (post) {
      const publishedAt = new Date(post.publishedAt);
      setPublishedAt(() => publishedAt.toLocaleDateString());
    }
  }, []);

  return (
    <Layout>
      <Head>
        <title>{post ? post.title : "404"}</title>
      </Head>
      {/* Error */}
      {error && <Error code={error.code} message={error.message} />}
      {!post && <Error code={404} message="Không tìm thấy bài viết" />}
      {/* End error */}
      
      {/* Post */}
      {post && (
        <Card className="border-0 shadow-sm p-3">
          {/* Breadcrumb */}
          <Breadcrumb>
            <Link href="/" className="breadcrumb-item">
              Home
            </Link>
            <Link href="/post" className="breadcrumb-item">
              Bài viết
            </Link>
            {post.category && post.category.name && (
              <Link
                href={`/category/${post.category._id}`}
                className="breadcrumb-item"
              >
                {post.category.name}
              </Link>
            )}
            <Breadcrumb.Item active>{post.title}</Breadcrumb.Item>
          </Breadcrumb>
          {/* End breadcrumb */}

          {/* Page title */}
          <h1 className="card-title">{post.title}</h1>
          {/* End page title */}

          {/* Subtitle */}
          <Card.Subtitle
            className="text-secondary"
            style={{ fontWeight: "400", fontSize: "12px" }}
          >
            {post.author.fullName} - {publishedAt}
          </Card.Subtitle>
          {/* End subtitle */}

          {/* Post image */}
          <div
            className="position-relative mt-3 mx-auto"
            style={{ width: "50vw", height: "375px" }}
          >
            <Image src={post.image} fill alt={post.title} />
          </div>
          {/* End post image */}
          
          {/* Post content */}
          <Card.Body className="p-0 mt-3">{post.content}</Card.Body>
          {/* End post content */}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="d-flex flex-wrap mt-2">
              {post.tags.map((tag) => {
                const { _id, name, url } = tag.tagId;
                return (
                  <Link
                    href={`/tag/${url}.${_id}`}
                    style={{ display: "inline-block", width: "fit-content", fontSize: "13px", fontWeight: "300" }}
                    className="p-1 btn btn-secondary rounded-0 me-1"
                  >
                    {name}
                  </Link>
                );
              })}
            </div>
          )}
        {/* End tag */}
        </Card>
      )}
      {/* End post */}
    </Layout>
  );
}

export async function getServerSideProps(req) {
  try {
    const { slug } = req.query;
    const id = slug.split(".")[1];
    const res = await getData(`/post/${id}`, { timeout: 3600 });
    return {
      props: { post: res.post },
    };
  } catch (err) {
    return {
      props: { error: err ? err : null },
    };
  }
}
export default post;
