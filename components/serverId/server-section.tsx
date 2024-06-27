"use client";

import { ChannelType, MemberRole } from "@prisma/client";
import React from "react";
import { ServerWithMembersAndProfiles } from "./server-id-channels-list";
import ActionsTooltip from "../tootltip";
import { Plus } from "lucide-react";

import useModalStore from "@/hooks/use-modal-store";

interface ServerSectionProps {
  role?: MemberRole;
  label: string;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersAndProfiles;
}

const ServerSection: React.FC<ServerSectionProps> = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}) => {
  const { onOpen } = useModalStore();
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {/* //only for mods and admins */}
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionsTooltip label={"Add server"}>
          <Plus
            className="mr-2 h-4 w-4 cursor-pointer"
            onClick={() => onOpen("create-channel")}
          />
        </ActionsTooltip>
      )}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionsTooltip label={"Members"}>
          <Plus
            className="mr-2 h-4 w-4 cursor-pointer"
            onClick={() => onOpen("manage-members", { server })}
          />
        </ActionsTooltip>
      )}
    </div>
  );
};

export default ServerSection;
