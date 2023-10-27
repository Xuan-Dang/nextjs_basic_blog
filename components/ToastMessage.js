import { useEffect, useContext, useState } from "react";
import { DataContext } from "@/context/AppProviders";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ToastMessage() {
  const { state, dispatch } = useContext(DataContext);
  const [toastOption, setToastOption] = useState({
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

  useEffect(() => {
    if (state.notify.success) {
      toast.success(state.notify.message, toastOption);
    } else {
      toast.error(state.notify.message, toastOption);
    }
    setTimeout(() => {
      dispatch({ type: "NOTIFY", payload: { message: "", success: false } });
    }, 5000);
  }, []);

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
export default ToastMessage;
