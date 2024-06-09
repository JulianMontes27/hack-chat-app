import prismadb from "@/lib/prismadb";
import { Server } from "@prisma/client";
import { ChannelType } from "@prisma/client";

import React from "react";

interface ServerIdChannelsListProps {
  serverId: string;
}

const ServerIdChannelsList: React.FC<ServerIdChannelsListProps> = async ({
  serverId,
}) => {
  //get all of the server's channels and order by their creation date:
  const server = await prismadb.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  //separate channels by their type
  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  return (
    <div>
      <header>{server?.name}</header>
    </div>
  );
};

export default ServerIdChannelsList;
