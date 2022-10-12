import { types } from "../types/types";

export const initLogIn = (user) => ({
  type: types.authLogin,
  payload: user,
});
