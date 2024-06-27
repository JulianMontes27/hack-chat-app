"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, User } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import UserAvatar from "../modals/manage-members/user-avatar";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const ICON_MAP = {
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-5 w-5 text-rose-400" />,
  [MemberRole.GUEST]: null,
  [MemberRole.MOD]: <User className="mr-2 h-5 w-5" />,
};

const ServerMember: React.FC<ServerMemberProps> = ({ member }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <button
      className={cn(
        "group rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 flex-row justify-between p-1",
        params?.memberId === member.id && "bg-zinc-700/20"
      )}
    >
      <h1 className="flex flex-row w-full dark:text-zinc-400  text-zinc-600 items-center justify-between dark:group-hover:text-white transition">
        <div className="flex flex-row items-center gap-2">
          <UserAvatar src={member.profile.imgUrl} className="border-none" />
          {member.profile.name}
        </div>

        {ICON_MAP[member.role]}
      </h1>
    </button>
  );
};

export default ServerMember;
