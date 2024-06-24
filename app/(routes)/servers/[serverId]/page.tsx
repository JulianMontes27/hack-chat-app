import { ModeToggle } from "@/components/providers/themes/toggle-theme";

import prismadb from "@/lib/prismadb";
import { UserButton } from "@clerk/nextjs";

import React from "react";
import ServerPageMainContent from "./components/main-content";

const ServerPage = async ({
  params,
}: {
  params: {
    serverId: string;
  };
}) => {
  const server = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
    },
  });
  if (!server) {
    return null;
  }
  return (
    <div className="h-full">
      <div className="flex items-center justify-end gap-3 px-4 py-2">
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
      <ServerPageMainContent server={server} />
    </div>
  );
};

export default ServerPage;
