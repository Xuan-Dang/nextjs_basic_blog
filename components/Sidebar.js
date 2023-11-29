import { Col, Card, Form, Button } from "react-bootstrap";
import { useState, useEffect, useContent, lazy } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getData, postData } from "@/utils/fetchData";

function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const controller = new AbortController();

    // Get categories
    getData(`/post-category?page=1&limit=0`, {
      timeout: 0,
      signal: controller.signal,
    })
      .then((data) => {
        data?.postCategories && setCategories(data.postCategories);
      })
      .catch((err) => {
        err && setCategories([]);
      });
    // End get categories

    // Get tags
    getData(`/tag?page=1&limit=0`, {
      timeout: 0,
      signal: controller.signal,
    })
      .then((data) => {
        data?.tags && setTags(data.tags);
      })
      .catch((err) => err && setTags([]));
    // End get tags
    return () => {
      return controller.abort();
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault()
    router.push(`/post?search=${search}`);
  };
  return (
    <Col xs={12} lg={4}>
      <Card className="border-0 shadow-sm">
        <Card.Header className="border-0">
          <Card.Title className="mb-0">Tìm kiếm</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Form.Group className="d-flex" controlId="search_post">
              <Form.Control
                type="text"
                name="search_post"
                placeholder="Nhập tên bài viết bạn muốn tìm"
                className="rounded-0 shadow-none"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                variant="dark"
                className="rounded-0 shadow-none"
                style={{ width: "30%" }}
                type="submit"
              >
                Tìm kiếm
              </Button>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      <Card className="border-0 shadow-sm mt-3">
        <Card.Header className="border-0">
          <Card.Title className="mb-0">Danh mục bài viết</Card.Title>
        </Card.Header>
        <Card.Body>
          {categories &&
            categories.map((category) => {
              return (
                <Link
                  href={`/category/${category.url}.${category._id}`}
                  className="d-block p-2 link-dark link-underline-opacity-0 link-underline-opacity-100-hover"
                  key={category._id}
                >
                  {category.name}
                </Link>
              );
            })}
        </Card.Body>
      </Card>
      <Card className="border-0 shadow-sm mt-3">
        <Card.Header className="border-0">
          <Card.Title className="mb-0">Tags</Card.Title>
        </Card.Header>
        <Card.Body>
          {tags &&
            tags.map((tag) => {
              return (
                <Link
                  href={`/tag/${tag.url}.${tag._id}`}
                  className="d-inline p-2 link-dark link-underline-opacity-0 link-underline-opacity-100-hover"
                  key={tag._id}
                >
                  {tag.name}
                </Link>
              );
            })}
        </Card.Body>
      </Card>
    </Col>
  );
}
export default Sidebar;
