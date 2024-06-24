import { Server } from "@prisma/client";

import React from "react";

interface ServerPageMainContentProps {
  server: Server;
}

const ServerPageMainContent: React.FC<ServerPageMainContentProps> = ({
  server,
}) => {
  return <div>{server.name}</div>;
};

export default ServerPageMainContent;
