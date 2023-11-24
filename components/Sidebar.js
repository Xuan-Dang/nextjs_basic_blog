import { Col, Card, Form } from "react-bootstrap";
function Sidebar() {
  return (
    <Col xs={12} lg={4}>
      <Card className="border-0 shadow-sm">
        <Card.Header className="border-0">
          <Card.Title className="mb-0">Tìm kiếm</Card.Title>
        </Card.Header>
        <Card.Body>
            <Form>
                
            </Form>
        </Card.Body>
      </Card>
    </Col>
  );
}
export default Sidebar;
