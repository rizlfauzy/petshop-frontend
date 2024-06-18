// env
const { VITE_PREFIX_API} = import.meta.env;

export function fetch_data({ url, method, data, headers = {}, host = VITE_PREFIX_API }) {
  if (host == '/') host = '';
  return fetch(`${host}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => res);
}

export function fetch_file({ url, method, data, headers= {}, host = VITE_PREFIX_API }) {
  if (host == "/") host = "";
  return fetch(`${host}${url}`, {
    method,
    headers,
    body: data,
  }).then(res => res.json())
    .then(res => res);
}

export function get_data({ url, headers = {}, host = VITE_PREFIX_API }) {
  if (host == "/") host = "";
  return fetch(`${host}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    method: "GET",
  }).then((res) => res.json())
    .then(res => res);
}