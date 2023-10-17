import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import InputGroup from "react-bootstrap/InputGroup";
import Offcanvas from "react-bootstrap/Offcanvas";
import NavDropdown from 'react-bootstrap/NavDropdown';
import Link from "next/link";
import { useRouter } from "next/router";

function AppNavbar() {
  const route = useRouter();
  const isActiveLink = (url) => {
    const isActive = route.asPath === url ? "active" : "";
    return isActive;
  }
  return (
    <>
      <Navbar key="lg" expand="lg" className="bg-body-tertiary mb-3">
        <Container fluid>
          <Link className="navbar-brand" href="/">
            Ecommerce Basic
          </Link>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                Ecommerce Basic
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Link className={`nav-link ${isActiveLink("/")}`} href="/">
                  Home
                </Link>
                <Link className={`nav-link ${isActiveLink("/product")}`} href="/product">
                  Sản phẩm
                </Link>
                <Link className={`nav-link ${isActiveLink("/login")}`} href="/login">
                  Đăng nhập
                </Link>
                {/* <NavDropdown
                  title="User"
                  id={`offcanvasNavbarDropdown-expand-lg`}
                >
                  <Link className="dropdown-item" href="#action3">Action</Link>
                  <Link className="dropdown-item" href="#action4">
                    Another action
                  </Link>
                  <NavDropdown.Divider />
                  <Link className="dropdown-item" href="#action5">
                    Something else here
                  </Link>
                </NavDropdown> */}
              </Nav>
              {/* <Form className="d-flex">
                <InputGroup>
                  <Form.Control
                    placeholder="Recipient's username"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                  />
                  <Button variant="secondary" id="button-addon2">
                    Button
                  </Button>
                </InputGroup>
              </Form> */}
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}
export default AppNavbar;
