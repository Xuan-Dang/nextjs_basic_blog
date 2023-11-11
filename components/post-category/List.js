import { Col, Table, Button } from "react-bootstrap";
import { useEffect, useState, useContext, lazy, Suspense } from "react";
import { getData, postData, deleteData } from "../../utils/fetchData";
import { DataContext } from "@/context/AppProviders";
import Image from "next/image";
import Link from "next/link";
import { number } from "yup";
const Spinner = lazy(() => import("react-bootstrap/Spinner"));

function List({ parentNum, setIsUpdate, setCategory, isUpdate }) {
  const { state, dispatch } = useContext(DataContext);
  const { confirmModal } = state;
  const [postCategories, setPostCategories] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("desc");
  const [num, setNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    getData(`/post-category?sort=${sort}&limit=${limit}&page=${page}`, {
      timeout: 3600,
      signal: controller.signal,
    })
      .then((data) => {
        setPostCategories(data.postCategories);
      })
      .catch((err) => {
        dispatch({
          type: "NOTIFY",
          payload: { success: false, message: err.message },
        });
      });
    return () => {
      controller.abort();
    };
  }, [page, num, parentNum]);

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      const res = await deleteData(`/post-category/delete/${id}`, {
        timeout: 3600,
      });
      setIsLoading(false);
      setNum((prev) => prev + 1);
      dispatch({
        type: "CONFIRM_MODAL",
        payload: {
          show: false,
          message: "",
          cb: null,
        },
      });
      dispatch({
        type: "NOTIFY",
        payload: { success: true, message: res.message },
      });
    } catch (err) {
      setIsLoading(false);
      dispatch({
        type: "NOTIFY",
        payload: { success: false, message: err.message },
      });
    }
  };
  return (
    <Col xs={12} md={8}>
      <h3 className="fs-5">Danh sách danh mục bài viết</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th className="align-middle text-center">#</th>
            <th className="align-middle text-center">Tên danh mục</th>
            <th className="align-middle text-center">Url</th>
            <th className="align-middle text-center">Hình ảnh</th>
            <th className="align-middle text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {postCategories.map((category, index) => {
            return (
              <tr key={category._id}>
                <td className="align-middle text-center">{index + 1}</td>
                <td className="align-middle">{category.name}</td>
                <td className="align-middle">{category.url}</td>
                <td>
                  {category?.image?.url ? (
                    <div
                      className="position-relative text-center"
                      style={{ width: "100%", height: "100px" }}
                    >
                      <Image
                        src={category.image.url}
                        alt={
                          category?.image?.alt
                            ? category.image.alt
                            : `Post category image`
                        }
                        fill
                        title={category.image.title}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ) : (
                    "Không có hình ảnh"
                  )}
                </td>
                <td className="align-middle text-center">
                  {isUpdate ? (
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => {
                        setIsUpdate(false), setCategory({});
                      }}
                    >
                      Hủy
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      className="me-2"
                      onClick={() => {
                        setIsUpdate(true), setCategory({ ...category });
                      }}
                    >
                      Sửa
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    onClick={() =>
                      dispatch({
                        type: "CONFIRM_MODAL",
                        payload: {
                          show: true,
                          message:
                            "Bạn thực sự muốn xóa danh mục bài viết này chứ?",
                          cb: () => handleDelete(category._id),
                        },
                      })
                    }
                  >
                    Xóa
                    {isLoading && (
                      <Suspense>
                        <Spinner size="sm" animation="grow" />
                      </Suspense>
                    )}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Col>
  );
}
export default List;
