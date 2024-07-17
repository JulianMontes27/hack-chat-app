import { currentProfile } from "@/lib/current-profile";

import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

import MessageHeader from "../../_components/messages-component-header";
import MessagesComponent from "../../_components/messages-content";
import ChatInput from "../../_components/chat-input";

const ServerChannelPage = async ({
  params,
}: {
  params: { channelId: string; serverId: string };
}) => {
  //auth
  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();

  const channel = await prismadb.channel.findUnique({
    where: {
      serverId: params.serverId,
      id: params.channelId,
    },
  });
  const member = await prismadb.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!channel || !member) return redirect("/");

  return (
    <div className="flex flex-col relative w-full h-full">
      <MessageHeader
        serverId={params.serverId}
        channel={channel}
        type={"channel"}
      />
      <div className="flex-1 mt-12">
        <MessagesComponent
          name={channel.name}
          member={member}
          channel={channel}
          chatId={channel.id}
          apiUrl={"/api/messages"}
          socketUrl={"/api/socket/messages"}
          socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
          paramKey={"channelId"}
          paramValue={channel.id}
          type={"channel"}
        />
      </div>
      <ChatInput
        apiUrl={"/api/socket/messages"}
        query={{
          channelId: channel.id,
          serverId: channel.serverId,
        }}
        type={"channel"}
        name={channel.name}
      />
    </div>
  );
};

export default ServerChannelPage;
