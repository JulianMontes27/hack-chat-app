"use client";

import qs from "query-string";

import axios from "axios";

import useModalStore from "@/hooks/use-modal-store";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import UserAvatar from "./user-avatar";

import { ServerWithMembersAndProfiles } from "@/components/serverId/server-id-channels-list";
import {
  Check,
  GavelIcon,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";

import toast from "react-hot-toast";

import { MemberRole } from "@prisma/client";
import { useRouter } from "next/navigation";

const roleIconMap = {
  GUEST: null,
  MOD: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

export default function ManageServerMembers() {
  const { isOpen, onClose, modalType, data, onOpen } = useModalStore();

  const [loadingId, setLoadingId] = useState("");

  const router = useRouter();

  const { server } = data as { server: ServerWithMembersAndProfiles };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });
      const res = await axios.patch(url, { role });

      router.refresh();
      onOpen("manage-members", { server: res.data });
    } catch (error) {
      toast.error("Try again.");
    } finally {
      setLoadingId("");
    }
  };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      });
      const res = await axios.delete(url);
      router.refresh();
      onOpen("manage-members", { server: res.data });
    } catch (error) {
      toast.error("Error kicking member.");
    } finally {
      setLoadingId("");
    }
  };
  return (
    <Dialog
      open={isOpen && modalType === "manage-members"}
      onOpenChange={onClose}
    >
      <DialogContent className="bg-white text-black sm:max-w-[425px] overflow-hidden rounded-md">
        <DialogHeader className="py-3 px-3">
          <DialogTitle className="font-bold text-2xl mb-2">
            Manage members
          </DialogTitle>
          <DialogDescription className="flex flex-col w-full items-star gap-2 text-[16px] font-semibold ">
            <span>{server?.members?.length} Members</span>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[420px] w-full rounded-md mt-8">
          {server?.members?.map((member) => (
            <div
              key={member.id}
              className="mb-6 flex flex-row justify-between items-center"
            >
              <div>
                <div className="flex flex-row items-center gap-3">
                  <UserAvatar src={member.profile.imgUrl} />
                  <p>{member.profile.name}</p>
                  {roleIconMap[member.role]}
                </div>
                <div>
                  <span className="text-sm text-zinc-500/90 mt-2">
                    {member.profile.email}
                  </span>
                </div>
              </div>
              <div>
                {server.profileId !== member.profileId &&
                  loadingId !== member.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <MoreVertical className="cursor-pointer text-zinc-500/90" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="dark:bg-zinc-50 bg-white border-none text-black"
                        side="left"
                      >
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <ShieldQuestion />
                            <span className="ml-3">Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, "GUEST")}
                              >
                                <Shield /> Guest
                                {member.role === "GUEST" && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, "MOD")}
                              >
                                <ShieldCheck /> Moderator
                                {member.role === "MOD" && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onKick(member.id)}>
                          <GavelIcon className="mr-3" /> kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
              </div>
              {loadingId == member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
