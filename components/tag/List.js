import { Col, Table, Button, Form, Row } from "react-bootstrap";
import { useEffect, useState, useContext, lazy, Suspense } from "react";
import { getData, postData, deleteData } from "../../utils/fetchData";
import { DataContext } from "@/context/AppProviders";
import Pagina from "../Pagination";
const Spinner = lazy(() => import("react-bootstrap/Spinner"));

function List({ parentNum, setIsUpdate, setTag, isUpdate, tagToUpdate }) {
  const { state, dispatch } = useContext(DataContext);
  const [tags, setTags] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("desc");
  const [num, setNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [tagToDelete, setTagToDelete] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getData(`/tag?sort=${sort}&limit=${limit}&page=${page}`, {
      timeout: 3600,
      signal: controller.signal,
    })
      .then((data) => {
        setTags(data.tags);
        setCount(data.count);
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
  }, [page, num, parentNum, sort]);

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
      const res = await deleteData(`/tag/delete/${id}`, {
        timeout: 3600,
      });
      setIsLoading(false);
      setNum((prev) => prev + 1);
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
      <Row className="my-3">
        <Col xs={12} md={6} lg={4}>
          <Form.Select
            className="ms-auto"
            name="sort"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sắp xếp</option>
            <option value="desc">Ngày tạo: Mới nhất</option>
            <option value="asc">Ngày tạo: Cũ nhất</option>
          </Form.Select>
        </Col>
      </Row>
      <Table striped bordered responsive="xl">
        <thead>
          <tr>
            <th className="align-middle text-center">#</th>
            <th className="align-middle text-center">Tên danh mục</th>
            <th className="align-middle text-center">Url</th>
            <th className="align-middle text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag, index) => {
            return (
              <tr key={tag._id}>
                <td className="align-middle text-center">{index + 1}</td>
                <td className="align-middle">{tag.name}</td>
                <td className="align-middle">{tag.url}</td>
                <td className="align-middle text-center">
                  {isUpdate && tag?._id === tagToUpdate?._id ? (
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => {
                        setIsUpdate(false), setTag({});
                      }}
                    >
                      Hủy
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      className="me-2"
                      onClick={() => {
                        setIsUpdate(true), setTag({ ...tag });
                      }}
                    >
                      Sửa
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    onClick={() => {
                      setTagToDelete(tag._id);
                      dispatch({
                        type: "CONFIRM_MODAL",
                        payload: {
                          show: true,
                          message: "Bạn thực sự muốn xóa tag này chứ?",
                          cb: () => handleDelete(tag._id),
                        },
                      });
                    }}
                  >
                    Xóa
                    {isLoading && tagToDelete === tag._id && (
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
      {count > 0 && (
        <Pagina
          count={count}
          size={"md"}
          limit={limit}
          page={page}
          setPage={setPage}
        />
      )}
    </Col>
  );
}
export default List;
