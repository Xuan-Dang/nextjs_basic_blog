import { Row, Modal, Button, Col, Form } from "react-bootstrap";
import { useState, useEffect, useContext, lazy, Suspense } from "react";
import { DataContext } from "@/context/AppProviders";
import Image from "next/image";
import { putData, getData } from "../../utils/fetchData";
const Spinner = lazy(() => import("react-bootstrap/Spinner"));

function ImageDetail() {
  const { state, dispatch } = useContext(DataContext);
  const { imageDetail } = state;
  const [image, setImage] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [num, setNum] = useState(0);

  const onHide = () => {
    dispatch({
      type: "IMAGE_DETAIL",
      payload: {
        show: false,
        image: {},
      },
    });
  };

  useEffect(() => {
    const controller = new AbortController();
    getData(`/image/${imageDetail.image}`, {
      timeout: 10000,
      signal: controller.signal,
    })
      .then((data) => {
        console.log("data: ", data);
        const { image } = data;
        const d = new Date(image.createdAt);
        setImage((prev) => ({
          ...prev,
          ...image,
          createdAt: d.toLocaleDateString(),
        }));
        setNum((prev) => prev + 1);
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
  }, [imageDetail]);

  const handleChange = (e) => {
    setImage((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const res = await putData(
        `/image/update/${image._id}`,
        { ...image },
        {
          timeout: 10000,
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        }
      );
      setIsLoading(false);
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
        payload: {
          success: false,
          message: err.message,
        },
      });
    }
  };
  return (
    <Modal
      show={imageDetail?.show}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={onHide}
    >
      <Modal.Body className="py-1">
        <Row>
          <Col
            xs={12}
            md={6}
            className="position-relative p-0"
            style={{ minHeight: "150px" }}
          >
            <Image
              fill
              src={image?.url}
              alt={image.alt ? image.alt : `Hình ảnh ${image._id}`}
              style={{ objectFit: "cover" }}
            />
          </Col>
          <Col xs={12} md={6}>
            <Form>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Thẻ title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={image?.title}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="alt">
                <Form.Label>Thẻ alt</Form.Label>
                <Form.Control
                  type="text"
                  name="alt"
                  value={image?.alt}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <p className="my-2 p-0">
            <span>Ngày tải lên: </span>
            <span>{image?.createdAt}</span>
          </p>
          {console.log(image)}
          <p className="mb-0 p-0">
            <span>Người tải lên: </span>
            <span>{image?.user?.fullName}</span>
          </p>
        </Row>
      </Modal.Body>
      <Modal.Footer className="p-2">
        <Button variant="dark" onClick={() => handleUpdate()}>
          Cập nhật
          {isLoading && (
            <Suspense>
              <Spinner animation="grow" size="sm" />
            </Suspense>
          )}
        </Button>
        <Button variant="danger" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ImageDetail;
