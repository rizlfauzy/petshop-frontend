import { useState, useCallback } from "react";

export default function useSession() {
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem("petshop|session")) || null);

  const setSessionData = useCallback((data) => {
    localStorage.setItem("petshop|session", JSON.stringify(data));
    setSession(data);
  }, [setSession]);

  const clearSession = useCallback(() => {
    localStorage.removeItem("petshop|session");
    setSession(null);
  }, [setSession]);

  return { session, setSessionData, clearSession };
}