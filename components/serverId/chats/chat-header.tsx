import React from "react";

import { Hash } from "lucide-react";
import MobileDropdown from "./mobile-dropdown";
import UserAvatar from "@/components/modals/manage-members/user-avatar";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "chat";
  imageUrl?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  serverId,
  name,
  type,
  imageUrl,
}) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 ">
      <div className="md:hidden">
        <MobileDropdown serverId={serverId} />
      </div>
      <div className="flex flex-row items-center gap-2 h-full w-full">
        {type === "channel" && (
          <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
        )}
        {type === "chat" && imageUrl && <UserAvatar src={imageUrl} />}
        <h1>{name}</h1>
      </div>
    </div>
  );
};

export default ChatHeader;
