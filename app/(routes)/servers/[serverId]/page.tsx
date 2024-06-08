import { ModeToggle } from "@/components/providers/themes/toggle-theme";
import prismadb from "@/lib/prismadb";
import { UserButton } from "@clerk/nextjs";
import React from "react";

const ServerPage = async ({
  params,
}: {
  params: {
    serverId: string;
  };
}) => {
  const selectedServer = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
    },
  });
  return (
    <div className="w-full flex flex-row justify-between px-2 py-1">
      <div>
        <div className="flex items-center">
          {params.serverId}
          <ModeToggle />
        </div>
      </div>
      <div>
        <UserButton />
      </div>
    </div>
  );
};

export default ServerPage;
