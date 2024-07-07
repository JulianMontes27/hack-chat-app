import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";

import { ChannelType } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { redirect } from "next/navigation";

import React from "react";

import ServerHeader from "./server-header";
import Channels from "./channels";
import { Mic, ShieldCheckIcon, Text, User, Video } from "lucide-react";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";

interface ServerIdChannelsListProps {
  serverId: string;
}

interface ChannelsProps {
  label: string;
  type: "channel" | "member";
  data:
    | {
        icon: React.ReactNode;
        name: string | null;
        id: string;
      }[]
    | undefined;
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

  //find the ROLE of the current profile in the server
  const role = server?.members.find(
    (member) => member.profileId === profile?.id
  )?.role;

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

  const data: ChannelsProps[] = [
    {
      label: "Text",
      type: "channel",
      data: textChannels.map((channel) => ({
        icon: <Text className="mr-2 h-4 w-4" />,
        name: channel.name,
        id: channel.id,
      })),
    },
    {
      label: "Audio",
      type: "channel",
      data: audioChannels.map((channel) => ({
        icon: <Mic className="mr-2 h-4 w-4" />,
        name: channel.name,
        id: channel.id,
      })),
    },
    {
      label: "Video",
      type: "channel",
      data: videoChannels.map((channel) => ({
        icon: <Video className="mr-2 h-4 w-4" />,
        name: channel.name,
        id: channel.id,
      })),
    },
    {
      label: "Members",
      type: "member",
      data: members.map((member) => ({
        icon:
          member.role === "GUEST" ? (
            <User className="mr-2 h-4 w-4" />
          ) : (
            <ShieldCheckIcon className="mr-2 h-4 w-4 text-rose-400" />
          ),
        name: member.profile.name,
        id: member.id,
      })),
    },
  ];

  return (
    <div className="flex flex-col h-full w-full dark:bg-[#1e242d] bg-gray-100">
      <ServerHeader server={server} role={role} />
      <Channels data={data} />
      {/* //text channels */}
      <section className="flex flex-col gap-4 p-2">
        <div>
          {!!textChannels.length && (
            <section>
              <ServerSection
                channelType={ChannelType.TEXT}
                sectionType={"channels"}
                role={role}
                label={"Text Channels"}
                server={server}
              />
              {/* //map text channels */}
              {textChannels.map((channel) => (
                <ServerChannel
                  channel={channel}
                  server={server}
                  role={role}
                  key={channel.id}
                />
              ))}
            </section>
          )}
        </div>
        {/* //uadio channels */}
        <section>
          {!!audioChannels.length && (
            <div>
              <ServerSection
                channelType={ChannelType.AUDIO}
                sectionType={"channels"}
                role={role}
                label={"Audio Channels"}
                server={server}
              />
              {/* //map text channels */}
              {audioChannels.map((channel) => (
                <ServerChannel
                  channel={channel}
                  role={role}
                  key={channel.id}
                  server={server}
                />
              ))}
            </div>
          )}
        </section>
        {/* //uadio channels */}
        <section>
          {!!videoChannels.length && (
            <div>
              <ServerSection
                server={server}
                channelType={ChannelType.VIDEO}
                sectionType={"channels"}
                role={role}
                label={"Video Channels"}
              />
              {/* //map text channels */}
              {videoChannels.map((channel) => (
                <ServerChannel
                  channel={channel}
                  role={role}
                  key={channel.id}
                  server={server}
                />
              ))}
            </div>
          )}
        </section>
        {/* //uadio channels */}
        <section>
          {!!members.length && (
            <div>
              <ServerSection
                server={server}
                channelType={ChannelType.AUDIO}
                sectionType={"members"}
                role={role}
                label={"Members"}
              />
              {/* //map text channels */}
              {members.map((member) => (
                <ServerMember key={member.id} member={member} server={server} />
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
};

export default ServerIdChannelsList;
