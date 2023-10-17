import {createContext, useReducer} from "react";
import reducers from "./AppReducers";

export const DataContext = createContext();

export function AppProviders({children}) {
    const initialState = {
        notify: {message: "", success: false, active: false},
    }
    const [state, dispatch] = useReducer(reducers, initialState);
    return (
        <DataContext.Provider value={{state, dispatch}}>
            {children}
        </DataContext.Provider>
    )
}