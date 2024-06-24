import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";

import SidebarAction from "./sidebar-action";
import { Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavItem from "./nav-item";

import { redirect } from "next/navigation";
import React from "react";

const Sidebar = async ({}) => {
  //fetch the current profile
  const profile = await currentProfile();
  if (!profile) {
    redirect("/");
  }
  //find all servers that the user is a part of
  const servers = await prismadb.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className="h-full w-full bg-[#D3D3D3] dark:bg-[#191e25] text-primary  flex flex-col items-center border-none ">
      <SidebarAction />
      <Separator />

      <ScrollArea className="w-full mt-6">
        {servers.map((server) => (
          <div
            key={server.id}
            className="w-full flex items-center justify-center mb-4"
          >
            <NavItem
              id={server.id}
              imageUrl={server.imgUrl}
              name={server.name}
            />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
