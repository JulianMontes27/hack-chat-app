import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";

import { ChannelType } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { redirect } from "next/navigation";

import React from "react";

import ServerHeader from "./serverId/server-header";
import Channels from "./serverId/channels";

interface ServerIdChannelsListProps {
  serverId: string;
}

export type ServerWithMembersAndProfiles = Prisma.ServerGetPayload<{
  include: {
    channels: {
      orderBy: {
        createdAt: "asc";
      };
    };
    members: {
      include: {
        profile: true;
      };
      orderBy: {
        role: "asc";
      };
    };
  };
}>;

const ServerIdChannelsList: React.FC<ServerIdChannelsListProps> = async ({
  serverId,
}) => {
  const profile = await currentProfile();
  if (!currentProfile) {
    redirect("/");
  }
  //get all of the server's channels and order by their creation date:
  const server: ServerWithMembersAndProfiles | null =
    await prismadb.server.findUnique({
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
  if (!server) {
    redirect("/");
  }

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
  //get members, and filter them to not show the current profile
  const members = server?.members.filter(
    (member) => member.profileId !== profile?.id
  );
  //find the ROLE of the current profile in the server
  const role = server?.members.find(
    (member) => member.profileId === profile?.id
  )?.role;

  return (
    <div className="flex flex-col h-full w-full dark:bg-[#1e242d] bg-gray-100">
      <ServerHeader server={server} role={role} />
      <Channels channels={server.channels} />
    </div>
  );
};

export default ServerIdChannelsList;
