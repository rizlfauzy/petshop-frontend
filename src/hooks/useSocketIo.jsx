import { io } from "socket.io-client";

const {VITE_BACKEND} = import.meta.env;

export default function useSocketIo() {
  const socket = io(VITE_BACKEND, {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd",
    },
  });
  socket.connect();
  return socket;
}