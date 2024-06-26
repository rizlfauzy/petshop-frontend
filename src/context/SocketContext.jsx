import { useEffect, createContext } from "react";
import socket from "../utils/socket";
import PropTypes from "prop-types";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    // Cleanup function to remove listeners when the component unmounts
    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

SocketProvider.propTypes = {
  children: PropTypes.node,
};