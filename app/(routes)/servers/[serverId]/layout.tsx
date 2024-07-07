import React from "react";

import ServerIdChannelsList from "@/components/serverId/server-id-channels-list";

import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

interface ServerIdLayoutProps {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
}

const ServerIdLayout: React.FC<ServerIdLayoutProps> = async ({
  children,
  params,
}) => {
  //get the current user
  const profile = await currentProfile();
  if (!profile) {
    //profile is null
    return auth().redirectToSignIn();
  }

  const server = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (!server) {
    redirect("/");
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerIdChannelsList serverId={server.id} />
      </div>

      <div className="md:pl-60 flex-col h-full">
        <div className="h-full">{children}</div>
      </div>
    </div>
  );
};

export default ServerIdLayout;
