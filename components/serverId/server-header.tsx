"use client";

import { MemberRole } from "@prisma/client";

import React from "react";
import { ServerWithMembersAndProfiles } from "./server-id-channels-list";

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

import {
  ChevronDown,
  LucideAirVent,
  PlusCircleIcon,
  Settings,
  Trash2,
  UserPlus2,
  Users,
} from "lucide-react";
import useModalStore from "@/hooks/use-modal-store";

interface ServerHeaderProps {
  server: ServerWithMembersAndProfiles;
  role?: MemberRole;
}

const ServerHeader: React.FC<ServerHeaderProps> = ({ server, role }) => {
  const { onOpen } = useModalStore();

  //check if the role of the user in the server is ADMIN and/or MOD
  const isAdmin = role === MemberRole.ADMIN;
  const isMod = isAdmin || role === MemberRole.MOD;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="focus:outline-none px-5 dark:border-neutral-800  hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition "
      >
        <div className="group">
          <button className="h-[48px] w-full text-md font-semibold flex flex-row md:justify-between items-center ">
            Server Actions
            <ChevronDown className="h-5 w-5 hidden md:block group-hover:block transition ml-2 group-hover:" />
          </button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isMod && (
          <DropdownMenuItem
            className="text-sm text-sky-700 dark:text-sky-500 cursor-pointer flex flex-row justify-between"
            onClick={() => onOpen("invite-member", { server })}
          >
            Invite dev
            <UserPlus2 />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className=" cursor-pointer flex flex-row justify-between"
            onClick={() => onOpen("edit-server", { server })}
          >
            Server settings
            <span className="font-bold text-yellow-400">(ADMIN)</span>
            <Settings />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className=" cursor-pointer flex flex-row justify-between"
            onClick={() => onOpen("manage-members", { server })}
          >
            <div className="flex items-center flex-row">
              <p className="p-0 m-0">
                Manage members{" "}
                <span className="font-bold text-yellow-400">(ADMIN)</span>
              </p>{" "}
            </div>

            <Users />
          </DropdownMenuItem>
        )}
        {isMod && (
          <DropdownMenuItem
            className=" cursor-pointer flex flex-row justify-between"
            onClick={() => onOpen("create-channel", { server })}
          >
            Create channel
            <span className="font-bold text-indigo-400">(MOD)</span>
            <PlusCircleIcon />
          </DropdownMenuItem>
        )}
        {isMod && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            className=" cursor-pointer flex flex-row justify-between text-red-500"
            onClick={() => onOpen("delete-server", { server })}
          >
            Delete server
            <Trash2 />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            className=" cursor-pointer flex flex-row justify-between"
            onClick={() => onOpen("leave-server", { server })}
          >
            Leave server
            <LucideAirVent />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
