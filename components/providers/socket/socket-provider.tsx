"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { io as SocketClientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocketContext = () => {
  //Call useContext to read and subscribe to the context
  return useContext(SocketContext);
};

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  //when the provider first mounts...
  useEffect(() => {
    //initiate a socket instance
    const socketIoInstance = new (SocketClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL!, //localhost by default in development
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      }
    );
    socketIoInstance.on("connect", () => {
      setIsConnected(true);
    });
    socketIoInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketIoInstance);

    return () => {
      socketIoInstance.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
