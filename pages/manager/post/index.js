import Layout from "@/components/Layout";
import Head from "next/head";
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Badge,
  Form,
  Button,
} from "react-bootstrap";
import Link from "next/link";
import { useEffect, useState, useContext, lazy, Suspense } from "react";
import { getData, patchData, deleteData } from "../../../utils/fetchData";
import { DataContext } from "@/context/AppProviders";
import Image from "next/image";
import Pagina from "@/components/Pagination";
const Spinner = lazy(() => import("react-bootstrap/Spinner"));

function post() {
  const { state, dispatch } = useContext(DataContext);
  const [posts, setPosts] = useState([]);
  const [num, setNum] = useState(0);
  const [updateId, setUpdateId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("desc");
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    getData(`/post/manager?page=${page}&limit=${limit}&sort=${sort}`, {
      timeout: 10000,
      signal: controller.signal,
    })
      .then((data) => {
        data?.posts && setPosts(data.posts);
        data?.count && setCount(data.count);
      })
      .catch((err) => {
        err && dispatch({
          type: "NOTIFY",
          payload: { success: false, message: err.message },
        });
      });
    return () => {
      controller.abort();
    };
  }, [num, sort, page]);

  const handleUpdateIsPublish = async (id, isPublish) => {
    try {
      setIsLoading(true);
      setUpdateId(id);
      const res = await patchData(
        `/post/manager/update-is-publish?id=${id}`,
        { isPublish },
        {
          timeout: 10000,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      );
      setIsLoading(false);
      setUpdateId(null);
      setNum((prev) => prev + 1);
      dispatch({
        type: "NOTIFY",
        payload: {
          success: true,
          message: res.message,
        },
      });
    } catch (err) {
      setUpdateId(null);
      setIsLoading(false);
      return dispatch({
        type: "NOTIFY",
        payload: {
          success: false,
          message: err.message,
        },
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      dispatch({
        type: "CONFIRM_MODAL",
        payload: {
          show: false,
          message: "",
          cb: null,
        },
      });
      setIsLoading(true);
      setDeleteId(id);
      const res = await deleteData(`/post/manager/delete?id=${id}`, {
        timeout: 10000,
      });
      setIsLoading(false);
      setDeleteId(null);
      setNum((prev) => prev + 1);
      dispatch({
        type: "NOTIFY",
        payload: { success: true, message: res.message },
      });
    } catch (err) {
      dispatch({
        type: "NOTIFY",
        payload: {
          success: false,
          message: err.message,
        },
      });
    }
  };

  return (
    <Layout>
      <Head>
        <title>Quản lý bài viết</title>
      </Head>
      <Row className="mb-3">
        <Col>
          <Breadcrumb>
            <Link href="/" className="breadcrumb-item">
              Home
            </Link>
            <Breadcrumb.Item active>Manager</Breadcrumb.Item>
            <Breadcrumb.Item active>Bài viết</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="card-title fs-3">Quản lý bài viết</h1>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} md={6} lg={4}>
          <Link href="/manager/post/create" className="btn btn-dark my-3">
            Tạo bài viết mới
          </Link>
          <Form.Select onChange={(e) => setSort(e.target.value)}>
            <option value="">Sắp xếp</option>
            <option value="desc">Ngày tạo: Mới nhất</option>
            <option value="asc">Ngày tạo: Cũ nhất</option>
          </Form.Select>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered responsive="xl">
            <thead>
              <tr>
                <th className="align-middle text-center">#</th>
                <th className="align-middle text-center">Tiêu đề</th>
                <th className="align-middle text-center">Url</th>
                <th className="align-middle text-center">Hình ảnh</th>
                <th className="align-middle text-center">Trạng thái</th>
                <th className="align-middle text-center">Danh mục</th>
                <th className="align-middle text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {posts &&
                posts.map((post, index) => {
                  return (
                    <tr key={post._id}>
                      <td className="align-middle text-center">{index + 1}</td>
                      <td
                        className="align-middle"
                        style={{ maxWidth: "150px" }}
                      >
                        <p
                          style={{
                            display: "-webkit-box",
                            maxWidth: "100%",
                            WebkitLineClamp: "4",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverFlow: "ellipsis",
                          }}
                        >
                          {post.title}
                        </p>
                      </td>
                      <td
                        className="align-middle"
                        style={{ maxWidth: "150px" }}
                      >
                        <p
                          style={{
                            display: "-webkit-box",
                            maxWidth: "100%",
                            WebkitLineClamp: "4",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverFlow: "ellipsis",
                          }}
                        >
                          {post.url}
                        </p>
                      </td>
                      <td
                        className="align-middle text-center"
                        style={{ minWidth: "200px" }}
                      >
                        {post?.image?.url && (
                          <span
                            className="d-block position-relative"
                            style={{ width: "100%", height: "100px" }}
                          >
                            <Image
                              src={post.image.url}
                              alt={
                                post?.image?.alt
                                  ? post.image.alt
                                  : "Ảnh bài viết"
                              }
                              title={post.image.title}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          </span>
                        )}
                      </td>
                      <td className="align-middle text-center">
                        {isLoading && updateId && updateId === post._id ? (
                          <Suspense>
                            <Spinner animation="grow" size="sm" />
                          </Suspense>
                        ) : post.isPublish ? (
                          <Badge
                            bg="info"
                            onClick={() =>
                              handleUpdateIsPublish(post._id, !post.isPublish)
                            }
                          >
                            Hiển thị
                          </Badge>
                        ) : (
                          <Badge
                            bg="warning"
                            text="dark"
                            onClick={() =>
                              handleUpdateIsPublish(post._id, !post.isPublish)
                            }
                          >
                            Ẩn
                          </Badge>
                        )}
                      </td>
                      <td className="align-middle text-center" style={{minWidth: "150px"}}>
                        {post.category?.name
                          ? post.category.name
                          : "Chưa có danh mục"}
                      </td>
                      <td className="align-middle text-center" style={{minWidth: "150px"}}>
                        <Button
                          variant="danger"
                          onClick={() =>
                            dispatch({
                              type: "CONFIRM_MODAL",
                              payload: {
                                show: true,
                                message:
                                  "Bạn thực sự muốn xóa bài viết này chứ",
                                cb: () => handleDelete(post._id),
                              },
                            })
                          }
                        >
                          Xóa{" "}
                          {isLoading && deleteId && deleteId === post._id && (
                            <Suspense>
                              <Spinner animation="grow" size="sm" />
                            </Suspense>
                          )}
                        </Button>
                        <Link
                          href={`/manager/post/update/${post._id}`}
                          className="btn btn-success ms-2"
                        >
                          Sửa
                        </Link>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
          <Pagina
            size="md"
            page={page}
            count={count}
            limit={limit}
            setPage={setPage}
          />
        </Col>
      </Row>
    </Layout>
  );
}
export default post;
