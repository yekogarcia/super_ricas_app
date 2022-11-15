import { message } from "antd";
import { useFetch } from "../hooks/useFetch";
import { types } from "../types/types";

export const initLogIn = (user) => {
  return async (dispatch) => {
    const res = await useFetch("login", { ...user }, "POST");
    const body = await res.json();

    if (body.ok) {
      body.data.logged = true;
      dispatch(starSesion(body.data));
    } else {
      message.success(body.message);
      return false;
    }
    console.log(body);
  };
};

const starSesion = (user) => ({
  type: types.authLogin,
  payload: user,
});

export const checkLogIn = (user) => {
  return async (dispatch) => {
    dispatch(starSesion(user));
  };
};
