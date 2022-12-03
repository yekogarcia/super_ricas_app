import { message } from "antd";
import { useFetchToken } from "../hooks/useFetch";
import { checkSession } from "./auth";

export const getInventory = (values = "", token) => {
  return async (dispatch) => {
    const resp = await useFetchToken(
      "inventario_det/inven_zonas",
      values,
      token
    );
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      return body.data;
    }
  };
};
export const getInventoryDet = (values = "", token, id) => {
  return async (dispatch) => {
    const resp = await useFetchToken(
      "inventario_det/inven_zonas_det/" + id,
      values,
      token
    );
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      return body.data;
    }
  };
};

export const saveInventory = (values, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken(
      "inventario_det",
      { ...values },
      token,
      "POST"
    );
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      message.success(body.message);
      return body.data;
    }
  };
};

export const updateInventory = (values, id, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken(
      "inventario_det/" + id,
      { ...values },
      token,
      "PATCH"
    );
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      message.success(body.message);
      return body.data;
    }
  };
};

export const deleteRowInventory = (id, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken(
      "inventario_det/" + id,
      {},
      token,
      "DELETE"
    );
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      message.success(body.message);
      return body.id;
    }
  };
};

export const deleteRowInventoryDetId = (id, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken(
      "inventario_det/inven_zonas_det/" + id,
      {},
      token,
      "DELETE"
    );
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      message.success(body.message);
      return body.id;
    }
  };
};

export const savePayments = (values, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken("payments", { ...values }, token, "POST");
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    console.log(body);
    if (resp.ok) {
      message.success(body.message);
      return body.ok;
    }
  };
};

export const getPayments = (token, id) => {
  return async (dispatch) => {
    const resp = await useFetchToken("payments/" + id, "", token);
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      return body.data;
    }
  };
};

export const deletePayments = (token, id) => {
  return async (dispatch) => {
    const resp = await useFetchToken("payments/" + id, {}, token, "DELETE");
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    console.log(body);
    if (resp.ok) {
      message.success(body.message);
      return body.id;
    }
  };
};
