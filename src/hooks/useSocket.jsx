import { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";

const useSocket = (eventName, eventHandler) => {
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (socket && eventName && eventHandler) {
      socket.on(eventName, eventHandler);

      // Cleanup function to remove the event listener when the component unmounts or the eventHandler changes
      return () => {
        socket.off(eventName, eventHandler);
      };
    }
  }, [socket, eventName, eventHandler]);

  return socket;
};

export default useSocket;
