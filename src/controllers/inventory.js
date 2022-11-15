import { message } from "antd";
import { useFetchToken } from "../hooks/useFetch";

export const getInventory = (values = "", token) => {
  return async (dispatch) => {
    const resp = await useFetchToken(
      "inventario_det/inven_zonas",
      values,
      token
    );
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
    const body = await resp.json();
    if (resp.ok) {
      message.success(body.message);
      return body.id;
    }
  };
};
