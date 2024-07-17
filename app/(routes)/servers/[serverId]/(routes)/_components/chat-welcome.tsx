import { Channel, ChannelType } from "@prisma/client";
import { Hash, Mic, Video } from "lucide-react";
import React from "react";

interface ChatWelcomeProps {
  type: "channel" | "conversation";
  name: string;
  channel: Channel;
}

const channelType = {
  [ChannelType.AUDIO]: <Mic className=" h-9 w-9" />,
  [ChannelType.TEXT]: <Hash className=" h-9 w-9" />,
  [ChannelType.VIDEO]: <Video className=" h-9 w-9" />,
};

const ChatWelcome: React.FC<ChatWelcomeProps> = ({ type, name, channel }) => {
  return (
    <div className="space-y-2 px-4 mb-4 ">
      {type === "channel" && (
        <div className="flex flex-row items-center gap-3">
          <div className="h-[69px] w-[69px] rounded-full bg-zinc-500 dark:bg-zinc-900/75 flex items-center justify-center">
            {channelType[channel.type]}
          </div>
          <p className="text-xl md:text-3xl font-bold flex flex-row gap-2">
            {type === "channel" ? (
              <span>Welcome to #{name}</span>
            ) : (
              <span>{name}</span>
            )}
          </p>
        </div>
      )}

      {type === "channel" ? (
        <p className="text-zinc-400 text-sm">
          This is the start of the {name} channel
        </p>
      ) : (
        <p className="text-zinc-400 text-sm">
          This is the start of your conversation with {name}
        </p>
      )}
    </div>
  );
};

export default ChatWelcome;
