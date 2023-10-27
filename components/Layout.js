import React from "react";
import AppNavbar from "./AppNavbar";
import { useState, useContext, lazy, Suspense } from "react";
import { DataContext } from "@/context/AppProviders";
import { Container } from "react-bootstrap";
const ToastMessage = lazy(() => import("./ToastMessage"))

function Layout({ children }) {
  const { state } = useContext(DataContext);
  return (
    <>
      <AppNavbar />
      {state.notify.message && (
        <Suspense>
          <ToastMessage />
        </Suspense>
      )}
      <Container fluid>{children}</Container>
    </>
  );
}
export default Layout;
