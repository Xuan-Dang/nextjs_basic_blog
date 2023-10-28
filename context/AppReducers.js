import ACTIONS from "./AppActions";
const reducers = (state, action) => {
  switch (action.type) {
    case ACTIONS.NOTIFY: {
      return { ...state, notify: action.payload };
    }
    case ACTIONS.USER: {
      return { ...state, user: action.payload };
    }
    default:
      return state;
  }
};
export default reducers;
