"use client";

import { createContext, useEffect, useState, useContext } from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

//The Context API provides a means to share values like state, functions, or any data across the component tree without passing props down manually at every level. This is particularly useful for global data that many components need to access.

// Creates a context with default values (null socket and false connection status).
export const SocketContext = createContext<SocketContextType>({
  //default values
  socket: null,
  isConnected: false,
});

//Custom hook to use the SocketContext in functional components. It simplifies accessing the context values.
export const useSocket = () => {
  return useContext(SocketContext);
};

//Context provider component that wraps around any children components to provide them with the socket instance and connection status.
export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        //options
        path: "/api/socket1/io",
        addTrailingSlash: false,
      }
    );

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    //Updates the state with the new socket instance.
    setSocket(socketInstance);

    // Disconnects the socket when the component unmounts to prevent memory leaks.
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
