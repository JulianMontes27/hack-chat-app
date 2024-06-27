"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Trash, Lock, Mic, Video } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

import ActionsTooltip from "../tootltip";

interface ServerChannelProps {
  channel: Channel;
  server?: Server;
  role?: MemberRole;
}

const ServerChannel: React.FC<ServerChannelProps> = ({ channel, role }) => {
  const params = useParams();

  const ICON_MAP = {
    [ChannelType.AUDIO]: <Mic className="mr-2 h-6 w-6" />,
    [ChannelType.TEXT]: <Hash className="mr-2 h-6 w-6" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-6 w-6" />,
  };

  return (
    <button
      onClick={() => {}}
      className={cn(
        "group  rounded-md flex items-center w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 flex-row justify-between p-2",
        params?.channelId === channel.id && "bg-zinc-700/20"
      )}
    >
      <h1
        className={cn(
          "line-clamp-1 font-semibold text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition flex flex-row",
          params?.channelId === channel.id && "text-primary"
        )}
      >
        {ICON_MAP[channel.type]}
        {channel.name}
      </h1>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="flex flex-row gap-3">
          <ActionsTooltip label={"Edit channel"} side="bottom">
            <Edit className="text-zinc-100/75 group-hover:text-black h-5 w-5 hidden group-hover:block  dark:group-hover:text-white/75 transform hover:scale-125 transition-transform duration-300" />
          </ActionsTooltip>
          <ActionsTooltip label={"Delete channel"} side="bottom">
            <Trash className="text-zinc-100/75 group-hover:text-black h-5 w-5 hidden group-hover:block  dark:group-hover:text-white/75 transform hover:scale-125 transition-transform duration-300" />
          </ActionsTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <ActionsTooltip
          label={"'General' channel cant be modified."}
          side="bottom"
        >
          <Lock className="mr-2 text-zinc-200 h-4 w-4" />
        </ActionsTooltip>
      )}
    </button>
  );
};

export default ServerChannel;
