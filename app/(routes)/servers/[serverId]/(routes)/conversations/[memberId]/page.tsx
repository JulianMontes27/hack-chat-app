import React from "react";

import prismadb from "@/lib/prismadb";
import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import { findOrCreateConversation } from "@/lib/convos";

import MessageHeader from "../../_components/messages-component-header";
import MessagesComponent from "../../_components/messages-content";
import ChatInput from "../../_components/chat-input";

//this page shows the Conversation instance that the currently signed-in User (current Profile) has with the Member clicked
interface MemberChatPageProps {
  params: { serverId: string; memberId: string };
}

const MemberChatPage: React.FC<MemberChatPageProps> = async ({ params }) => {
  //get the currently signed-in member
  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();

  //get the memberId of the currently signed-in user/profile
  const currentMember = await prismadb.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) return redirect("/");

  //search for an existing Conversation between both Members
  const conversation = await findOrCreateConversation(
    currentMember.id,
    params.memberId //the Member that receives the Conversation iniciation
  );
  if (!conversation) return redirect(`/servers/${params.serverId}`); //automatically go to the general channel

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;
  //since we want to get the OTHER member, if the membeOne.id is the current profile.id, then the other member is memberTwo
  if (!otherMember) return redirect(`/servers/${params.serverId}`);

  return (
    <div className="flex flex-col h-full relative">
      <MessageHeader
        type={"conversation"}
        serverId={params.serverId}
        memberToReceive={otherMember}
        imageUrl={otherMember.profile.imgUrl}
      />
      <div className="flex-1">
        <MessagesComponent
          type={"conversation"}
          name={otherMember.profile.name || ""}
          member={currentMember}
          chatId={conversation.id}
          apiUrl={"/api/messages"}
          socketUrl={"/api/socket/messages"}
          socketQuery={{
            conversationId: conversation.id,
            serverId: params.serverId,
          }}
          paramKey={"channelId"}
          paramValue={conversation.id}
        />
      </div>
      <ChatInput
        apiUrl={"/api/socket/messages"}
        query={{}}
        name={otherMember.profile.name || ""}
        type={"conversation"}
      />
    </div>
  );
};

export default MemberChatPage;
