"use client";

import { Channel, Member, Message, Profile } from "@prisma/client";

import React, { Fragment } from "react";

import ChatWelcome from "./chat-welcome";
import ChatItem from "./chat-item";

import { useChatQuery } from "@/hooks/use-chat-query";

import { Loader, ServerCrash } from "lucide-react";

import { format } from "date-fns";

interface MessagesComponentProps {
  name: string;
  member: Member;
  channel: Channel;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

const DATE_FORMAT = "d MMM yyyy, HH:mm";

const MessagesComponent: React.FC<MessagesComponentProps> = ({
  name,
  member,
  channel,
  chatId,
  apiUrl,
  socketQuery,
  socketUrl,
  paramKey,
  paramValue,
  type,
}) => {
  const queryKey = `chat:${chatId}`;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  // status === "pending" ? (
  //       <div className="flex flex-col flex-1 justify-center">
  //         <Loader className="h-6 w-6 text-zinc-500 animate-spin" />
  //       </div>
  //     ) :

  return (
    <div className="flex flex-col flex-1 overflow-y-auto py-4">
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} channel={channel} />
      <div className="flex flex-col-reverse mt-auto">
        {status === "error" ? (
          <div className="flex flex-col flex-1 justify-center">
            <ServerCrash className="h-6 w-6 text-zinc-500 " />
          </div>
        ) : (
          <div>
            {data?.pages?.map((group, i) => (
              <Fragment key={i}>
                {group.data.map((message: MessageWithMemberWithProfile) => (
                  <ChatItem
                    key={message.id}
                    id={message.id}
                    content={message.content}
                    member={message.member}
                    timeStamp={format(new Date(message.createdAt), DATE_FORMAT)}
                    fileUrl={message.fileUrl}
                    deleted={message.deleted}
                    currentMember={member}
                    isUpdated={message.updatedAt === message.createdAt}
                    socketUrl={socketUrl}
                    socketQuery={socketQuery}
                  />
                ))}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesComponent;
