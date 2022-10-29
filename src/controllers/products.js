import { message } from "antd";
import { useFetch } from "../hooks/useFetch";

export const getProducts = (values = "") => {
  return async (dispatch) => {
    const resp = await useFetch("products/" + values);
    const body = await resp.json();
    if (resp.ok) {
      return body.data;
    }
  };
};

export const saveProducts = (values) => {
  return async (dispatch) => {
    values.usuario = "yekog";
    const resp = await useFetch("products", { ...values }, "POST");
    const body = await resp.json();
    if (resp.ok) {
      message.success(body.message);
      return body.data;
    }
  };
};

export const updateProducts = (values, id) => {
  return async (dispatch) => {
    values.usuario = "yekog";
    const resp = await useFetch("products/" + id, { ...values }, "PATCH");
    const body = await resp.json();
    console.log(body);
    if (resp.ok) {
      message.success(body.message);
      return body.data;
    }
  };
};

export const deleteProducts = (id) => {
  return async (dispatch) => {
    const resp = await useFetch("products/" + id, {}, "DELETE");
    const body = await resp.json();
    if (resp.ok) {
      message.success(body.message);
      return body.id;
    }
  };
};
