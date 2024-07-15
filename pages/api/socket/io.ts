import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Create a socket.io server
const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  //only if the socket io server does NOT exist
  if (!res.socket.server.io) {
    console.log("*First use, starting Socket.IO");
    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
