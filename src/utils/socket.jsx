import { io } from "socket.io-client";

const { VITE_BACKEND } = import.meta.env;

const socket = io(VITE_BACKEND, {
  withCredentials: true,
});

export default socket;