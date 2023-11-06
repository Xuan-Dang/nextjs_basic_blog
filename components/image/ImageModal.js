import { Form, Modal, Button, Row, Col } from "react-bootstrap";
import { useEffect, useState, useContext, lazy, Suspense } from "react";
import { DataContext } from "@/context/AppProviders";
import Image from "next/image";
import { postData, getData, deleteData } from "../../utils/fetchData";
const Spinner = lazy(() => import("react-bootstrap/Spinner"));
const ImageDetail = lazy(() => import("./ImageDetail"));

function ImageModal() {
  const { state, dispatch } = useContext(DataContext);
  const { imageModal, user, confirmModal, imageDetail } = state;
  const [images, setImages] = useState([]);
  const [num, setNum] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectMutiple, setSelectMultiple] = useState(false);
  const [checkedImage, setCheckedImage] = useState([]);

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

  const handleCheckSingle = (id) => {
    images.map((image) => {
      if (image._id === id) {
        image.checked ? (image.checked = false) : (image.checked = true);
      } else {
        image.checked && (image.checked = false);
      }
    });
    const checkedImage = images.filter((image) => image.checked);
    setCheckedImage([...checkedImage]);
    setImages([...images]);
  };

  const handleCheckMultiple = (id) => {
    images.map((image) => {
      if (image._id === id) {
        image.checked ? (image.checked = false) : (image.checked = true);
      }
    });
    const checkedImage = images.filter((image) => image.checked);
    setCheckedImage([...checkedImage]);
    setImages([...images]);
  };

  const handleConfirm = () => {
    if (imageModal.type === "USER_AVATAR") {
      dispatch({
        type: "USER",
        payload: {
          ...user,
          avatar: checkedImage[0]?.url
            ? checkedImage[0].url
            : "/images/default-user-avatar.png",
        },
      });
      hideImageModal();
      return;
    }
  };

  const handleDeleteMultiple = async () => {
    checkedImage.length === 0 &&
      dispatch({
        type: "NOTIFY",
        payload: { success: false, message: "Không có ảnh nào được chọn" },
      });
    const checkedImageId = checkedImage.map((image) => image._id);
    try {
      const res = await deleteData(
        `/image/delete/${checkedImageId.toString()}`,
        {
          timeout: 10000,
        }
      );
      setNum((prev) => prev + 1);
      setCheckedImage([]);
      setSelectMultiple(false);
      dispatch({
        type: "CONFIRM_MODAL",
        payload: { message: "", cb: null, show: false },
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
        <Row className="mb-3 p-0">
          <Col className="p-0">
            <Button
              variant="outline-danger"
              active={isSelectMutiple}
              onClick={() => {
                setSelectMultiple((prev) => !prev);
                images.map((image) => (image.checked = false));
                setImages([...images]);
                setCheckedImage([]);
              }}
              className="me-3"
            >
              Chọn nhiều
            </Button>
            <Button
              variant="outline-warning"
              onClick={() =>
                dispatch({
                  type: "CONFIRM_MODAL",
                  payload: {
                    message: `Bạn chắc chắn muốn xóa ${checkedImage.length} ảnh chứ`,
                    show: true,
                    cb: () => handleDeleteMultiple(),
                  },
                })
              }
              disabled={checkedImage.length === 0}
            >
              Xóa ảnh đã chọn ({checkedImage.length} ảnh)
            </Button>
          </Col>
        </Row>
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
                  alt={image.alt ? image.alt : `Hình ảnh ${image._id}`}
                  title={image.title ? image.title : `Hình ảnh ${image._id}`}
                  fill
                  key={image._id}
                  style={{ objectFit: "cover" }}
                />
                <div
                  className="image-item-buttons d-flex align-items-center position-absolute bg-dark justify-content-evenly"
                  style={{ top: "0", left: "0", right: "0" }}
                >
                  <Button
                    variant={image.checked ? "success" : "outline-light"}
                    size="md"
                    title="Chọn ảnh này"
                    onClick={() =>
                      isSelectMutiple
                        ? handleCheckMultiple(image._id)
                        : handleCheckSingle(image._id)
                    }
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
                      onClick={() =>
                        dispatch({
                          type: "IMAGE_DETAIL",
                          payload: { show: true, image: image._id },
                        })
                      }
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
        <Button
          onClick={() => handleConfirm()}
          disabled={imageModal.type === "USER_AVATAR" && isSelectMutiple}
        >
          Xác nhận
        </Button>
      </Modal.Footer>
      {imageDetail?.show && (
        <Suspense>
          <ImageDetail />
        </Suspense>
      )}
    </Modal>
  );
}
export default ImageModal;
