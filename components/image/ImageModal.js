import { Form, Modal, Button, Row, Col } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { DataContext } from "@/context/AppProviders";
import Image from "next/image";
import { postData, getData } from "../../utils/fetchData";

function ImageModal() {
  const { state, dispatch } = useContext(DataContext);
  const { imageModal, user } = state;
  const [images, setImages] = useState([]);

  const hideImageModal = () => {
    dispatch({ type: "IMAGE_MODAL", payload: { show: false } });
  };

  const uploadImageHandleChange = async (e) => {
    try {
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

      dispatch({
        type: "NOTIFY",
        oayload: { success: true, message: res.message },
      });
    } catch (err) {
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
  }, []);

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
                <Form.Label style={{ minHeight: "150px" }}>Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  hidden
                  multiple
                  onChange={(e) => uploadImageHandleChange(e)}
                />
              </Form.Group>
            </Form>
          </Col>
          {console.log(images)}
          {images &&
            images.map((image) => (
              <Col
                xs={6}
                md={4}
                lg={3}
                className="position-relative"
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
