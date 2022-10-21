import { types } from "../types/types";

export const initLogIn = (user) => ({
  type: types.authLogin,
  payload: user,
});

export const checkLogIn = () => {
  const user = {
    id: 1,
    name: "yekogarcia",
    logged: true,
  };
  return async (dispatch) => {
    dispatch(initLogIn(user));
  };
};
