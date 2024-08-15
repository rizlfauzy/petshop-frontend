import { io } from "socket.io-client";

const { VITE_BACKEND } = import.meta.env;

const arr_url = VITE_BACKEND.split("/");

const socket = io(arr_url.splice(0, 3).join("/"), {
  path: arr_url.join('/') == "" ? "/socket.io" : `/${arr_url.join('/')}/socket.io`,
  withCredentials: true,
});

export default socket;
