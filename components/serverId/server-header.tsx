"use client";

import { MemberRole } from "@prisma/client";

import React from "react";
import { ServerWithMembersAndProfiles } from "../server-id-channels-list";

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
      <DropdownMenuTrigger asChild className="focus: outline-none">
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
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
          <DropdownMenuItem className=" cursor-pointer flex flex-row justify-between">
            Create channel
            <span className="font-bold text-indigo-400">(MOD)</span>
            <PlusCircleIcon />
          </DropdownMenuItem>
        )}
        {isMod && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem className=" cursor-pointer flex flex-row justify-between text-red-500">
            Delete server
            <Trash2 />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem className=" cursor-pointer flex flex-row justify-between ">
            Leave server
            <LucideAirVent />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
