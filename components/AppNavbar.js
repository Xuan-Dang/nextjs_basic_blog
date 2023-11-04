import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import Dropdown from "react-bootstrap/Dropdown";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { DataContext } from "@/context/AppProviders";

function AppNavbar() {
  const { state, dispatch } = useContext(DataContext);
  const { user } = state;

  const route = useRouter();

  const isActiveLink = (url) => {
    const isActive = route.asPath === url ? "active" : "";
    return isActive;
  };

  const handleLogout = () => {
    dispatch({ type: "USER", payload: {} });
    localStorage.removeItem("access_token");
    localStorage.removeItem("rf_token");
    localStorage.removeItem("is_login");
    route.push("/login");
  };
  return (
    <>
      <Navbar key="lg" expand="lg" className="bg-body-tertiary mb-3">
        <Container fluid>
          <Link className="navbar-brand" href="/">
            Nextjs Basic Blog
          </Link>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-lg`}
            aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                Nextjs Basic Blog
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Link className={`nav-link ${isActiveLink("/")}`} href="/">
                  Home
                </Link>
                <Link
                  className={`nav-link ${isActiveLink("/product")}`}
                  href="/post"
                >
                  Bài viết
                </Link>

                {Object.keys(user).length === 0 ? (
                  <Link
                    className={`nav-link ${isActiveLink("/login")}`}
                    href="/login"
                  >
                    Đăng nhập
                  </Link>
                ) : (
                  <Dropdown data-bs-theme="transparent">
                    <Dropdown.Toggle
                      id="user-dropdown"
                      variant="transparent"
                      className="border-0 px-2 py-1 d-flex align-items-center"
                    >
                      <span
                        className="d-block"
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <Image
                          src={user.avatar}
                          fill
                          alt={`${user.fullName} avatar`}
                          style={{ objectFit: "cover" }}
                        />{" "}
                      </span>
                      <span className="d-block ms-2">{user.fullName}</span>
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ left: "unset", right: "0" }}>
                      <Link
                        className="dropdown-item"
                        href={`/profile/${user._id}`}
                      >
                        Hồ sơ
                      </Link>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>
                        Đăng Xuất
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}
export default AppNavbar;
