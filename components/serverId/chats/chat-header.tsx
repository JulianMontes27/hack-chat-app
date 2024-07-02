import React from "react";

import { Hash } from "lucide-react";
import MobileDropdown from "./mobile-dropdown";

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
        <MobileDropdown />
      </div>
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      <h1>{name}</h1>
    </div>
  );
};

export default ChatHeader;
