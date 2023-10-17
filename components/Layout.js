import React from "react";
import AppNavbar from "./AppNavbar";
import { Container } from "react-bootstrap";
import ToastMessage from "./ToastMessage";

function Layout({ children }) {
  return (
    <>
      <AppNavbar />
      <ToastMessage />
      <Container fluid>{children}</Container>
    </>
  );
}
export default Layout;
