import { Hash } from "lucide-react";
import React from "react";

interface ChatWelcomeProps {
  type: "channel" | "conversation";
  name: string;
}

const ChatWelcome: React.FC<ChatWelcomeProps> = ({ type, name }) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {type === "channel" && (
        <div className="h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-900/75 flex items-center justify-center">
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold flex flex-row gap-2">
        {type === "channel" ? (
          <span>Welcome to #{name}</span>
        ) : (
          <span>{name}</span>
        )}
      </p>
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
