import React from "react";

import prismadb from "@/lib/prismadb";
import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import { findOrCreateChat } from "@/lib/chat";

import ChatHeader from "@/components/serverId/chats/chat-header";
import ChatInput from "./chat-input";
import { channel } from "diagnostics_channel";

//this page shows the Chat instance that the currently signed-in user (or current profile) has with the Member clicked

interface MemberChatPageProps {
  params: { serverId: string; memberId: string };
}

const MemberChatPage: React.FC<MemberChatPageProps> = async ({ params }) => {
  //get the currently signed-in member
  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();

  //get the memberId of the currently signed-in user/profile
  const member = await prismadb.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params.serverId,
    },
    include: {
      profile: true,
    },
  });

  if (!member) return redirect("/");

  const currentMemberId = member.id;

  //search for an existing chat between both
  const chat = await findOrCreateChat(currentMemberId, params.memberId);
  if (!chat) return redirect(`/servers/${params.serverId}`); //automatically go to the general channel

  // const keys = Object.keys(chat);
  // console.log(keys);

  const { memberOne, memberTwo } = chat;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;
  //since we want to get the OTHER member, if the membeOne.id is the current profile.id, then the other member is memberTwo
  if (!otherMember) return redirect(`/servers/${params.serverId}`);

  return (
    <div className="flex flex-col h-full relative">
      <ChatHeader
        serverId={params.serverId}
        member={otherMember}
        type={"chat"}
        imageUrl={otherMember.profile.imgUrl}
      />
      <ChatInput
        apiUrl={"/api/socket/messages"}
        query={{ undefined }}
        name={channel.name}
        type={"chat"}
      />
    </div>
  );
};

export default MemberChatPage;
