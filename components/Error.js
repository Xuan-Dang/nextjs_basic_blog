import { Card } from "react-bootstrap";

function Error({ code, message }) {
  return (
    <Card style={{height: "100vh"}} className="border-0 rounded-0">
      <Card.Body className="d-flex align-items-center flex-column mt-5 pt-5">
        <Card.Title className="fs-1">{code}</Card.Title>
        <Card.Text className="fs-3">{message}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default Error;
