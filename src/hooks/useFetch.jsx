// env
const { VITE_PREFIX_API} = import.meta.env;

export function fetch_data({ url, method, data, headers = {}, host = VITE_PREFIX_API }) {
  if (host == '/') host = '';
  return fetch(`${host}${url}`, {
    method,
    headers,
    body: data,
  }).then((res) => res.json())
    .then(res => res);
}

export function fetch_file({ url, method = "GET", data, host = VITE_PREFIX_API }) {
  if (host == "/") host = "";
  return fetch(`${host}${url}`, {
    method,
    mode: "cors",
    body: data,
  }).then(async (res) => {
    const response_json = await res.json();
    if (res.ok) return response_json;
    return response_json;
  });
}

export function get_data({ url, headers = {}, host = VITE_PREFIX_API }) {
  if (host == "/") host = "";
  return fetch(`${host}${url}`, {
    headers,
    method: "GET",
  }).then((res) => res.json())
    .then(res => res);
}