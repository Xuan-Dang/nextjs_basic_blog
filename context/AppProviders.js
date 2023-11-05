import { createContext, useReducer, useEffect } from "react";
import reducers from "./AppReducers";
import { postData } from "../utils/fetchData";

export const DataContext = createContext();

export function AppProviders({ children }) {
  const initialState = {
    notify: { message: "", success: false },
    user: {},
    imageModal: { show: false },
    confirmModal: { message: "", cb: null, show: false },
  };

  const [state, dispatch] = useReducer(reducers, initialState);

  useEffect(() => {
    const controller = new AbortController();
    let refreshToken = null;
    if (localStorage.getItem("rf_token")) {
      refreshToken = JSON.parse(localStorage.getItem("rf_token"));
      postData(
        "/auth/refresh-token",
        { refreshToken },
        {
          timeout: 3600,
          headers: { "content-type": "application/x-www-form-urlencoded" },
          signal: controller.signal,
        }
      )
        .then((data) => {
          const { acessToken, ...user } = data.user;
          localStorage.setItem(
            "access_token",
            JSON.stringify(data.user.accessToken)
          );
          dispatch({ type: "USER", payload: { ...user } });
        })
        .catch((err) => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("rf_token");
          localStorage.removeItem("is_login");
          dispatch({
            type: "NOTIFY",
            payload: { message: err.message, success: false },
          });
        });
    }
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
}
