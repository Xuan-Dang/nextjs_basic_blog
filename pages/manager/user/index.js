import Layout from "@/components/Layout";
import { useEffect, useState, useContext, lazy, Suspense } from "react";
import { Row, Col, Table, Button, Breadcrumb, Badge } from "react-bootstrap";
import Link from "next/link";
import Head from "next/head";
import { DataContext } from "@/context/AppProviders";
import { getData, deleteData, patchData } from "@/utils/fetchData";
import Pagina from "@/components/Pagination";
import Image from "next/image";
const Spinner = lazy(() => import("react-bootstrap/Spinner"));

function userManager() {
  const { state, dispatch } = useContext(DataContext);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [sort, setSort] = useState("desc");
  const [isLoading, setIsLoading] = useState(false);
  const [num, setNum] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [blockId, setBlockId] = useState(null);

  const getDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(date);
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
      const res = await deleteData(`/auth/manager/delete/${id}`, {
        timeout: 10000,
      });
      console.log(res);
      setIsLoading(false);
      setDeleteId(null);
      setNum((prev) => prev + 1);
      dispatch({
        type: "Notify",
        payload: {
          success: true,
          message: res.message,
        },
      });
    } catch (err) {
      setIsLoading(false);
      err &&
        dispatch({
          type: "NOTIFY",
          payload: {
            message: err.message,
            success: false,
          },
        });
    }
  };

  const handleCancelDelete = async (id) => {
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
      const res = await patchData(
        `/auth/manager/cancel-delete/${id}`,
        {},
        {
          timeout: 10000,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      );
      setDeleteId(null);
      setIsLoading(false);
      setNum((prev) => prev + 1);
      dispatch({
        type: "NOTIFY",
        payload: {
          success: true,
          message: res.message,
        },
      });
    } catch (err) {
      setIsLoading(false);
      return dispatch({
        type: "NOTIFY",
        payload: { success: false, message: err.message },
      });
    }
  };

  const handleBlock = async (id) => {
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
      setBlockId(id);
      const res = await patchData(
        `/auth/manager/block/${id}`,
        {},
        {
          timeout: 10000,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      );
      setBlockId(null);
      setIsLoading(false);
      setNum((prev) => prev + 1);
      dispatch({
        type: "NOTIFY",
        payload: {
          success: true,
          message: res.message,
        },
      });
    } catch (err) {
      setIsLoading(false);
      return dispatch({
        type: "NOTIFY",
        payload: { success: false, message: err.message },
      });
    }
  };

  const handleCancelBlock = async (id) => {
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
      setBlockId(id);
      const res = await patchData(
        `/auth/manager/cancel-block/${id}`,
        {},
        {
          timeout: 10000,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      );
      setBlockId(null);
      setIsLoading(false);
      setNum((prev) => prev + 1);
      dispatch({
        type: "NOTIFY",
        payload: {
          success: true,
          message: res.message,
        },
      });
    } catch (err) {
      setIsLoading(false);
      return dispatch({
        type: "NOTIFY",
        payload: { success: false, message: err.message },
      });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    getData(`/auth/manager?limit=${limit}&page=${page}&sort=${sort}`, {
      timeout: 10000,
      signal: controller.signal,
    })
      .then((data) => {
        console.log(data.count);
        data?.users && setUsers(data.users);
        data?.count && setCount(data.count);
      })
      .catch(
        (err) =>
          err &&
          dispatch({
            type: "NOTIFY",
            payload: { success: false, message: err.message },
          })
      );
    return () => {
      controller.abort();
    };
  }, [page, num]);

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
      <Row>
        <Col>
          <Table striped bordered hover responsive="xl">
            <thead>
              <tr>
                <th className="align-middle text-center">#</th>
                <th className="align-middle text-center">Họ và tên</th>
                <th className="align-middle text-center">Email</th>
                <th className="align-middle text-center">Avatar</th>
                <th className="align-middle text-center">Xác thực</th>
                <th className="align-middle text-center">Trạng thái</th>
                <th className="align-middle text-center">Ngày đăng ký</th>
                <th className="align-middle text-center">Quyền</th>
                <th className="align-middle text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user, index) => {
                  return (
                    <tr key={user._id}>
                      <td className="align-middle text-center">{index + 1}</td>
                      <td className="align-middle text-center">
                        {user.fullName}
                      </td>
                      <td className="align-middle text-center">{user.email}</td>
                      <td
                        className="align-middle text-center"
                        style={{ minWidth: "150px" }}
                      >
                        {user.avatar && (
                          <span
                            className="d-block position-relative"
                            style={{ width: "100%", height: "150px" }}
                          >
                            <Image
                              src={user.avatar}
                              alt={`${user.fullName} - avatar`}
                              fill
                              style={{ objectFit: "cover" }}
                            />
                          </span>
                        )}
                      </td>
                      <td className="align-middle text-center">
                        {user.isVerified ? (
                          <Badge bg="success">Đã xác thực</Badge>
                        ) : (
                          <Badge bg="warning">Chưa xác thực</Badge>
                        )}
                      </td>
                      <td className="align-middle text-center">
                        {user?.expireAt
                          ? `Đã lên lịch xóa vào ${getDate(user.expireAt)}`
                          : user?.isActive
                          ? "Đang hoạt động"
                          : "Đã bị khóa"}
                      </td>
                      <td className="align-middle text-center">
                        {getDate(user.createdAt)}
                      </td>
                      <td className="align-middle text-center">{user.role}</td>
                      <td
                        className="align-middle text-center"
                        style={{ minWidth: "150px" }}
                      >
                        {user.role !== "admin" && (
                          <>
                            {user?.expireAt ? (
                              <Button
                                variant="dark"
                                onClick={() =>
                                  dispatch({
                                    type: "CONFIRM_MODAL",
                                    payload: {
                                      show: true,
                                      message:
                                        "Bạn thực sự muốn hủy xóa người dùng này",
                                      cb: () => handleCancelDelete(user._id),
                                    },
                                  })
                                }
                              >
                                Hủy xóa{" "}
                                {isLoading && user._id === deleteId && (
                                  <Suspense>
                                    <Spinner animation="grow" size="sm" />
                                  </Suspense>
                                )}
                              </Button>
                            ) : (
                              <Button
                                variant="danger"
                                onClick={() =>
                                  dispatch({
                                    type: "CONFIRM_MODAL",
                                    payload: {
                                      show: true,
                                      message:
                                        "Bạn thực sự muốn xóa người dùng này chứ?",
                                      cb: () => handleDelete(user._id),
                                    },
                                  })
                                }
                              >
                                Xóa{" "}
                                {isLoading && user._id === deleteId && (
                                  <Suspense>
                                    <Spinner animation="grow" size="sm" />
                                  </Suspense>
                                )}
                              </Button>
                            )}
                          </>
                        )}

                        {user?.isActive ? (
                          <Button
                            variant="warning mx-3"
                            onClick={() =>
                              dispatch({
                                type: "CONFIRM_MODAL",
                                payload: {
                                  show: true,
                                  message:
                                    "Bạn thực sự muốn khóa tài khoản này chứ",
                                  cb: () => handleBlock(user._id),
                                },
                              })
                            }
                          >
                            Khóa tài khoản{" "}
                            {isLoading && user._id === blockId && (
                              <Suspense>
                                <Spinner animation="grow" size="sm" />
                              </Suspense>
                            )}
                          </Button>
                        ) : (
                          <Button
                            variant="info mx-3"
                            onClick={() =>
                              dispatch({
                                type: "CONFIRM_MODAL",
                                payload: {
                                  show: true,
                                  message:
                                    "Bạn thực sự muốn mở khóa tài khoản này chứ",
                                  cb: () => handleCancelBlock(user._id),
                                },
                              })
                            }
                          >
                            Mở khóa tài khoản{" "}
                            {isLoading && user._id === blockId && (
                              <Suspense>
                                <Spinner animation="grow" size="sm" />
                              </Suspense>
                            )}
                          </Button>
                        )}
                        <Link
                          href={`/profile/${user._id}`}
                          className="btn btn-success"
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
            page={page}
            setPage={setPage}
            count={count}
            limit={limit}
            size="sm"
          />
        </Col>
      </Row>
    </Layout>
  );
}
export default userManager;
