import { useEffect, useContext } from "react";
import { DataContext } from "@/context/AppProviders";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ToastMessage() {
  const { state, dispatch } = useContext(DataContext);
  const successNotify = () => {
    return toast.success(state.notify.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  const errorNotify = () => {
    return toast.error(state.noify.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  useEffect(() => {
    if(state.notify.active) {
        if(state.notify.success) {
            successNotify()
        }else {
            errorNotify()
        }
        dispatch({type: "NOTIFY", payload: {message: "", success: false, active: false}});
    }
  }, [state])
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
