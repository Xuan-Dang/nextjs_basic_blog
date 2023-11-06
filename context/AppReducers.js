import ACTIONS from "./AppActions";
const reducers = (state, action) => {
  switch (action.type) {
    case ACTIONS.NOTIFY: {
      return { ...state, notify: action.payload };
    }
    case ACTIONS.USER: {
      return { ...state, user: action.payload };
    }
    case ACTIONS.IMAGE_MODAL: {
      return { ...state, imageModal: action.payload };
    }
    case ACTIONS.CONFIRM_MODAL: {
      return { ...state, confirmModal: action.payload };
    }
    case ACTIONS.IMAGE_DETAIL: {
      return { ...state, imageDetail: action.payload };
    }
    default:
      return state;
  }
};
export default reducers;
