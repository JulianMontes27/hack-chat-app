"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit, Hash, Trash, Lock, Mic, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

import ActionsTooltip from "../tootltip";
import useModalStore from "@/hooks/use-modal-store";

interface ServerChannelProps {
  channel: Channel;
  server?: Server;
  role?: MemberRole;
}

export const ICON_MAP = {
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const ServerChannel: React.FC<ServerChannelProps> = ({
  channel,
  role,
  server,
}) => {
  const { onOpen } = useModalStore();
  const params = useParams();
  const router = useRouter();

  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    router.push(`/servers/${server?.id}/channels/${channel.id}`);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group relative rounded-md flex items-center w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition flex-row justify-between p-2",
        params?.channelId === channel.id && "bg-zinc-700/20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h1
        className={cn(
          "line-clamp-1 font-semibold text-zinc-500 dark:text-zinc-400 transition-opacity duration-300 relative flex flex-row items-center",
          params?.channelId === channel.id && "text-primary",
          isHovered && "text-fade"
        )}
      >
        {ICON_MAP[channel.type]}
        {channel.name}
      </h1>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="absolute top-0 right-0 flex flex-row gap-3 z-50 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ActionsTooltip label={"Edit"} side="bottom">
            <Edit
              className="text-zinc-100/75 group-hover:text-black h-5 w-5 dark:group-hover:text-white/75 transform hover:scale-125 transition-transform duration-300"
              onClick={(e) => {
                e.stopPropagation();
                onOpen("edit-channel", { server, channel });
              }}
            />
          </ActionsTooltip>
          <ActionsTooltip label={"Delete"} side="bottom">
            <Trash
              className="text-zinc-100/75 group-hover:text-rose-500 h-5 w-5 dark:group-hover:text-rose-200 transform hover:scale-125 transition-transform duration-300"
              onClick={(e) => {
                e.stopPropagation();
                onOpen("delete-channel", { server, channel });
              }}
            />
          </ActionsTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <ActionsTooltip
          label={"'General' channel can't be modified."}
          side="bottom"
        >
          <Lock className="mr-2 dark:text-zinc-200 h-4 w-4" />
        </ActionsTooltip>
      )}
    </button>
  );
};

export default ServerChannel;
