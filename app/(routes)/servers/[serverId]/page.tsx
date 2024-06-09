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
        <div className="flex items-center">{selectedServer?.name}</div>
      </div>
      <div className="">
        <div className="flex items-center p-0 m-0 gap-4">
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
    </div>
  );
};

export default ServerPage;
