import { createContext, useReducer, useEffect } from "react";
import reducers from "./AppReducers";
import { postData } from "../utils/fetchData";

export const DataContext = createContext();

export function AppProviders({ children }) {
  const initialState = {
    notify: { message: "", success: false },
    user: {},
  };
  
  const [state, dispatch] = useReducer(reducers, initialState);

  useEffect(() => {
    let refreshToken = null;
    if (localStorage.getItem("rf_token")) {
      refreshToken = JSON.parse(localStorage.getItem("rf_token"));
    }
    postData(
      "/auth/refresh-token",
      { refreshToken },
      {
        timeout: 3600,
        headers: { "content-type": "application/x-www-form-urlencoded" },
      }
    )
      .then((data) => {
        dispatch({ type: "USER", payload: { ...data.user } });
      })
      .catch((err) => {
        dispatch({
          type: "NOTIFY",
          payload: { message: err.message, success: false },
        });
      });
  }, []);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
}
