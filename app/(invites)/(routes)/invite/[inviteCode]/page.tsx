import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

import React from "react";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
}

const InviteCodePage: React.FC<InviteCodePageProps> = async ({ params }) => {
  //check if the recipient is authed
  const profile = await currentProfile();
  if (!profile) {
    return auth().redirectToSignIn();
  }

  if (!params.inviteCode) redirect("/");

  //check if the recipient is already a member in the server
  let server = await prismadb.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });
  //the recipient is ALREADY member of the server
  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  //if the recipient is NOT a member
  server = await prismadb.server.update({
    where: {
      inviteCode: params.inviteCode,
    },
    data: {
      members: {
        create: [{ profileId: profile.id }],
      },
    },
  });

  return redirect(`/servers/${server.id}`);
};

export default InviteCodePage;
