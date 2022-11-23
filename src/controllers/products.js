import { message } from "antd";
import { useFetchToken } from "../hooks/useFetch";
import { checkSession } from "./auth";

export const getProducts = (values = "", token) => {
  return async (dispatch) => {
    console.log("prueb");
    const resp = await useFetchToken("products/" + values, {}, token);
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      return body.data;
    }
  };
};

export const getProductsId = (values = "", token) => {
  return async (dispatch) => {
    const resp = await useFetchToken("products/id/" + values, {}, token);
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      return body.data;
    }
  };
};

export const getProductsConcat = (values = "", token) => {
  return async (dispatch) => {
    const resp = await useFetchToken(
      "products/concat/produc/" + values,
      {},
      token
    );
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      return body.data;
    }
  };
};

export const saveProducts = (values, token) => {
  return async (dispatch) => {
    values.usuario = "yekog";
    const resp = await useFetchToken("products", { ...values }, token, "POST");
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      message.success(body.message);
      return body.data;
    }
  };
};

export const updateProducts = (values, id, token) => {
  return async (dispatch) => {
    values.usuario = "yekog";
    const resp = await useFetchToken(
      "products/" + id,
      { ...values },
      token,
      "PATCH"
    );
    const body = await resp.json();
    console.log(body);
    if (resp.ok) {
      message.success(body.message);
      return body.data;
    }
  };
};

export const deleteProducts = (id, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken("products/" + id, {}, token, "DELETE");
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      message.success(body.message);
      return body.id;
    }
  };
};
