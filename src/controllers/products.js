import { message } from "antd";
import { useFetchToken } from "../hooks/useFetch";
import { checkSession } from "./auth";

export const getProducts = (values = "", token) => {
  return async (dispatch) => {
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

export const getReturns = (id = "",values, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken("returns/filters/" + id, {...values}, token, "POST");
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      return body.data;
    }
  };
};


export const saveReturns = (values, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken("returns", { ...values }, token, "POST");
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      message.success(body.message);
      return body.data;
    }
  };
};

export const updateReturns = (values, id, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken(
      "returns/" + id,
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

export const deleteReturns = (id, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken("returns/" + id, {}, token, "DELETE");
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      message.success(body.message);
      return body.id;
    }
  };
};

export const applyDevolutions = (values, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken("returns/apply_return", { ...values }, token, "POST");
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      message.success(body.message);
      return body.data;
    }
  };
};
