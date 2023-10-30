import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useEffect } from "react";
import { Col } from "react-bootstrap";

function ProductItem({ productItem }) {
  useEffect(() => {
    console.log(productItem);
  }, []);
  return (
    <Col xs={6} md={4}>
      <Card>
        <Card.Img variant="top" src={productItem.featureImage} />
        <Card.Body>
          <Card.Title>{productItem.name}</Card.Title>
          <Card.Text>
            {productItem.minPrice ? (
              <>
                <del>{productItem.maxPrice}</del>
                <span className="text-danger ms-2">{productItem.minPrice}</span>
              </>
            ) : (
              <span>{productItem.maxPrice}</span>
            )}
          </Card.Text>
          <Button variant="primary">Go somewhere</Button>
        </Card.Body>
      </Card>
    </Col>
  );
}
export default ProductItem;
