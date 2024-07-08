//The Socket.IO server can share the same underlying HTTP server with Next.js
import { Server as SocketIOServer } from "socket.io";
import { Server as NetServer } from "http";

import { NextApiRequest } from "next";

import { NextApiResponseServerIO } from "@/types/types";

//This code sets up a Socket.IO server that shares the underlying HTTP server used by Next.js. It ensures the server is only initialized once, configures the server path, and attaches the Socket.IO server instance to the HTTP server. This setup allows for real-time communication in a Next.js application, suitable for features like live chats, notifications, and other real-time interactions.
//The HTTP Server handles Next.js page requests, API routes, and WebSocket connections.
export const config = {
  api: {
    bodyParser: false,
  },
};
const SocketHanlder = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  // checks if the Socket.IO server is already initialized to avoid reinitializing it.
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }
  //res.socket.server.io is a custom property that holds the Socket.IO server instance.
  //Defines the path for the Socket.IO server. This should match the client-side configuration.
  const path = "/api/socket/io";
  //Casts the Next.js server to a Node.js HTTP server.
  const httpServer: NetServer = res.socket.server as any;
  //Creates a new Socket.IO server instance:
  const io = new SocketIOServer(httpServer, {
    path: path,
    addTrailingSlash: false,
  });
  res.socket.server.io = io;

  res.end();
};

export default SocketHanlder;
