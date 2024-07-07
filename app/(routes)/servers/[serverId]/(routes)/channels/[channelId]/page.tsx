import ChatHeader from "@/components/serverId/chats/chat-header";

import { currentProfile } from "@/lib/current-profile";

import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

import ChatInput from "../../chats/[memberId]/chat-input";

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
  });

  if (!channel || !member) return redirect("/");

  return (
    <div className="h-full flex flex-col relative w-full">
      <ChatHeader
        serverId={params.serverId}
        channel={channel}
        type={"channel"}
      />
      <ChatInput
        apiUrl={"/api/socket/messages"}
        query={{ channelId: channel.id, serverId: channel.serverId }}
        name={channel.name}
        type={"channel"}
      />
    </div>
  );
};

export default ServerChannelPage;
