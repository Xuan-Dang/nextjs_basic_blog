import { Form, Modal, Button, Row, Col } from "react-bootstrap";
import { useEffect, useState, useContext, lazy, Suspense } from "react";
import { DataContext } from "@/context/AppProviders";
import Image from "next/image";
import { postData, getData, deleteData } from "../../utils/fetchData";
const Spinner = lazy(() => import("react-bootstrap/Spinner"));

function ImageModal() {
  const { state, dispatch } = useContext(DataContext);
  const { imageModal, user, confirmModal } = state;
  const [images, setImages] = useState([]);
  const [num, setNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const hideImageModal = () => {
    dispatch({ type: "IMAGE_MODAL", payload: { show: false } });
  };

  const uploadImageHandleChange = async (e) => {
    try {
      setIsLoading(true);
      const files = e.target.files;
      const fileArray = Array.from(files);
      const formData = new FormData();

      fileArray.forEach((file) => {
        formData.append("images", file);
      });

      const res = await postData("/image/upload", formData, {
        timeout: 10000,
        headers: {
          "content-type": "multipart/form-data",
        },
      });
      setIsLoading(false);
      setNum((prev) => {
        return prev + 1;
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

  useEffect(() => {
    const controller = new AbortController();
    getData("/image", {
      signal: controller.signal,
      timeout: 10000,
    })
      .then((data) => {
        setImages(data.images);
        console.log(data);
      })
      .catch((err) =>
        dispatch({
          type: "NOTIFY",
          payload: { success: false, message: err.message },
        })
      );
    return () => {
      controller.abort();
    };
  }, [num]);

  const handleDeleteImage = async (id) => {
    try {
      const res = await deleteData(`/image/delete/${id}`, {
        timeout: 10000,
      });
      setNum((prev) => prev + 1);
      dispatch({
        type: "CONFIRM_MODAL",
        payload: { message: "", show: false, cb: null },
      });
      dispatch({
        type: "NOTIFY",
        payload: { message: res.message, success: true },
      });
    } catch (err) {
      return dispatch({
        type: "NOTIFY",
        payload: { success: false, message: err.message },
      });
    }
  };

  return (
    <Modal
      show={imageModal.show}
      onHide={() => hideImageModal()}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Thư viện ảnh
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="overflow-y-scroll">
        <Row>
          <Col xs={6} md={4} lg={3} className="border-1 border">
            <Form>
              <Form.Group className="mb-3" controlId="image">
                <Form.Label
                  style={{
                    minHeight: "150px",
                    width: "100%",
                    cursor: "pointer",
                  }}
                  className="d-flex align-items-center justify-content-center"
                >
                  {isLoading ? (
                    <Suspense>
                      <Spinner animation="grow" />
                    </Suspense>
                  ) : (
                    <i
                      class="bi bi-upload"
                      style={{ fontSize: "clamp(18px, 15vw, 32px)" }}
                    ></i>
                  )}
                </Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  hidden
                  multiple={user.role === "admin"}
                  onChange={(e) => uploadImageHandleChange(e)}
                />
              </Form.Group>
            </Form>
          </Col>
          {images &&
            images.map((image) => (
              <Col
                xs={6}
                md={4}
                lg={3}
                className="position-relative image-item-col"
                style={{ minHeight: "150px" }}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  title={image.title}
                  fill
                  key={image._id}
                  style={{ objectFit: "cover" }}
                />
                <div
                  className="image-item-buttons d-flex align-items-center position-absolute bg-dark justify-content-evenly"
                  style={{ top: "0", left: "0", right: "0" }}
                >
                  <Button
                    variant="outline-light"
                    size="md"
                    title="Chọn ảnh này"
                  >
                    <i class="bi bi-check2-circle"></i>
                  </Button>
                  <Button
                    variant="outline-light"
                    size="md"
                    title="Xóa ảnh này"
                    onClick={() =>
                      dispatch({
                        type: "CONFIRM_MODAL",
                        payload: {
                          show: true,
                          message: "Bạn thực sự muốn xóa ảnh này chứ",
                          cb: () => handleDeleteImage(image._id),
                        },
                      })
                    }
                  >
                    <i class="bi bi-trash"></i>
                  </Button>
                  {user.role === "admin" && (
                    <Button
                      variant="outline-light"
                      size="md"
                      title="Chi tiết ảnh"
                    >
                      <i class="bi bi-eye"></i>
                    </Button>
                  )}
                </div>
              </Col>
            ))}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => hideImageModal()}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default ImageModal;
