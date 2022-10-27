import { message } from "antd";
import { useFetch } from "../hooks/useFetch";

export const getCategories = () => {
  return async (dispatch) => {
    const resp = await useFetch("category");
    console.log(resp);
    const body = await resp.json();
    if (resp.ok) {
      return body.data;
    }
  };
};

export const getZones = () => {
  return async (dispatch) => {
    const resp = await useFetch("zones");
    console.log(resp);
    const body = await resp.json();
    if (resp.ok) {
      return body.data;
    }
  };
};

export const saveCategories = (values) => {
  return async (dispatch) => {
    values.usuario = "yekog";
    const resp = await useFetch("category", { ...values }, "POST");
    const body = await resp.json();
    if (resp.ok) {
      return body.data;
    }
  };
};

export const saveZones = (values) => {
  return async (dispatch) => {
    values.usuario = "yekog";
    const resp = await useFetch("zones", { ...values }, "POST");
    const body = await resp.json();
    if (body.ok) {
      message.success(body.message);
      return body.data;
    }
  };
};

export const updateCategories = (values, id) => {
  return async (dispatch) => {
    values.usuario = "yekog";
    const resp = await useFetch("category/" + id, { ...values }, "PATCH");
    const body = await resp.json();
    if (body.ok) {
      message.success(body.message);
      return body.data;
    }
  };
};

export const updateZones = (values, id) => {
  return async (dispatch) => {
    values.usuario = "yekog";
    const resp = await useFetch("zones/" + id, { ...values }, "PATCH");
    const body = await resp.json();
    if (body.ok) {
      message.success(body.message);
      return body.data;
    }
  };
};

export const deleteCategories = (id) => {
  return async (dispatch) => {
    const resp = await useFetch("category/" + id, {}, "DELETE");
    const body = await resp.json();
    if (body.ok) {
      message.success(body.message);
      return body.id;
    }
  };
};

export const deleteZones = (id) => {
  return async (dispatch) => {
    const resp = await useFetch("zones/" + id, {}, "DELETE");
    const body = await resp.json();
    if (body.ok) {
      message.success(body.message);
      return body.id;
    }
  };
};
