const baseUrl = process.env.REACT_APP_API_URL;

export const useFetch = (endpoint, data, method = "GET") => {
  const url = `${baseUrl}/${endpoint}`;
  if (method === "GET") {
    return fetch(url);
  } else {
    return fetch(url, {
      method,
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
};

export const useFetchToken = (endpoint, data, token, method = "GET") => {
  const url = `${baseUrl}/${endpoint}`;
  if (method === "GET") {
    return fetch(url, {
      method,
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
  } else {
    return fetch(url, {
      method,
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    });
  }
};
