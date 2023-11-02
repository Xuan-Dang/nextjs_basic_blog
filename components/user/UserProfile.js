import { Tab, Form, Row, Col, Button } from "react-bootstrap";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

function UserProfile({ name }) {
  return (
    <Tab.Pane eventKey={name}>
      <h2 className="fs-4 mb-3">Hồ sơ</h2>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="fullName">
            <Form.Label>Ảnh đại diện</Form.Label>
            <Form.Control type="file" name="avatar" />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="fullName">
            <Form.Label>Họ và tên</Form.Label>
            <Form.Control type="text" name="fullName" />
          </Form.Group>

          <Form.Group as={Col} controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" name="email" readOnly />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="password">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control type="password" name="password" />
          </Form.Group>

          <Form.Group as={Col} controlId="confirmPassword">
            <Form.Label>Xác nhận mật khẩu</Form.Label>
            <Form.Control type="password" name="confirmPassword" />
          </Form.Group>
        </Row>
        <Form.Group as={Col}>
          <Button>Cập nhật hồ sơ</Button>
        </Form.Group>
      </Form>
    </Tab.Pane>
  );
}
export default UserProfile;
