import { useState, useContext } from "react";
import { DataContext } from "@/context/AppProviders";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ConfirmModal() {
  const { state, dispatch } = useContext(DataContext);
  const { confirmModal } = state;

  return (
    <>
      <Modal
        show={confirmModal.show}
        onHide={() =>
          dispatch({
            type: "CONFIRM_MODAL",
            payload: { show: false, cb: null, message: "" },
          })
        }
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhậna</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmModal.message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={confirmModal.cb}>
            Xác nhận
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              dispatch({
                type: "CONFIRM_MODAL",
                payload: { show: false, message: "", cb: null },
              })
            }
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ConfirmModal;
