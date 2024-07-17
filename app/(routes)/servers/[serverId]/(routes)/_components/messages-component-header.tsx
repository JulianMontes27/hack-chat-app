import MobileDropdown from "../../../../../../components/serverId/mobile-dropdown";
import UserAvatar from "@/components/modals/manage-members/user-avatar";
import SocketIndicator from "./socket-indicator";

import { Channel, ChannelType, Member, Profile } from "@prisma/client";

import { Hash, Mic, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  serverId: string;
  channel?: Channel;
  memberToReceive?: Member & { profile: Profile };
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ICON_MAP = {
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const MessageHeader: React.FC<ChatHeaderProps> = ({
  serverId,
  channel,
  type,
  imageUrl,
  memberToReceive,
}) => {
  return (
    <div
      className={cn(
        "fixed z-999 top-0 w-full p-3 text-xl font-semibold flex items-center"
      )}
    >
      <div className="flex flex-row gap-2">
        <div className="md:hidden">
          <MobileDropdown serverId={serverId} />
        </div>
        <div className="flex flex-row items-center h-full">
          {type === "channel" && channel && (
            <h1 className="flex flex-row items-center">
              {ICON_MAP[channel.type]}
              <p>{channel?.name}</p>
            </h1>
          )}
          {type === "conversation" && memberToReceive && (
            <h1 className="flex flex-row gap-4 items-center">
              <div className="flex flex-row items-center gap-2">
                <UserAvatar src={imageUrl} />
                <p>{memberToReceive.profile.name}</p>
              </div>
            </h1>
          )}
        </div>
        <SocketIndicator />
      </div>
    </div>
  );
};

export default MessageHeader;
