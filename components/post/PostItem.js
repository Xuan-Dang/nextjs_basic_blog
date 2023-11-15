import { Col, Card, Button } from "react-bootstrap";
import Link from "next/link";
import Image from "next/image";

function PostItem({ post }) {
  return (
    <Col xs={12} md={6} lg={4} className="py-2">
      <Card className="border-0 shadow-sm">
        <Link
          href={`/post/${post.url}.${post._id}`}
          className="d-block position-relative"
          style={{ height: "250px" }}
        >
          <Image
            fill
            style={{
              width: "100%",
              objectFit: "cover",
              height: "100%",
            }}
            src={post?.image?.url}
            className="card-img-top"
            alt={post.title}
          />
        </Link>
        <Card.Body>
          <Link
            href={`/post/${post.url}.${post._id}`}
            style={{
              textDecoration: "none",
            }}
          >
            <h2 className="card-title text-dark fs-3">{post.title}</h2>
          </Link>
          <Card.Text>{post.description}</Card.Text>
          <Link
            href={`/post/${post.url}.${post._id}`}
            className="btn btn-primary"
          >
            Xem chi tiết
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default PostItem;
