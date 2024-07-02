import React from "react";

import ServerIdChannelsList from "@/components/serverId/server-id-channels-list";

import { currentProfile } from "@/lib/current-profile";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import { ModeToggle } from "@/components/providers/themes/toggle-theme";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

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
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerIdChannelsList serverId={server.id} />
      </div>

      <div className="h-full md:pl-60 flex-col ">
        <div className="items-center justify-between gap-3 px-4 py-2 md:flex hidden ">
          <Link href={"/"}>{server.name}</Link>
          <div className="flex flex-row items-center gap-4">
            <ModeToggle />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-[48px] w-[48px]",
                },
              }}
            />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ServerIdLayout;
