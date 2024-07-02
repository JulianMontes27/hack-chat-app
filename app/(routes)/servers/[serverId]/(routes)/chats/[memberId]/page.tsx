import React from "react";

import prismadb from "@/lib/prismadb";

const MembersChatPage = async ({
  params,
}: {
  params: { memberId: string; serverId: string };
}) => {
  
  const memberChatWith = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
    },
  });
  return <div>ChatPage</div>;
};

export default MembersChatPage;
