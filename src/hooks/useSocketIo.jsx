import { io } from "socket.io-client";
import { useCallback, useReducer, useRef } from "react";
import useSafeDispatch from "./useSafeDispatch";

const defaultState = {
  data: null,
  status: "idle",
  error: null,
};

const {VITE_BACKEND} = import.meta.env;

export default function useSocketIo() {
  const socket = io(VITE_BACKEND, {
    withCredentials: true,
    extraHeaders: {
      "my-custom-header": "abcd",
    },
  });
  socket.connect();
  const intialStateRef = useRef({ ...defaultState });
  const [{ data, status, error }, setState] = useReducer((s, a) => ({ ...s, ...a }), intialStateRef.current);
  const safeSetState = useSafeDispatch(setState);
  const run_socket = useCallback((name, emit) => {
    try {
      if (!name) throw new Error("useSocketIo.run_socket must receive a name");
      if (!emit) throw new Error("useSocketIo.run_socket must receive a emit");
      safeSetState({ status: "pending" });
      socket.emit(name, emit);
      socket.on(name, (res) => {
        safeSetState({ status: "resolved", data: res });
      });
    } catch (e) {
      safeSetState({ status: "rejected", error: e });
    }
  }, [safeSetState, socket]);
  const setData = useCallback((data) => safeSetState({ data }), [safeSetState]);
  const setError = useCallback((error) => safeSetState({ error }), [safeSetState]);
  const reset_socket = useCallback(() => safeSetState(intialStateRef.current), [safeSetState]);
  return {
    data_socket: data,
    status,
    error,
    run_socket,
    setData,
    setError,
    reset_socket,
    isIdle: status === "idle",
    is_loading_socket: status === "idle" || status === "pending",
    isError: status === "rejected",
    isSuccess: status === "resolved",
  };
}