import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";

import SidebarAction from "./sidebar-action";
import { Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavItem from "./nav-item";

import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

interface SidebarProps {}

const Sidebar = async ({}) => {
  //fetch the current profile
  const profile = await currentProfile();
  if (!profile) {
    redirect("/");
  }
  //find all servers that the user is a parte of
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
    <div className="h-full w-full dark:bg-[#15191f] text-primary space-y-4 flex flex-col items-center border-none ">
      <SidebarAction
        icon={
          <Plus className="group-hover:text-white h-full w-full group-hover:bg-emerald-600 rounded-lg transition-all text-emerald-300" />
        }
      />
      <Separator />
      <ScrollArea className="w-full">
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
