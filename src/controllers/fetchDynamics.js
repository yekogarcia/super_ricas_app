import { message } from "antd";
import { useFetch, useFetchToken } from "../hooks/useFetch";
import { checkSession } from "./auth";

export const getCategories = (values = "") => {
  return async (dispatch) => {
    const resp = await useFetch("category/" + values);
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      return body.data;
    }
  };
};

export const getZones = (values = "", token) => {
  return async (dispatch) => {
    const resp = await useFetchToken("zones/" + values, {}, token);
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      return body.data;
    }
  };
};

export const saveCategories = (values, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken("category", { ...values }, token, "POST");
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (resp.ok) {
      message.success(body.message);
      return body.data;
    }
  };
};

export const saveZones = (values, token) => {
  return async (dispatch) => {
    console.log(values);
    const resp = await useFetchToken("zones", { ...values }, token, "POST");
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (body.ok) {
      message.success(body.message);
      return body.data;
    }
  };
};

export const updateCategories = (values, id, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken(
      "category/" + id,
      { ...values },
      token,
      "PATCH"
    );
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (body.ok) {
      message.success(body.message);
      return body.data;
    }
  };
};

export const updateZones = (values, id, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken(
      "zones/" + id,
      { ...values },
      token,
      "PATCH"
    );
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (body.ok) {
      message.success(body.message);
      return body.data;
    }
  };
};

export const deleteCategories = (id, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken("category/" + id, {}, token, "DELETE");
    // dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (body.ok) {
      message.success(body.message);
      return body.id;
    }
  };
};

export const deleteZones = (id, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken("zones/" + id, {}, token, "DELETE");
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (body.ok) {
      message.success(body.message);
      return body.id;
    }
  };
};

export const updateProfile = (values, id, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken("users/profile/" + id, { ...values }, token, "PATCH");
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (body.ok) {
      message.success(body.message);
      return body.data;
    }
  };
};

export const validatePassword = (values, token) => {
  return async (dispatch) => {
    const resp = await useFetchToken("users/password/", { ...values }, token, "POST");
    dispatch(checkSession(resp.status));
    const body = await resp.json();
    if (body.ok) {
      message.success(body.message);
    } else {
      message.error(body.message);
    }
    return body.ok;
  };
};
