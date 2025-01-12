export const initState = {
  isLogin: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_LOGIN":
      return {
        ...state,
        isLogin: action.isLogin,
      };
    case "SET_USER_TYPE":
      return {
        ...state,
        isType: action.isType,
      };
    default:
      return state;
  }
};

export default reducer;
