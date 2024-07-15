import MobileDropdown from "../../../../../../components/serverId/mobile-dropdown";
import UserAvatar from "@/components/modals/manage-members/user-avatar";
import SocketIndicator from "./socket-indicator";

import { ModeToggle } from "@/components/providers/themes/toggle-theme";
import { UserButton } from "@clerk/nextjs";
import { Channel, ChannelType, Member, Profile } from "@prisma/client";

import { Hash, Mic, Video } from "lucide-react";

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
    <div className="text-md font-semibold px-3 flex items-center  gap-2.5 justify-around md:p-3">
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
      <div className="flex flex-row items-center gap-2">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[40px] w-[40px]",
            },
          }}
        />
      </div>
    </div>
  );
};

export default MessageHeader;
