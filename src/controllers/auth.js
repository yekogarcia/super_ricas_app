import { message } from "antd";
import { useFetch, useFetchToken } from "../hooks/useFetch";
import { types } from "../types/types";

export const getUser = (values = "", token, id) => {
  return async (dispatch) => {
    const resp = await useFetchToken("users/" + id, values, token);
    const body = await resp.json();
    if (resp.ok) {
      return body.data;
    }
  };
};

export const initLogIn = (user) => {
  return async (dispatch) => {
    const res = await useFetch("login", { ...user }, "POST");
    const body = await res.json();

    if (body.ok) {
      body.data.logged = true;
      dispatch(starSesion(body.data));
      window.localStorage.setItem("token", body.data.token);
      window.sessionStorage.setItem("userSession", JSON.stringify(body.data));
      return true;
    } else {
      message.error(body.message);
      return false;
    }
  };
};

const starSesion = (user) => ({
  type: types.authLogin,
  payload: user,
});

const SingOff = () => ({ type: types.authLogout });

export const checkLogIn = (user) => {
  return async (dispatch) => {
    dispatch(starSesion(user));
  };
};

export const handleLogout = () => {
  return (dispatch) => {
    window.sessionStorage.clear();
    window.localStorage.clear();
    dispatch(SingOff());
  };
};

export const checkSession = (status) => {
  return (dispatch) => {
    if (status === 401) {
      dispatch(handleLogout());
      message.error("Session invalida, inicie session de nuevo por favor");
    }
  };
};


export const sendEmailRecovery = (email) => {
  return async (dispatch) => {
    console.log(email)
    const res = await useFetch("login/recovery", { ...email }, "POST");
    const body = await res.json();
    if (body.ok) {
      message.success(body.message);
      return true;
    } else {
      message.error(body.message);
      return false;
    }
  };
};

export const sendNewPassRecovery = (pr) => {
  return async (dispatch) => {
    console.log(pr)
    const res = await useFetch("login/change-password", { ...pr }, "POST");
    const body = await res.json();
    console.log(body)
    if (body.ok) {
      message.success(body.message);
      return true;
    } else {
      message.error(body.message);
      return false;
    }
  };
};


