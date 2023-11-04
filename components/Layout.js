import React from "react";
import AppNavbar from "./AppNavbar";
import { useState, useContext, lazy, Suspense, useEffect } from "react";
import { DataContext } from "@/context/AppProviders";
import { Container } from "react-bootstrap";
const ToastMessage = lazy(() => import("./ToastMessage"));
const ImageModal = lazy(() => import("./image/ImageModal"));

function Layout({ children }) {
  const { state } = useContext(DataContext);
  const { notify, imageModal } = state;
  return (
    <>
      <AppNavbar />
      {notify.message && (
        <Suspense>
          <ToastMessage />
        </Suspense>
      )}
      {imageModal.show && (
        <Suspense>
          <ImageModal />
        </Suspense>
      )}
      <Container fluid>{children}</Container>
    </>
  );
}
export default Layout;
