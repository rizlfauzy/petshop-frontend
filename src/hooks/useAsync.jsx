import { useCallback, useReducer, useRef } from "react";
import useSafeDispatch from "./useSafeDispatch";

const defaultState = {
  data: null,
  status: "idle",
  error: null,
};

export default function useAsync(initialState) {
  const intialStateRef = useRef({ ...defaultState, ...initialState });
  const [{ data, status, error }, setState] = useReducer((s, a) => ({ ...s, ...a }), intialStateRef.current);
  const safeSetState = useSafeDispatch(setState);

  const run = useCallback(
    (promise) => {
      if (!promise || !promise.then) throw new Error("useAsync.run must receive a promise");
      safeSetState({ status: "pending" });
      return promise.then(
        (data) => {
          safeSetState({ status: "resolved", data });
          return data;
        },
        (error) => {
          safeSetState({ status: "rejected", error: JSON.parse(error.message) });
          return error;
        }
      );
    },
    [safeSetState]
  );

  const setData = useCallback((data) => safeSetState({ data }), [safeSetState]);
  const setError = useCallback((error) => safeSetState({ error }), [safeSetState]);
  const reset = useCallback(() => safeSetState(intialStateRef.current), [safeSetState]);

  return {
    data,
    status,
    error,
    run,
    setData,
    setError,
    reset,
    isIdle: status === "idle",
    isLoading: status === "idle" || status === "pending",
    isError: status === "rejected",
    isSuccess: status === "resolved",
  };
}
