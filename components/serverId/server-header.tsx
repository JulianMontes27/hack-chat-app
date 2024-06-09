import { Server } from "@prisma/client";
import { MemberRole } from "@prisma/client";

import React from "react";
import { ServerWithMembersAndProfiles } from "../server-id-channels-list";

interface ServerHeaderProps {
  server: ServerWithMembersAndProfiles;
  role?: MemberRole;
}

const ServerHeader: React.FC<ServerHeaderProps> = ({ server, role }) => {
  //check if the prof
  return (
    <div>
      channels
      {server.channels.map((channel) => (
        <div>{channel.id}</div>
      ))}
    </div>
  );
};

export default ServerHeader;
