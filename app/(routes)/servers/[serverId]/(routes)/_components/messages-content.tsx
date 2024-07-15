"use client";

import { useSocketContext } from "@/components/providers/socket/socket-provider";
import { Member } from "@prisma/client";
import React from "react";
import ChatWelcome from "./chat-welcome";

interface MessagesComponentProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

const MessagesComponent: React.FC<MessagesComponentProps> = ({
  name,
  member,
  chatId,
  apiUrl,
  socketQuery,
  socketUrl,
  paramKey,
  paramValue,
  type,
}) => {
  const { socket, isConnected } = useSocketContext();
  return (
    <div className="flex flex-col flex-1 overflow-y-auto py-4">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
    </div>
  );
};

export default MessagesComponent;
