import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

//web sockets allow for the browser and server to communicate with each other continuously without having to close the connection after each exchange. This makes it great for live apps like messaging apps.
//This custom type extends the NextApiResponse to include a socket property, which in turn includes a server property with an optional io attribute of type ServerIO
export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
